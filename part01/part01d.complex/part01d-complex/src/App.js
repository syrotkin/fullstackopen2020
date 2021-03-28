import './App.css';
import React from 'react';
import { useState }  from 'react';


const AppLeftRight =() => {
  const [left, setLeft] =  useState(0);
  const [right, setRight] = useState(0);

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>left</button>
      <button onClick={() => setRight(right + 1)}>right</button>
      {right}
    </div>
  );
};


const AppWithSingleObject = () => {

  const [clicks, setClicks] = useState({
    left: 0,
    right: 0
  });

  return (<div>
    {clicks.left}
    <button onClick={() => {
      setClicks({left: clicks.left + 1, right: clicks.right });
    }}>left</button>
    <button onClick={() => {
      setClicks({ left: clicks.left, right: clicks.right + 1 });
    }}>right</button>
    {clicks.right}
  </div>);
};

const AppWithSetting2StateVariables = () => {
  const [clicks, setClicks] = useState({
    left: 0,
    right: 0
  });

  const handleLeftClick = () => {
    setClicks({
      ...clicks,
      left: clicks.left + 1,
    });
  };
  const handleRightClick = () => {
    setClicks({
      ...clicks,
      right: clicks.right + 1,
    });
  };
  return (<div>
    {clicks.left}
    <button onClick={handleLeftClick}>left</button>
    <button onClick={handleRightClick}>right</button>
    {clicks.right}
  </div>);
};

const History = ({allClicks}) => {
  if (allClicks.length === 0) {
    return <div>The app is used by clicking the buttons</div>;
  }

  return <div>Button press history: {allClicks.join(" ")}</div>;
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAllClicks] = useState([]);

  const handleLeftClick = () => {
    setAllClicks(allClicks.concat('L'));
    setLeft(left + 1);
  };

  const handleRightClick = () => {
    setAllClicks(allClicks.concat('R'));
    setRight(right + 1);
  };
  
  return (
  <div>
    {left}
    <Button text="left" handleClick={handleLeftClick} />
    <Button text="right" handleClick={handleRightClick} />
    {right}
    <History allClicks={allClicks} />
  </div>)
};

export default App;
