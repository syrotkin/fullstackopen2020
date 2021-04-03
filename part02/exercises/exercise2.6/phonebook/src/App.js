import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([{ id: 1, name: "Arto Hellas", number: '040-1234567' }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState('');

  const handleNewNameChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const addNewName = (event) => {
    event.preventDefault();
    const personWithSameName = persons.find(p => p.name === newName);
    if (personWithSameName) {
      alert(`${newName} is already added to phonebook`);
      return;
    }  

    const newPerson = {
      id: Math.max(...persons.map(p => p.id)) + 1,
      name: newName,
      number: newNumber
    };
    setPersons(persons.concat(newPerson));
    setNewName('');
    setNewNumber('');
  };

  const handleNewNumberChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>number: <input value={newNumber} onChange={handleNewNumberChange} /></div>
        <div>
          <button type="submit" onClick={addNewName}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <div key={person.id}>{person.name} {person.number}</div>
      ))}
    </div>
  );
};

export default App