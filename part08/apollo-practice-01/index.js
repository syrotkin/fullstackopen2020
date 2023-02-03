const { ApolloServer, gql } = require('apollo-server'); // this works with the apollo-server package 3.10.1
// const { ApolloServer } = require('@apollo/server');
// const { gql } = require('@apollo/client');
// const { React } = require('react');
const {v1: uuid } = require('uuid');

let persons = [
    {
        name: "Arto Hellas",
        phone: "040-123543",
        street: "Tapiolankatu 5 A",
        city: "Espoo",
        id: "3d594650-3436-11e9-bc57-8b80ba54c431"
    },
    {
        name: "Matti Luukkainen",
        phone: "040-432342",
        street: "Malminkaari 10 A",
        city: "Helsinki",
        id: "3d599470-3436-11e9-bc57-8b80ba54c431"
    },
    {
        name: "Venla Ruuska",
        street: "Nallemaentie 22 C",
        city: "Helsinki",
        id: "3d599471-3436-11e9-bc57-8b80ba54c431"
    }
];

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

    # has to be named Query
    type Query {
        personCount: Int!
        allPersons: [Person!]!
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
    }
`;

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => persons.find(p => p.name === args.name),
    },
    
    // We had to add this resolver after we added a field of type Address 
    // because the default resolver is not enough,
    // it does not know how to resolve "address" because it is not of a primitive type
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    },

    Mutation: {
        addPerson: (root, args) => {
            const person = { ...args, id: uuid() };
            persons = persons.concat(person);
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