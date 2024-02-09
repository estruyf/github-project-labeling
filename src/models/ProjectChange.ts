import { Projectsv2, Projectsv2item } from ".";

export interface ProjectChange {
  action: "created" | "edited" | "deleted";
  projects_v2_item?: Projectsv2item;
  projects_v2?: Projectsv2;
  changes: Changes;
  organization: Organization;
  sender: Creator;
  installation: Installation;
}

export interface Organization {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string;
}

export interface Changes {
  field_value: Fieldvalue;
}

export interface Fieldvalue {
  field_node_id: string;
  field_type: string;
}

export interface Creator {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Installation {
  id: number;
  node_id: string;
}
