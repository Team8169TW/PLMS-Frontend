import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

export default function PartsCard(props) {
  const { partsInfo, detail } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>零件資訊</Card.Title>
        <Table striped hover size="sm" borderless className="mb-0">
          <tbody>
            <tr>
              <td style={{ whiteSpace: "nowrap" }}>
                <strong>序號</strong>
              </td>
              <td>P.{partsInfo.id}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <strong>類別</strong>
              </td>
              <td>{partsInfo.category}</td>
            </tr>
            <tr>
              <td>
                <strong>名稱</strong>
              </td>
              <td>{partsInfo.common_name}</td>
              <td>
                <strong>規格</strong>
              </td>
              <td>{partsInfo.spec}</td>
            </tr>
            {detail && (
              <>
                <tr>
                  <td>
                    <strong>廠商</strong>
                  </td>
                  <td>{partsInfo.supplier_name}</td>
                  <td>
                    <strong>料號</strong>
                  </td>
                  <td>{partsInfo.product_code}</td>
                </tr>
                <tr>
                  <td>
                    <strong>料名</strong>
                  </td>
                  <td colSpan="3">{partsInfo.product_name}</td>
                </tr>
              </>
            )}
            <tr>
              <td>
                <strong>數量</strong>
              </td>
              <td>
                {partsInfo.quantity} {partsInfo.unit}
              </td>
              <td>
                <strong>備註</strong>
              </td>
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
    unit: PropTypes.number.isRequired,
    supplier_name: PropTypes.string.isRequired,
    product_name: PropTypes.string.isRequired,
    product_code: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired,
  detail: PropTypes.bool,
};

PartsCard.defaultProps = {
  detail: false,
};
