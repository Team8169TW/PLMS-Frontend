import React from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import Padding from "./Padding";

export default function StoreContentCard(props) {
  const { storeContents } = props;
  return (
    <Card>
      <Card.Body className="p-3">
        <Card.Title>倉儲內容</Card.Title>
        {storeContents.length === 0 && <Padding msg="等待輸入..." />}
        {storeContents.length > 0 &&
          (storeContents[0].boxes
            ? storeContents.map((grid) => (
                <Card className="mb-1" key={grid.number}>
                  <Card.Body className="p-2">
                    <Card.Title className="m-0">
                      第 {grid.number} 層 ({grid.name})
                    </Card.Title>
                    <Table striped hover size="sm" borderless className="mb-0">
                      <tbody>
                        {grid.boxes.map((box) => (
                          <tr key={box.number}>
                            <th style={{ whiteSpace: "nowrap", width: "15px" }}>
                              第 {box.number} 格
                            </th>
                            <td>{box.contents}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ))
            : storeContents.map((box) => (
                <Card className="mb-1" key={box.number}>
                  <Card.Body className="p-2">
                    <Card.Title className="m-0">第 {box.number} 格</Card.Title>
                    <Table striped hover size="sm" borderless className="mb-0">
                      <tbody>
                        {box.parts.map((part) => (
                          <tr key={part.id}>
                            <th>P.{part.id.toString().padStart(5, "0")}</th>
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
              )))}
      </Card.Body>
    </Card>
  );
}

StoreContentCard.propTypes = {
  storeContents: PropTypes.oneOfType([
    PropTypes.arrayOf(
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
    PropTypes.arrayOf(
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
  ]).isRequired,
};
