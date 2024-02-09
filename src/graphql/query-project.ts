export const queryProject = (node_id: string) => `query {
  node(id: "${node_id}") {
    ... on ProjectV2 {
      title
      field(name: "Status") {
        __typename
        ... on ProjectV2SingleSelectField {
          name
          options {
            name
            color
            description
          }
        }
      }
    }
  }
}`;
