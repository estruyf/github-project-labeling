export const queryCard = (node_id: string) => `query {
  node(id: "${node_id}") {
    ... on ProjectV2Item {
      id
      type
      content {
        __typename
        ... on Issue{
          id
          number
          title
          labels(first:20) {
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
      fieldValueByName(name:"Status"){
        __typename
        ... on ProjectV2ItemFieldSingleSelectValue{
          name
        }
      }
      project {
        title
        field(name:"Status"){
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
  }
}`;
