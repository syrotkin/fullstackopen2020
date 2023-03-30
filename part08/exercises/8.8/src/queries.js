import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
    query allAuthors {
        allAuthors {
            id
            name
            born
            bookCount
        }
    }
`;

export const ALL_BOOKS = gql`
    query allBooks {
        allBooks(author: null) {
            id
            author
            published
            title
        }
    }    
`;

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title, 
            author: $author, 
            published: $published
            genres: $genres) {
                id
                author
                published
                title
                genres
        }
    }
`;