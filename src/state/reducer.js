import { combineReducers } from "redux";

import api from "../api";

const initialState = [];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      return action.payload;
    case "MODIFY":
      return api.modifyCall_reducer(state, action.payload);
    default:
      return state;
  }
};

const reducers = combineReducers({ callList: reducer });

export default reducers;
