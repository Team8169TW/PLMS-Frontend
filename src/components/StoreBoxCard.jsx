import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

export default function StoreBoxCard(props) {
  const { storeBoxes } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>倉儲內容</Card.Title>
        {storeBoxes.map((box) => (
          <Card className="mb-1">
            <Card.Body className="p-2">
              <Card.Title className="m-0">第 {box.number} 格</Card.Title>
              <Table striped hover size="sm" borderless className="mb-0">
                <tbody>
                  {box.parts.map((part) => (
                    <tr>
                      <th>P.{part.id}</th>
                      <td>{part.common_name}</td>
                      <td>{part.spec}</td>
                      <td>
                        {part.quantity} {part.unit}
                      </td>
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

StoreBoxCard.propTypes = {
  storeBoxes: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      parts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          common_name: PropTypes.string.isRequired,
          spec: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          unit: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
