import { store } from "./store";

export const addCallList = (callList) => {
  store.dispatch({
    type: "ADD",
    payload: callList,
  });
};

export const modifyCall = (call) => {
  store.dispatch({
    type: "MODIFY",
    payload: call,
  });
};
