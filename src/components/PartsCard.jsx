import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

export default function PartsCard(props) {
  const { partsInfo } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>零件資訊</Card.Title>
        <Table striped hover size="sm" borderless className="mb-0">
          <tbody>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>序號</th>
              <td>P.{partsInfo.id}</td>
              <th style={{ whiteSpace: "nowrap" }}>類別</th>
              <td>{partsInfo.category}</td>
            </tr>
            <tr>
              <th>名稱</th>
              <td>{partsInfo.common_name}</td>
              <th>規格</th>
              <td>{partsInfo.spec}</td>
            </tr>
            <tr>
              <th>廠商</th>
              <td>{partsInfo.supplier_name}</td>
              <th>料號</th>
              <td>{partsInfo.product_code}</td>
            </tr>
            <tr>
              <th>料名</th>
              <td colSpan="3">{partsInfo.product_name}</td>
            </tr>
            <tr>
              <th>數量</th>
              <td>
                {partsInfo.quantity} {partsInfo.unit}
              </td>
              <th>備註</th>
              <td>{partsInfo.note}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

PartsCard.propTypes = {
  partsInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    common_name: PropTypes.string.isRequired,
    spec: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    supplier_name: PropTypes.string.isRequired,
    product_name: PropTypes.string.isRequired,
    product_code: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired,
};
