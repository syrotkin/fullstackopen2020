import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  );
};

const Persons = ({ persons }) => {
  return persons.map((person) => <Person key={person.name} person={person} />);
};

const AddPersonForm = (props) => {
  const {
    newName,
    handleNewNameChange,
    newNumber,
    handleNewNumberChange,
    addNewName,
  } = props;

  return (
    <>
      <h2>add a new</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={addNewName}>
            add
          </button>
        </div>
      </form>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setFilterValue] = useState("");


useEffect(() => {
  axios
  .get('http://localhost:3001/persons')
  .then(response  => 
    setPersons(response.data));
}, [])

  const handleNewNameChange = (event) => {
    event.preventDefault();
    // console.log(event.target.value);
    setNewName(event.target.value);
  };

  const addNewName = (event) => {
    event.preventDefault();
    const personWithSameName = persons.find((p) => p.name === newName);
    if (personWithSameName) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = {
      id: Math.max(...persons.map((p) => p.id)) + 1,
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(newPerson));
    setNewName("");
    setNewNumber("");
  };

  const handleNewNumberChange = (event) => {
    event.preventDefault();
    //console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    event.preventDefault();
    //console.log(event.target.value);
    setFilterValue(event.target.value);
  };

  const personsToShow = persons.filter(
    (p) => p.name.toUpperCase().indexOf(filterValue.toUpperCase()) !== -1
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with{" "}
        <input value={filterValue} onChange={handleFilterChange} />
      </div>
      
      <AddPersonForm
        newName={newName}
        newNumber={newNumber}
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange}
        addNewName={addNewName}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;