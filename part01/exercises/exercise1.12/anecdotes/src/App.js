import React from 'react';
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
   
  const [selected, setSelected] = useState(0);

  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const voteForSelectedAnecdote =() => {
    let newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const selectRandomAnecdote = () => {
    let random;
    do {
      random = Math.floor(Math.random() * anecdotes.length);
    } while (random === selected);
    setSelected(random);
  };

  const getAnecdoteWithMostVotes = () => {
    const maxVotes = Math.max(...votes);
    const index = votes.indexOf(maxVotes);
    return anecdotes[index];
  };

  return (
    <div>
      <h3>Anecdote of the day</h3>
      <div>
      {anecdotes[selected]}
      </div>
      <div>
        has {votes[selected]} votes
      </div>
      <div>
        <button onClick={voteForSelectedAnecdote}>vote</button>
        <button onClick={selectRandomAnecdote}>next anecdote</button>
      </div>
      <h3>Anecdote with most votes</h3>
      {getAnecdoteWithMostVotes()}
    </div>
  );
}

export default App