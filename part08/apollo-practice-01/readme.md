## Using legacy libraries
```
npm install apollo-server@3.10.1 graphql
```

in code:
```typescript
const { ApolloServer, gql } = require('apollo-server'); // this works with the apollo-server package 3.10.1
```

start the server
```
node index.js
```

## Using new libraries (incomplete)
```
npm install @apollo/server @apollo/client graphql
```

in code:
```typescript
const { ApolloServer } = require('@apollo/server');
const { gql } = require('@apollo/client');
```

start the server
```
node index.js
```

It crashes because react is not available. 

## Working with the server:
Navigate to https://localhost:4000

Use Apollo Studio Explorer to query the server, e.g.
```graphql
query QueryNameDoesNotMatter {
  allPersons {
    name
  }
}
```

mutation:
```graphql
mutation MutationNameCanBeOmitted {
  addPerson(
    name: "Bob Smith",
    street: "Another Street",
    city: "Liverpool") {
    id
    name
  }
}
```

## Combining queries:
```graphql
query {
  withPhones: allPersons(phone: YES) {
   name 
  }
  withoutPhones: allPersons(phone: NO) {
    name
  }
}
```