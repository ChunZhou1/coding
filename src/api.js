import "regenerator-runtime/runtime";

//reduer action
import { addCallList, modifyCall } from "./state/action";

const URL = "https://aircall-job.herokuapp.com/activities";

//ajax function
const postRequest = (url, options) => {
  return window
    .fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("postRequest " + url + " error!");
      } else {
        return data;
      }
    });
};

const getRequest = (url, options) => {
  return window
    .fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("getRequest " + url + " error!");
      } else {
        return data;
      }
    });
};

//The function used to modify the archived status of a single call ,called by reducer
const modifyCall_reducer = (callList, call) => {
  if (call.id === undefined) {
    return callList;
  }

  if (callList.length === 0) {
    return null;
  }

  let callList_t = callList.slice(0);

  for (let i = 0; i < callList_t.length; i++) {
    if (callList_t[i].id === call.id) {
      callList_t[i].is_archived = call.is_archived;
      break;
    }
  }

  return callList_t;
};

///////////////////process Date////////////////////////

const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const processDate = (dateString) => {
  let date = new Date(Date.parse(dateString));
  let year = date.getFullYear();
  let months = month[date.getMonth()];
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let noon = hour >= 12 ? "PM" : "AM";
  hour = hour >= 12 ? hour - 12 : hour;

  return [year, months, day, hour, minute, noon];
};

/////////////////////The function used to change the archived status of all call
const archiveAll = async (callList) => {
  //because I have not found API function to update archive status all,So
  //we have to update each by each

  let obj = {};
  obj.is_archived = true;

  let promiseArray = [];

  for (let i = 0; i < callList.length; i++) {
    if (callList[i].is_archived === false) {
      let url = URL + "/" + callList[i].id;
      promiseArray.push(postRequest(url, obj));
    }
  }

  try {
    let result = await Promise.all(promiseArray);

    //modify redux
    for (let i = 0; i < result.length; i++) {
      modifyCall(result[i]);
    }
  } catch (err) {
    console.log(err);
  }
};

///////////////////reset//////////////////////////////
const unAarchiveAll = async () => {
  try {
    let result = await getRequest(
      "https://aircall-job.herokuapp.com/reset",
      []
    );

    if (result.message === "done") {
      //modify reducer
      result = await getRequest(URL, []);
      addCallList(result);
    }
  } catch (err) {
    console.log(err);
  }
};

const api = {
  postRequest: postRequest,
  getRequest: getRequest,
  modifyCall_reducer: modifyCall_reducer,
  processDate: processDate,
  archiveAll: archiveAll,
  unAarchiveAll: unAarchiveAll,
};

export default api;
