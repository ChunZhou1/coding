import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { store } from "./state/store";

import "antd/dist/antd.css";

import { URL_container } from "./components/urlCompomemt";

const App = () => {
  return (
    <div
      
    >
      <URL_container />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
