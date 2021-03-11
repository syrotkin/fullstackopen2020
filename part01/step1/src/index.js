import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

let counter = 1;

const refresh = () => {
  ReactDOM.render(<App counter={counter} />, document.getElementById("root"));
};

refresh();

let interval = setInterval(() => {
  counter += 1;
  refresh();
}, 1000);

setTimeout(() => { clearInterval(interval);}, 5000);
