import React, { useState } from "react";

const Display = ({ counter }) => {
  return <div>{counter}</div>;
};

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };

  const decrement = () => {
    setCounter(counter - 1);
  };

  const reset = () => {
    setCounter(0);
  };

  return (
    <div>
      <Display counter={counter} />
      <Button text="plus" handleClick={increment} />
      <Button text="zero" handleClick={reset} />
      <Button text="minus" handleClick={decrement} />
    </div>
  );
};

const AppWith2Buttons = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };
  const reset = () => {
    setCounter(0);
  };

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increment}>plus</button>
      <button onClick={reset}>zero</button>
    </div>
  );
};

const AppWithSetTimeout = () => {
  const [counter, setCounter] = useState(0);

  setTimeout(() => {
    setCounter(counter + 1);
  }, 1000);

  console.log("rendering...", counter);

  return <div>{counter}</div>;
};

export default App;
