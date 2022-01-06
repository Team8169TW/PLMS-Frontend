import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

export default function StoreGridCard(props) {
  const { storeGrids } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>倉儲內容</Card.Title>
        {storeGrids.map((grid) => (
          <Card className="mb-1">
            <Card.Body className="p-2">
              <Card.Title className="m-0">
                第 {grid.number} 層 ({grid.name})
              </Card.Title>
              <Table striped hover size="sm" borderless className="mb-0">
                <tbody>
                  {grid.boxes.map((box) => (
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>
                        第 {box.number} 格
                      </th>
                      <td>{box.contents}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
}

StoreGridCard.propTypes = {
  storeGrids: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      boxes: PropTypes.arrayOf(
        PropTypes.shape({
          number: PropTypes.number.isRequired,
          contents: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
