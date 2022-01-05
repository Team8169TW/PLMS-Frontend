import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import API from "../API";
import SmartTable from "../components/SmartTable";

function formatterHash(content) {
  return content.substr(0, 6);
}

function formatterCreatedAt(content) {
  return new Date(content).toLocaleString();
}

// CID DID Name Org Role Hash Gate OperatorName CreatedAt
const columns = [
  {
    dataField: "id",
    text: "ID",
  },
  {
    dataField: "Declare.id",
    text: "填報 ID",
  },
  {
    dataField: "Declare.name",
    text: "姓名",
  },
  {
    dataField: "Declare.EventOrg.value",
    text: "單位",
  },
  {
    dataField: "Declare.EventRole.value",
    text: "身分",
  },
  {
    dataField: "Declare.hash",
    text: "隨機碼",
    formatter: formatterHash,
  },
  {
    dataField: "EventGate.value",
    text: "入口",
  },
  {
    dataField: "User.name",
    text: "人員",
  },
  {
    dataField: "note",
    text: "備註",
  },
  {
    dataField: "createdAt",
    text: "刷入時間",
    formatter: formatterCreatedAt,
  },
];

export default function ManageCheckinPage() {
  const [data, setData] = useState([]);
  const [eventList, setEventList] = useState([{ id: 0, value: "Loading..." }]);

  useEffect(() => {
    API.get("/event/organize").then((res) => {
      if (res.status === 200) setEventList(res.data);
    });
  }, [true]);

  function getCheckin(value) {
    API.get(`/checkin/${value}`).then((res) => {
      if (res.status === 200) setData(res.data.reverse());
    });
  }

  return (
    <Container className="info-container">
      <h2>刷入管理</h2>
      <SmartTable
        data={data}
        columns={columns}
        eventList={eventList}
        eventOnChangeCallback={(v) => getCheckin(v)}
      />
    </Container>
  );
}
