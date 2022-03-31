import React from "react";

import { useEffect, useState } from "react";

import { Tabs, Row, Col, Tooltip, Spin, Input, Button } from "antd";

import "./css/url.css";

const SHORT_URL = [
  {
    title: "shrtco.de",
  },

  {
    title: "9qr.de",
  },

  {
    title: "shiny.link",
  },
];

function gerRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return Min + Math.round(Rand * Range);
}

var cardList1 = [];

export function URL_container() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [url, setURL] = useState("");
  const [cardLst, setCardList] = useState([]);

  const searchRealURl = (shortUrl) => {
    let index = cardList1.findIndex(function (obj) {
      obj.shortUrl === this;
    }, shortUrl);
    return cardList1[index].value;
  };

  function addCardList(title) {
    let obj = {};

    obj.id = gerRandomNum(10000, 90000).toString();
    obj.url = title + "/" + obj.id;
    obj.value = value;
    obj.shortUrl = title;

    cardList1.push(obj);

    console.log("2222", cardList1);
  }

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = (title) => {
    setURL(title);
  };

  const handleCreate = () => {
    if (value === undefined || value === "") {
      setMessage("Url can not be empty");
      return;
    } else {
      setMessage("");
    }

    addCardList(url);
    setCardList(cardList1.slice(0));
  };

  const handleUrl = (shortUrl) => {
    let realUrl = searchRealURl(shortUrl);

    //next will redirect
  };

  const buttonList = SHORT_URL.map((item) => {
    return (
      <Buttons title={item.title} key={item.title} clickFun={handleClick} />
    );
  });

  const card_list = cardLst.map((item) => {
    return <Card1 shortUrl={item.url} key={item.id} clickUrl={handleUrl} />;
  });

  console.log("44444", card_list);

  return (
    <div>
      <div className="border">
        <Row style={{ marginLeft: "5%", marginTop: "10%" }}>
          <span style={{ fontSize: "30px", fontWeight: "500" }}>
            Link Shortener
          </span>
        </Row>
        <Row style={{ marginLeft: "5%", marginTop: "2%" }}>
          <Col>
            <span style={{ fontSize: "20px", fontWeight: "500" }}>
              Enter a lick:
            </span>
          </Col>

          <Col style={{ marginLeft: "2%" }}>
            <Input value={value} onChange={handleOnChange} />
          </Col>

          <Col style={{ marginLeft: "5%" }}>
            <Button onClick={handleCreate}>Create</Button>
          </Col>
        </Row>
        <Row style={{ marginLeft: "5%", marginTop: "2%" }}>
          <Col>
            <span style={{ fontSize: "20px", fontWeight: "500" }}>
              Short domain:
            </span>
          </Col>

          {buttonList}
        </Row>

        <Row style={{ marginLeft: "5%", marginTop: "2%" }}>
          <span style={{ fontSize: "20px", fontWeight: "500", color: "red" }}>
            {message}
          </span>
        </Row>
      </div>
      {card_list}
    </div>
  );
}

export function Card1({ shortUrl, clickUrl }) {
  const handleClick = () => {
    clickUrl(shortUrl);
  };
  return (
    <div className="card" onClick={handleClick} style={{ marginTop: "5%" }}>
      <span style={{ fontSize: "30px", fontWeight: "500" }}>{shortUrl}</span>
    </div>
  );
}

export function Buttons({ title, clickFun }) {
  const handleOnClick = () => {
    clickFun(title);
  };

  return (
    <Row style={{ marginLeft: "2%" }}>
      <Button onClick={handleOnClick}>{title}</Button>
    </Row>
  );
}
