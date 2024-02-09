# GraphQL Queries

## Get projects and their items

```graphql
query {
  organization(login: "FrontMatter"){
    projectsV2(first: 10){
      nodes {
        id
        items(first: 10) {
          nodes {
            ... on ProjectV2Item {
              id
              type
              content {
                __typename
              }
              fieldValueByName(name:"Status"){
                __typename
                ... on ProjectV2ItemFieldSingleSelectValue{
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
```
