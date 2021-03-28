import React from "react";
import { useState } from "react";

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const getAverageScore = () => {
    return (good - bad)/countAllFeedback();
  };

  const getPercentagePositive = () => {
    return (good/countAllFeedback()) * 100

  };
 
  const countAllFeedback = ()=> good + neutral + bad;

  return (
    <div>
      <h3>give feedback</h3>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <h3>statistics</h3>
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
      <p>all: {countAllFeedback()}</p>
      <p>average: {getAverageScore()}</p>
      <p>positive: {`${getPercentagePositive()} %`}</p>
    </div>
  );
};

export default App;
