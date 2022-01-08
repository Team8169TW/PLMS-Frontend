import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import API from "../API";
import SmartTable from "../components/SmartTable";
import formatterType from "../units/formatterType";

function formatterPartID(content) {
  return `P.${content.toString().padStart(5, "0")}`;
}

function formatterQuantity(content, row) {
  return `${content} ${row.unit}`;
}

function formatterCreatedAt(content) {
  return new Date(content).toLocaleDateString();
}

const columns = [
  {
    dataField: "id",
    text: "ID",
  },
  {
    dataField: "part_id",
    text: "零件 ID",
    formatter: formatterPartID,
  },
  {
    dataField: "storeCode",
    text: "倉儲",
    formatter: formatterPartID,
  },
  {
    dataField: "common_name",
    text: "名稱",
  },
  {
    dataField: "spec",
    text: "規格",
  },
  {
    dataField: "type",
    text: "操作",
    formatter: formatterType,
  },
  {
    dataField: "quantity",
    text: "數量",
    formatter: formatterQuantity,
  },
  {
    dataField: "note",
    text: "備註",
  },
  {
    dataField: "createdAt",
    text: "建立日期",
    formatter: formatterCreatedAt,
  },
];

export default function ManageHistoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get(`/transport`).then((res) => {
      if (res.status === 200) setData(res.data);
    });
  }, [true]);

  return (
    <Container className="info-container">
      <h2>歷史紀錄</h2>
      <SmartTable data={data} columns={columns} hasButton />
    </Container>
  );
}
