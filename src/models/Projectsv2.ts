import { Owner } from ".";

export interface Projectsv2 {
  id: number;
  node_id: string;
  owner: Owner;
  creator: Owner;
  title: string;
  description?: any;
  public: boolean;
  closed_at?: any;
  created_at: string;
  updated_at: string;
  number: number;
  short_description?: any;
  deleted_at?: any;
  deleted_by?: any;
}
