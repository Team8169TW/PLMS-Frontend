import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

export default function StoreCard(props) {
  const { storeInfo } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>倉儲資訊</Card.Title>
        <Table striped hover size="sm" borderless className="mb-0">
          <tbody>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>編號</th>
              <td>
                S.{storeInfo.area_code}-{storeInfo.grid_number}-
                {storeInfo.box_number}
              </td>
              <th style={{ whiteSpace: "nowrap" }}>櫃號</th>
              <td>
                {storeInfo.area_code} ({storeInfo.area_name})
              </td>
            </tr>
            <tr>
              <th>層號</th>
              <td>
                {storeInfo.grid_number === 0
                  ? "－未指定－"
                  : `第 ${storeInfo.grid_number} 層 (${storeInfo.grid_name})`}
              </td>
              <th>格號</th>
              <td>
                {storeInfo.box_number === 0
                  ? "－未指定－"
                  : `第 ${storeInfo.box_number} 格`}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

StoreCard.propTypes = {
  storeInfo: PropTypes.shape({
    area_code: PropTypes.string.isRequired,
    area_name: PropTypes.string.isRequired,
    grid_number: PropTypes.number.isRequired,
    grid_name: PropTypes.string.isRequired,
    box_number: PropTypes.number.isRequired,
  }).isRequired,
};
