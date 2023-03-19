import './App.css';
import { gql, useQuery } from '@apollo/client';

const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`;


const App = () => {
  const result = useQuery(ALL_PERSONS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Persons persons={result.data.allPersons} />
    </div>
  );
}

const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}
        </div>
      )}
    </div>
  );
};

export default App;
