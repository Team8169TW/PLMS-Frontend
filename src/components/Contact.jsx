import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Contact() {
  return (
    <Container className="info-container">
      <h2>聯絡我們</h2>
      <Row className="footer-container-card">
        <Col sm>
          <FontAwesomeIcon icon="code" /> 鹿鯊工作室
        </Col>
        <Col sm>
          <FontAwesomeIcon icon="globe" /> 乘載一切的 Blog
        </Col>
        <Col sm>
          <FontAwesomeIcon icon="envelope" /> deershark.tech@gmail.com
        </Col>
        <Col sm>
          <FontAwesomeIcon icon="question" /> 關於本系統
        </Col>
      </Row>
    </Container>
  );
}
