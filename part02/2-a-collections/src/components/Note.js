const Note = ({ note, toggleImportance }) => {
  const buttonLabel = note.important ? 'make not important' : 'make important';

  return (
    <li className='note'>
      {note.content}
      <div>
        <button onClick={toggleImportance}>{buttonLabel}</button>
      </div>
    </li>
  );
};

export default Note;