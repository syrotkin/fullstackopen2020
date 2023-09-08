// had to use apollo-server (instead of the newer @apollo/server) if we want to use server.listen
//const { ApolloServer, UserInputError } = require('apollo-server'); // this works with the apollo-server package 3.10.1
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { gql } = require('@apollo/client');
const { React } = require('react');
const {v1: uuid } = require('uuid');
const { GraphQLError } = require('graphql');


const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Person = require('./models/person');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// .env file contains MONGODB_URI='<secret MongoDB URI here>'
const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message);
    });

const typeDefs = gql`
    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    enum YesNo {
        YES
        NO
    }

    # has to be named Query
    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person!]!
        findPerson(name: String!): Person
        me: User
    }

    # has to be named Mutation
    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
        editNumber(
            name: String!
            phone: String!
        ): Person
        createUser(
            username: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }

    type User {
        username: String!
        friends: [Person!]!
        id: ID!
    }

    type Token {
        value: String!
    }
`;

const resolvers = {
    Query: {
        personCount: async () => Person.collection.countDocuments(),
        allPersons: async (root, args) => {
            if (!args.phone) {
                return Person.find({});
            }

            return Person.find({ phone: {$exists: args.phone === 'YES'}});
        },
        findPerson: async (root, args) => Person.findOne({name: args.name}),

        me: (root, args, context) => {
            // context is defined in startStandaloneServer
            return context.currentUser;
        }
    },
    
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    },

    Mutation: {
        addPerson: async (root, args) => {
            const person = new Person({...args});
            try {
                await person.save();
            }
            catch (error) {
                throw new GraphQLError('Saving person failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                });
            }

            return person;
        },

        editNumber: async (root, args) => {
            const person = await Person.findOne({name: args.name });
            person.phone = args.phone;

            try {
                await person.save();
            }
            catch (error) {
                throw new GraphQLError('Saving number failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                });
            }

            return person;
        },

        createUser: async (root, args) => {
            const user = new User({ username: args.username });

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.name,
                            error
                        }
                    });
                })
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });

            if (!user || args.password !== 'secret') {
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

            // JWT_SECRET has to be defined in the .env file
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
        }

    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// this is the new approach, server.listen is the old approach
startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), process.env.JWT_SECRET
            );
            const currentUser = await User.findById(decodedToken.id).populate('friends');
            return { currentUser };
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
