This is how I added a person in the collection 

in Apollo server that is running in the browser, run this:

```
mutation Mutation($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(name: $name, street: $street, city: $city, phone: $phone) {
    name
    phone
  }
}
```

and set the variables below:
```
{  
  "name": "James Smith",
  "street": "Hardturmstrasse",
  "city": "Zurich",
  "phone": "12346"
}

```

Querying persons:
```graphql
query Query($phone: YesNo) {
  allPersons(phone: $phone) {
    address {
      city
      street
    }
    id
    name
    phone
  }
}
```

can specify parameter 'phone':
```
{ 
  "phone": "YES"
}
```

can only set "YES" or "NO"


1. Login by calling mutation login
2. copy the value of the bearer token
3. in all other queries add an Authorization header: Bearer <token here>
4. call queries


e.g. can call `me` like that:

```graphql
query Query {
  me {
    id
    username
    friends {
      id
    }
  }
}
```