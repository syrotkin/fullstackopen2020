import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import axios from 'axios';

// npx json-server --port 3001 --watch db.json
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  const loadNotes = () => {
    console.log('effect');
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled');
        setNotes(response.data);
      });
  };

  useEffect(loadNotes, []); // second parameter - how often is the effect run; empty array => run only after 1st render

  console.log('render', notes.length, 'notes');

  const addNote = (event) => {
    event.preventDefault();
    console.log('button clicked', event.target);
    console.log('event: ', event);
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    };
    axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response);
    });
    setNotes( [...notes, noteObject]);
    setNewNote('');
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };


  const toggleImportant = () => {
    setShowAll(!showAll);
  };

  const notesToShow = showAll ? notes : notes.filter(n => n.important);

  const toggleImportance = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(note => note.id !== id ? note : response.data));
    });
  };

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange} />
          <button type="submit">Save</button>
      </form>
      <button onClick={toggleImportant}>show {showAll ? 'important' : 'all'}</button>
    </div>
  );
};

export default App;
