import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CardData, IssueContent, Project, ProjectChange } from "../models";
import {
  addLabel,
  addProjectLabel,
  removeLabels,
  verifySignature,
} from "../util";
import { App } from "octokit";
import { queryCard, queryIssue, queryProject } from "../graphql";
import {
  GetTableEntityResponse,
  TableClient,
  TableEntityResult,
} from "@azure/data-tables";

export async function project(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const change = (await request.json()) as ProjectChange;
  const isValid = verifySignature(request, change);

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n");

  if (!isValid || !change.projects_v2_item) {
    return { status: 401, body: "Unauthorized" };
  }

  if (change.projects_v2_item?.content_type !== "Issue") {
    return { status: 200, body: "Not an issue" };
  }

  // Verify if it is not a duplicate
  const deliveryId = request.headers.get("X-GitHub-Delivery");
  if (!deliveryId) {
    return { status: 400, body: "Bad request" };
  }

  const client = TableClient.fromConnectionString(
    process.env.AzureWebJobsStorage,
    "deliveryIds"
  );
  await client.createTable();
  let tableEntry: GetTableEntityResponse<
    TableEntityResult<Record<string, unknown>>
  >;
  try {
    tableEntry = await client.getEntity(deliveryId, "deliveryId");
  } catch (e) {
    // Entry does not exist, so that is good
  }

  if (tableEntry) {
    context.log("Already processed");
    // return { status: 200, body: "Already processed" };
  }

  // Create the project app connection
  const projectApp = new App({
    appId,
    privateKey,
  });
  const projectOctokit = await projectApp.getInstallationOctokit(
    change.installation.id
  );

  if (change.action === "created" || change.action === "edited") {
    try {
      // Get project information
      const cardData = await projectOctokit.graphql<CardData>(
        queryCard(change.projects_v2_item.node_id)
      );

      // Create the repository app connection
      const repoApp = new App({
        appId,
        privateKey,
      });

      const owner = cardData.node.content.repository.owner.login;
      const repo = cardData.node.content.repository.name;
      const issueId = cardData.node.content.number;
      const issueLabels = cardData.node.content.labels.nodes;
      const projectLabels = cardData.node.project.field.options;
      const crntLabel = cardData.node.fieldValueByName.name;

      // Get the installation ID from my personal account
      const { data: installation } =
        await repoApp.octokit.rest.apps.getRepoInstallation({
          owner,
          repo,
        });

      const repoOctokit = await repoApp.getInstallationOctokit(installation.id);

      // Get the labels
      const { data: labels } = await repoOctokit.rest.issues.listLabelsForRepo({
        owner,
        repo,
        per_page: 100,
      });

      const repoLabels = labels.map((label) => label.name);

      // Add the project label
      await addProjectLabel(
        repoOctokit,
        owner,
        repo,
        issueId,
        repoLabels,
        cardData.node.project.title,
        `Project: ${cardData.node.project.title}`
      );

      // Add the new project status label
      await addLabel(
        repoOctokit,
        owner,
        repo,
        issueId,
        repoLabels,
        crntLabel,
        projectLabels
      );

      // Remove the labels from the issue that are not the current status
      await removeLabels(
        repoOctokit,
        owner,
        repo,
        issueId,
        issueLabels.map((label) => label.name),
        projectLabels,
        crntLabel
      );
    } catch (e) {
      context.log("Error on create/edit", e.message);
      return { status: 500, body: e.message };
    }
  } else if (change.action === "deleted") {
    try {
      const issueData = await projectOctokit.graphql<{ node: IssueContent }>(
        queryIssue(change.projects_v2_item.content_node_id)
      );

      const projectData = await projectOctokit.graphql<{ node: Project }>(
        queryProject(change.projects_v2_item.project_node_id)
      );

      // Create the repository app connection
      const repoApp = new App({
        appId,
        privateKey,
      });

      const owner = issueData.node.repository.owner.login;
      const repo = issueData.node.repository.name;
      const issueId = issueData.node.number;

      // Get the installation ID from my personal account
      const { data: installation } =
        await repoApp.octokit.rest.apps.getRepoInstallation({
          owner,
          repo,
        });

      const repoOctokit = await repoApp.getInstallationOctokit(installation.id);

      const issueLabels = issueData.node.labels.nodes;
      const projectLabels = projectData.node.field.options;
      await removeLabels(
        repoOctokit,
        owner,
        repo,
        issueId,
        issueLabels.map((label) => label.name),
        projectLabels
      );

      await repoOctokit.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: issueId,
        name: projectData.node.title,
      });
    } catch (e) {
      context.log("Error on delete", e.message);
      return { status: 500, body: e.message };
    }
  }

  // Add the delivery ID to the table
  await client.upsertEntity({ partitionKey: deliveryId, rowKey: "deliveryId" });

  return { body: `OK` };
}

app.http("project", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: project,
});
