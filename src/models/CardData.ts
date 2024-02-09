export interface CardData {
  node: Node;
}

interface Node {
  id: string;
  type: string;
  content: IssueContent;
  fieldValueByName: FieldValueByName;
  project: Project;
}

export interface Project {
  title: string;
  field: Field;
}

interface FieldValueByName {
  __typename: string;
  name: string;
}

export interface IssueContent {
  __typename: string;
  id: string;
  number: number;
  title: string;
  labels: Labels;
  repository: Repository;
}

export interface Labels {
  nodes: NodeLabel[];
}

interface NodeLabel {
  name: string;
}

interface Repository {
  id: string;
  name: string;
  owner: Owner;
}

interface Owner {
  id: string;
  login: string;
}

interface Field {
  __typename: string;
  name: string;
  options: Option[];
}

export interface Option {
  name: string;
  color: string;
  description: string;
}
