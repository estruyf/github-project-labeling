export const queryIssue = (node_id: string) => `{
  node(id: "${node_id}") {
    __typename
    ... on Issue {
      id
      number
      title
      labels(first: 20) {
        ... on LabelConnection {
          nodes {
            name
          }
        }
      }
      repository {
        id
        name
        owner {
          id
          login
        }
      }
    }
  }
}`;
