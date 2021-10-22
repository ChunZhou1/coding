import React from "react";

import { useEffect, useState } from "react";

//redux reducer
import { useSelector } from "react-redux";

//redux action function
import { addCallList, modifyCall } from "../state/action";

//api function
import api from "../api";

import "./css/call.css";

//UI framework, I use ant dedign

import {
  PushpinOutlined,
  PhoneOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { Tabs, Menu, Dropdown, Modal, Row, Col, Tooltip, Spin } from "antd";

const URL = "https://aircall-job.herokuapp.com/activities";

const { TabPane } = Tabs;

//The compoent is a container, It is a state component

export const Call_container = () => {
  const [running, setRunning] = useState(false); //used to display spin

  useEffect(() => {
    //get all call
    api
      .getRequest(URL, [])
      .then((result) => {
        addCallList(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const callList = useSelector((state) => state.callList); //get all call list from reducer

  //The function used to change archived status
  const handle_archived = async (call) => {
    //modify archived status
    let obj = {};
    obj.is_archived = !call.is_archived;

    let url = URL + "/" + call.id;

    try {
      let result = await api.postRequest(url, obj);

      //modify reducer;
      modifyCall(result);
    } catch (err) {
      console.log(err);
    }
  };

  //The function used to archive All or reset all
  const handle_all = async (status) => {
    setRunning(true); //display spin
    if (status === "archived") {
      await api.archiveAll(callList);
    } else {
      await api.unAarchiveAll();
    }
    setRunning(false);
  };

  //display child component
  return (
    <div>
      <div style={{ marginLeft: "1%" }}>
        <Spin spinning={running}>
          <Tabs defaultActiveKey="unarchived">
            <TabPane tab="unArchived" key="unarchived">
              <div className="center">
                <ArchiveOrResetAll
                  status={"archived"}
                  handle_all={handle_all}
                />
                <FeedList archived={false} handle_archived={handle_archived} />
              </div>
            </TabPane>
            <TabPane tab="archived" key="archived">
              <div className="center">
                <ArchiveOrResetAll status={"reset"} handle_all={handle_all} />
                <FeedList archived={true} handle_archived={handle_archived} />
              </div>
            </TabPane>
            <TabPane tab="All calls" key="all">
              <div className="center">
                <FeedList archived={"all"} handle_archived={handle_archived} />
              </div>
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    </div>
  );
};

///////The component used to display archive all or reset all card base on props.status//////
//////This component is stateless compoent

const ArchiveOrResetAll = (props) => {

  //user click archive all or reset all button
  const onClick = () => {
    //we do not process directly and pass to the parent component
    props.handle_all(props.status);
  };
  return (
    <div className="border">
      <span>
        {props.status === "archived" ? (
          <PushpinOutlined
            style={{ fontSize: "25px", color: "#9c9a95" }}
            className="icon"
          />
        ) : (
          <ReloadOutlined
            style={{ fontSize: "25px", color: "#9c9a95" }}
            className="icon"
          />
        )}
      </span>
      <a className="font1" onClick={onClick}>
        {props.status === "archived"
          ? "Archive all calls"
          : "Reset to initial state"}
      </a>
    </div>
  );
};

/////////The component used to display single call/////////////////
//////////input: call info from CallList component//////////
//////This component is stateless compoent

const Feed = (props) => {
  const [visible, setVisible] = useState(false); //if we should display call detail

  const date = api.processDate(props.call.created_at); //covert time in order to display


  const handleOK = () => {
    setVisible(false); //stop displaying call detail
  };

  //user click menu item of the popup menu
  const onClick = (e) => {
    switch (e.key) {
      case "archived":
        props.handle_archived(props.call); //process archived or unarchived, pass to the container component to process
        break;

      case "detail":
        setVisible(true); //display call detail,we display a dialog
        break;

      default:
        break;
    }
  };

  //The popup menu
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="archived">
        {props.call.is_archived ? "unArchived" : "archived"}
      </Menu.Item>

      <Menu.Item key="detail">Detail</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div className="dash">
        <div className="date">
          {date[1]},{date[2]},{date[0]}
        </div>
      </div>
      <div className="border">
        <span>
          <PhoneOutlined
            style={{
              fontSize: "25px",
              color: props.call.call_type === "missed" ? "red" : "#9c9a95",
            }}
            className="icon"
          />
        </span>

        <span className="font1">{props.call.from}</span>

        <Tooltip title="Click it">
          <a className="menu">
            <Dropdown overlay={menu} trigger={["click"]}>
              <MoreOutlined style={{ fontSize: "25px", color: "#9c9a95" }} />
            </Dropdown>
          </a>
        </Tooltip>
        <span className="time">
          {date[3]}:{date[4]}
        </span>
        <span className="noon">{date[5]}</span>
      </div>
      <Modal
        title="Call detail"
        visible={visible}
        onOk={handleOK}
        width={400}
        closable={false}
        centered={true}
        cancelButtonProps={{ disabled: true }}
        maskClosable={true}
        okText="OK"
        cancelText="Cancel"
      >
        <CallDetail call={props.call} />
      </Modal>
    </div>
  );
};

//The component used to display a list of call feed
//The component get a list of call from reducer
//input: props.archived: display archived or unarchived call or display all

const FeedList = (props) => {
  const callList = useSelector((state) => state.callList); //get a list of call from reducer

  const list = callList.map((item) => {
    if (item.is_archived === props.archived || props.archived === "all") {
      return (
        <Feed
          call={item}
          key={item.id}
          handle_archived={props.handle_archived}
        />
      );
    }
  });

  return <div>{list}</div>;
};

/////The component below used to diaplay call detail//////////////////

const KeyValuePairs = (props) => {
  return (
    <Row style={{ marginBottom: "2%" }}>
      <Col xs={24} md={12} style={{ fontWeight: "600" }}>
        {props.keys}
      </Col>
      <Col xs={24} md={12}>
        {props.value}
      </Col>
    </Row>
  );
};

const CallDetail = (props) => {
  const date = api.processDate(props.call.created_at);
  const timeString =
    date[1] +
    "," +
    date[2] +
    "," +
    date[0] +
    " " +
    date[3] +
    ":" +
    date[4] +
    " " +
    date[5];

  return (
    <div>
      <KeyValuePairs keys={"Id"} value={props.call.id} />
      <KeyValuePairs keys={"Call Type"} value={props.call.call_type} />
      <KeyValuePairs keys={"Direction"} value={props.call.direction} />
      <KeyValuePairs keys={"Time"} value={timeString} />
      <KeyValuePairs
        keys={"Duration"}
        value={props.call.duration + " second"}
      />
      <KeyValuePairs keys={"From"} value={props.call.from} />
      <KeyValuePairs keys={"To"} value={props.call.to} />
      <KeyValuePairs keys={"Via"} value={props.call.via} />
      <KeyValuePairs
        keys={"Aarchived"}
        value={props.call.is_archived ? "true" : "false"}
      />
    </div>
  );
};
