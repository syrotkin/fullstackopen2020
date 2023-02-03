import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import './App.css';
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
    // skip parameter to skip executing the query if needed
    skip: !nameToSearch
  });

  if (nameToSearch && result.data) {
    return (
      <Person
      person={result.data.findPerson}
      onClose={() => setNameToSearch(null) } />
    );
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map(person => 
        <div key={person.name}>
          {person.name} {person.phone}
          <button onClick={() => setNameToSearch(person.name)}>
            show address
          </button>
        </div>
        )}
    </div>
  );
};

const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  });

  if (result.loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Persons persons={result.data.allPersons} />
      <PersonForm />
    </div>
  );
};

export default App;
