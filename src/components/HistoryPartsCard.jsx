import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

function formatterType(type) {
  switch (type) {
    case "STORE_IN":
      return "入庫";
    case "STORE_OUT":
      return "出庫";
    default:
      return "未知";
  }
}

export default function HistoryPartsCard(props) {
  const { histories } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>歷史紀錄（最後三筆）</Card.Title>
        <Table
          striped
          hover
          size="sm"
          borderless
          className="mb-0"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>操作</th>
              <th>數量</th>
              <th>人員</th>
              <th>日期</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{formatterType(item.type)}</td>
                <td>{item.quantity}</td>
                <td>{item.operator_name}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

HistoryPartsCard.propTypes = {
  histories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      operator_name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};
