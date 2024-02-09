import { Creator } from ".";

export interface Projectsv2item {
  id: number;
  node_id: string;
  project_node_id: string;
  content_node_id: string;
  content_type: "DraftIssue" | "Issue" | "Note";
  creator: Creator;
  created_at: string;
  updated_at: string;
  archived_at?: any;
}
