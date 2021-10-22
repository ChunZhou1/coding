import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { store } from "./state/store";

import Header from "./Header.jsx";

import "antd/dist/antd.css";

import { Call_container } from "./components/call";

const App = () => {
  return (
    <div className="container">
      <Header />
      <Provider store={store}>
        <Call_container />
      </Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
