import './App.css';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import PersonForm from './personForm';

const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`;

const FIND_PERSON = gql`
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone
    id
    address {
      street
      city
    }
  }
}
`;


// person represents the result of a GraphQL call
const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const Persons = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState(null);
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch
  });

  // checking if result.data is set means that the data has come back from the server
  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        // setNameSearch(null) means nameToSearch === null, so this part (<Person/>) is not displayed anymore
        onClose={() => setNameToSearch(null)} />
    );
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}>Show Address</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 3000
  });

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Persons persons={result.data.allPersons} />
      <PersonForm/>
    </div>
  );
}

export default App;
