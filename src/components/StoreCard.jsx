import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import Padding from "./Padding";

export default function StoreCard(props) {
  const { storeInfo } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>倉儲資訊</Card.Title>
        {storeInfo.area_code === "NULL" ? (
          <Padding msg="等待輸入..." />
        ) : (
          <Table striped hover size="sm" borderless className="mb-0">
            <tbody>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>編號</th>
                <td>
                  S.{storeInfo.area_code ?? 0}-{storeInfo.grid_number ?? 0}-
                  {storeInfo.box_number ?? 0}
                </td>
                <th style={{ whiteSpace: "nowrap" }}>櫃號</th>
                <td>
                  {storeInfo.area_code} ({storeInfo.area_name})
                </td>
              </tr>
              <tr>
                <th>層號</th>
                <td>
                  {storeInfo.grid_number
                    ? `第 ${storeInfo.grid_number} 層 (${storeInfo.grid_name})`
                    : "－未指定－"}
                </td>
                <th>格號</th>
                <td>
                  {storeInfo.box_number
                    ? `第 ${storeInfo.box_number} 格`
                    : "－未指定－"}
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

StoreCard.propTypes = {
  storeInfo: PropTypes.shape({
    area_code: PropTypes.string.isRequired,
    area_name: PropTypes.string,
    grid_number: PropTypes.number,
    grid_name: PropTypes.string,
    box_number: PropTypes.number,
  }).isRequired,
};

/* {
  area_code: "H",
  area_name: "3F 動力櫃",
  grid_number: 3,
  grid_name: "變速箱 ",
  box_number: 12,
} */
