import { type Octokit } from "octokit";

export const createLabel = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  labels: string[],
  name: string,
  description: string
) => {
  if (!labels.find((label) => label.toLowerCase() === name.toLowerCase())) {
    await octokit.rest.issues.createLabel({
      owner,
      repo,
      name,
      description,
    });
  }
};
