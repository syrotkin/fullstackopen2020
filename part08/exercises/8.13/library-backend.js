const { ApolloServer, gql } = require('apollo-server');
const { v1: uuid } = require('uuid');

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
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(genre: String): [Book]!
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
    bookCount: async () => {
      const count = await Book.countDocuments().exec();
      return count;
    },
    authorCount: async () => {
      const count = await Author.countDocuments().exec();
      return count;
    },
    allBooks: async (root, args) => {
      if (!args.genre) {
        const result = await Book.find().populate('author').exec();
        return result;
      }

      const result = await Book.find({
        genres: { $elemMatch: { $in: [args.genre] } },
      }).populate('author');
      return result;
    },
    allAuthors: async () => {
      const result = await Author.find().exec();
      return result;
    },
  },
  Mutation: {
    addBook: async (_root, args) => {
      try {
        // I had to google this: https://mongoosejs.com/docs/api/model.html#Model.find()
        // findOne returns a Query, but you have to exec it.
        let existingAuthor = await Author.findOne({ name: args.author }).exec();
        console.log({ existingDbAuthor: existingAuthor });
        if (!existingAuthor) {
          console.log("could not find author with name: ", args.author);
          existingAuthor = new Author({ name: args.author });
          console.log({ dbAuthor: newAuthor });
          existingAuthor.save();
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
    editAuthor: async (_root, args) => {
      const existingAuthor = await Author.findOne({ name: args.name }).exec();
      if (!existingAuthor) {
        return null;
      }

      console.log({ existingAuthor });
      existingAuthor.born = args.setBornTo;
      console.log({ existingAuthor });
      existingAuthor.save();
      return existingAuthor;
    },
  },
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
