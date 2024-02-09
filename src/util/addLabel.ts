import { type Octokit } from "octokit";
import { Option } from "../models";
import { createLabel } from "./createLabel";

export const addLabel = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  issueId: number,
  labels: string[],
  name: string,
  projectLabels: Option[]
) => {
  const option = projectLabels.find((option) => option.name === name);
  if (!option) {
    return;
  }

  await createLabel(octokit, owner, repo, labels, name, option.description);

  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: issueId,
    labels: [name],
  });
};
