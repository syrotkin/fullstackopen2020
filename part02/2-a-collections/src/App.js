import React, { useState } from "react";
import Note from "./components/Note";

const App = (props) => {
  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  const addNote = (event) => {
    event.preventDefault();
    console.log('button clicked', event.target);
    console.log('event: ', event);
    const newNoteToAdd = {
      id: Math.max(...notes.map(n => n.id)) + 1,
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    };
    setNotes( [...notes, newNoteToAdd]);
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

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
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
