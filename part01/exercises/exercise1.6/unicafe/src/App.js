import React from "react";
import { useState } from "react";

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Statistics = ({good, neutral, bad}) => {
  const getAverageScore = () => {
    return (good - bad) / countAllFeedback();
  };

  const getPercentagePositive = () => {
    return (good / countAllFeedback()) * 100;
  };

  const countAllFeedback = () => good + neutral + bad;

  if (countAllFeedback() === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <div>
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
      <p>all: {countAllFeedback()}</p>
      <p>average: {getAverageScore()}</p>
      <p>positive: {`${getPercentagePositive()} %`}</p>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h3>give feedback</h3>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <h3>statistics</h3>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
