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
```
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