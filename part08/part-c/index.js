// had to use apollo-server (instead of the newer @apollo/server) if we want to use server.listen
const { ApolloServer, UserInputError } = require('apollo-server'); // this works with the apollo-server package 3.10.1
// const { ApolloServer } = require('@apollo/server');
const { gql } = require('@apollo/client');
const { React } = require('react');
const {v1: uuid } = require('uuid');
const { GraphQLError } = require('graphql');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Person = require('./models/person');

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
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`);
});