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