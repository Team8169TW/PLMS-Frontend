import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import QRCode from "qrcode.react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import API from "../API";
import SmartTable from "../components/SmartTable";

const ReactSwal = withReactContent(Swal);

function formatterID(content) {
  return `P.${content.toString().padStart(5, "0")}`;
}

function formatterQuantity(content, row) {
  return `${content} ${row.part.unit}`;
}

function formatterCreatedAt(content) {
  return new Date(content).toLocaleDateString();
}

function onClickBtnQRCode(row) {
  const code = formatterID(row.part.id);
  ReactSwal.fire({
    title: `${code}`,
    html: (
      <>
        <QRCode value={code} size="255" level="H" renderAs="svg" />
      </>
    ),
  });
}

function formatterQRCode(content, row) {
  return <Button onClick={() => onClickBtnQRCode(row)}>Show</Button>;
}

const columns = [
  {
    dataField: "part.id",
    text: "ID",
    formatter: formatterID,
  },
  {
    dataField: "part.category",
    text: "類別",
  },
  {
    dataField: "part.common_name",
    text: "名稱",
  },
  {
    dataField: "part.spec",
    text: "規格",
  },
  {
    dataField: "part.quantity",
    text: "數量",
    formatter: formatterQuantity,
  },
  {
    dataField: "part.product_name",
    text: "料名",
  },
  {
    dataField: "part.supplier_name",
    text: "廠商",
  },
  {
    dataField: "part.product_code",
    text: "料號",
  },
  {
    dataField: "part.note",
    text: "備註",
  },
  {
    dataField: "part.createdAt",
    text: "建立日期",
    formatter: formatterCreatedAt,
  },
  {
    dataField: "qrcode",
    text: "QR Code",
    formatter: formatterQRCode,
  },
];

export default function ManagePartsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get(`/part`).then((res) => {
      if (res.status === 200) setData(res.data);
    });
  }, [true]);

  return (
    <Container className="info-container">
      <h2>零件管理</h2>
      <SmartTable data={data} columns={columns} hasButton />
    </Container>
  );
}
