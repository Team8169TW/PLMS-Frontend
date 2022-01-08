import React, { useEffect, useState } from "react";
import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import "../css/BS5-Accordion.css";
import API from "../API";

export default function ManageStorePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get(`/store`).then((res) => {
      if (res.status === 200) setData(res.data);
    });
  }, [true]);

  return (
    <Container className="info-container">
      <h2>倉儲管理</h2>
      <Accordion alwaysOpen>
        {data.map((area) => (
          <Accordion.Item eventKey="">
            <Accordion.Header>
              {area.code} - {area.name}
            </Accordion.Header>
            <Accordion.Body>
              {area.grids.map((grid) => (
                <Accordion alwaysOpen>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      第 {grid.number} 層－{grid.name}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        {grid.boxes.map((box) => (
                          <Col sm={6} md={4} lg={3} className="mb-2">
                            <Card>
                              <Card.Body>
                                <Card.Title>第 {box.number} 格</Card.Title>
                                <ul>
                                  {box.parts.map((part) => (
                                    <li>{part}</li>
                                  ))}
                                </ul>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
