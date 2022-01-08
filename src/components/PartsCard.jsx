import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import Padding from "./Padding";

export default function PartsCard(props) {
  const { partsInfo } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>零件資訊</Card.Title>
        {partsInfo.id === 0 ? (
          <Padding msg="等待輸入..." />
        ) : (
          <Table striped hover size="sm" borderless className="mb-0">
            <tbody>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>序號</th>
                <td>
                  {partsInfo.id !== 0 &&
                    `P.${partsInfo.id.toString().padStart(5, "0")}`}
                </td>
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
        )}
      </Card.Body>
    </Card>
  );
}

PartsCard.propTypes = {
  partsInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.string,
    common_name: PropTypes.string,
    spec: PropTypes.string,
    quantity: PropTypes.number,
    unit: PropTypes.string,
    supplier_name: PropTypes.string,
    product_name: PropTypes.string,
    product_code: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
};

/* {
  id: 12345,
  category: "動力",
  common_name: "14U4 變速箱",
  spec: "變速比 10.71:1",
  quantity: 2,
  unit: "組",
  supplier_name: "Andymark",
  product_name: "AM14U4 - FIRST Kit of Parts Chassis",
  product_code: "am-14U4",
  note: "六輪底盤",
} */
