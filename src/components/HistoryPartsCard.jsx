import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

export default function HistoryPartsCard(props) {
  const { histories } = props;
  console.log(histories);
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
              <th>備註</th>
              <th>日期</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>{item.quantity}</td>
                <td>{item.operator_name}</td>
                <td>{item.note}</td>
                <td>{item.date}</td>
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
      note: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};
