import { Octokit } from "octokit";
import { createLabel } from ".";

export const addProjectLabel = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  issueId: number,
  labels: string[],
  name: string,
  description: string
) => {
  await createLabel(octokit, owner, repo, labels, name, description);

  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: issueId,
    labels: [name],
  });
};
