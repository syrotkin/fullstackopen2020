To run the application:

`node library-backend.js`


This query works even when changing the type of the author field:

```
query AllBooks($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    id
    title
  }
}
```

This is a mutation that worked with the new code (after exercise 8.13):

```
mutation Mutation($title: String!, $authorName: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $authorName, published: $published, genres: $genres) {
    author {
      name
    },
    title
  }
}
```

Variables:
```
{
  "title": "Notes from Underground",
  "authorName": "Fyodor Dostoevsky",
  "published": 1864,
  "genres": [
    "Fiction"
  ]
}
```