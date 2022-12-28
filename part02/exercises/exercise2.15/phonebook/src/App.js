import React, { useState, useEffect } from 'react';
import personService from './services/persons';

const Person = ({ person, deletePerson }) => {
  return (
    <div>
      {person.name} {person.number} {' '}
      <button onClick={deletePerson}>Delete</button>
    </div>
  );
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
    personService
      .getAll()
      .then(allPersons =>
        setPersons(allPersons));
  }, [])

  const handleNewNameChange = (event) => {
    event.preventDefault();
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
    personService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson));
        setNewName("");
        setNewNumber("");
      });
  };

  const handleNewNumberChange = (event) => {
    event.preventDefault();
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    event.preventDefault();
    setFilterValue(event.target.value);
  };

  const personsToShow = persons.filter(
    (p) => p.name.toUpperCase().indexOf(filterValue.toUpperCase()) !== -1
  );

  const deletePerson = (id, name) => {
    window.confirm(`delete ${name}?`);
    personService
    .deletePerson(id)
    .then(_response => {
      setPersons(persons.filter(p => p.id !== id));
    });
  };


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

      {personsToShow
        .map((person) =>
          <Person
            key={person.name}
            person={person}
            deletePerson={() => deletePerson(person.id, person.name)} />)}
    </div>
  );
};

export default App;