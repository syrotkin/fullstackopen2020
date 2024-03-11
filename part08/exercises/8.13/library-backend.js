const { ApolloServer } = require('@apollo/server');
const { gql } = require('@apollo/client');
const { v1: uuid } = require('uuid');
const { GraphQLError } = require('graphql');
const { startStandaloneServer } = require('@apollo/server/standalone');

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(genre: String): [Book]!
    allAuthors: [AuthorResult!]!
    me: User
  }

  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book!

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const verifyToken = async (req) => {
  const auth = req ? req.headers.authorization : null;
  if (auth && auth.startsWith("Bearer ")) {
    const decodedToken = jwt.verify(
      auth.substring(7),
      process.env.JWT_SECRET
    );

    const currentUser = await User.findById(decodedToken.id);
    return currentUser;
  }

  return null;
};

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
        const result = await Book.find().populate("author").exec();
        return result;
      }

      const result = await Book.find({
        genres: { $elemMatch: { $in: [args.genre] } },
      }).populate("author");
      return result;
    },
    allAuthors: async () => {
      const result = await Author.find().exec();
      return result;
    },
    me: async (_root, _args, context, _info) => {
      const { req } = context;
      return await verifyToken(req);
    },
  },
  Mutation: {
    addBook: async (_root, args, context) => {
      if (!args.title || args.title.length === 0) {
        throw new GraphQLError("Book title is empty", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }

      if (!args.author || args.author.length === 0) {
        throw new GraphQLError("Author name is empty", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
          },
        });
      }

      const { req } = context;
      const user = await verifyToken(req);
      console.log({user});
      if (!user) {
        throw new GraphQLError("Token in the authorization header is wrong", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      try {
        // I had to google this: https://mongoosejs.com/docs/api/model.html#Model.find()
        // findOne returns a Query, but you have to exec it.
        let existingAuthor = await Author.findOne({ name: args.author }).exec();
        if (!existingAuthor) {
          console.log("could not find author with name: ", args.author);
          existingAuthor = new Author({ name: args.author });

          existingAuthor.save();
        }
        const dbBook = new Book({ ...args, author: existingAuthor });

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
    editAuthor: async (_root, args, context) => {
      if (args.setBornTo <= 0) {
        throw new GraphQLError("setBornTo year must be a positive number", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
          },
        });
      }

      const { req } = context;
      const user = await verifyToken(req);
      console.log({user});
      if (!user) {
        throw new GraphQLError("Token in the authorization header is wrong", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const existingAuthor = await Author.findOne({ name: args.name }).exec();
      if (!existingAuthor) {
        return null;
      }

      existingAuthor.born = args.setBornTo;

      existingAuthor.save();
      return existingAuthor;
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },

    login: async (_root, args) => {
      const user = await User.findOne({username: args.username});

      if (!user || args.password != process.env.JWT_SECRET) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    }

  },
};

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./book');
const Author = require('./author');
const User = require('./user');
const jwt = require('jsonwebtoken');
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
  introspection: true
});

// this is the new approach, to be used with user management
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, _res }) => {
    return {req};
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});


// server.listen is the old approach
// server.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// });
