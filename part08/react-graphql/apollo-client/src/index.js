import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache } from '@apollo/client';


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  }),
  connectToDevTools: true
});

const query = gql`
  query {
    allPersons {
      name,
      phone,
      address {
        street,
        city
      }
      id
    }
  }
`;

client.query({ query })
  .then((response) => {
    console.log(response.data);
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
