const { ApolloServer, gql } = require('apollo-server');
const { v1: uuid } = require('uuid');

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
];

// typeDefs aka "schema"
const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
  }

  type AuthorResult {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [AuthorResult!]!
  }

  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book!

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;



const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: (root, args) => {
            if (!args.author && !args.genre) {
                return books;
            }

            const matchGenre = book => book.genres.includes(args.genre);
            if (!args.author && args.genre) {
                return books.filter(matchGenre);
            }

            const matchAuthor = book => book.author === args.author;
            if (args.author && !args.genre) {    
                return books.filter(matchAuthor);
            }

            return books.filter(book => matchGenre(book) && matchAuthor(book));
        },
        allAuthors: () => {
            const authorResults = authors.map(author => {
                return {
                    ...author,
                    bookCount: books.filter(book => book.author === author.name).length
                };
            });
            return authorResults;
        }
    },
    Mutation: {
        addBook: async (root, args) => {            
            try {
              // I had to google this: https://mongoosejs.com/docs/api/model.html#Model.find()
              // findOne returns a Query, but you have to exec it.
              let existingAuthor = await Author.findOne({name: args.author}).exec();
              console.log({existingDbAuthor: existingAuthor});
              if (!existingAuthor) {
                console.log("could not find author with name: ", args.author);
                const newAuthor = new Author({ name: args.author });
                console.log({ dbAuthor: newAuthor });
                newAuthor.save();
              }
              const dbBook = new Book({ ...args, author: existingAuthor });
              console.log({ dbBook });
              dbBook.save();
              return dbBook;
            } catch (error) {
              throw new GraphQLError("Saving book failed", {
                extensions: {
                  code: "BAD_USER_INPUT",
                  invalidArgs: args.name,
                  error,
                },
              });
            }
        },
        editAuthor: async (root, args) => {
            const existingAuthor = await Author.findOne({name: args.name}).exec();
            if (!existingAuthor) {
                return null;
            }

            console.log({existingAuthor});
            existingAuthor.born = args.setBornTo;
            console.log({existingAuthor});
            existingAuthor.save();
            return existingAuthor;
        }
    }
};

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./book');
const Author = require('./author');
require('dotenv').config();

// .env file contains MONGODB_URI='<secret MongoDB URI here>'
const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
});
