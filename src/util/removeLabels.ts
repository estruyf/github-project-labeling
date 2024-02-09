import { Octokit } from "octokit";
import { Option } from "../models";

export const removeLabels = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  issueId: number,
  labels: string[],
  projectLabels: Option[],
  crntLabel?: string
) => {
  for (const label of labels) {
    if (label && projectLabels.find((l) => l.name === label)) {
      if (crntLabel && label === crntLabel) {
        continue;
      }

      await octokit.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: issueId,
        name: label,
      });
    }
  }
};
