import React from "react";
import { Container } from "react-bootstrap";
import Padding from "../components/Padding";

class TestPage extends React.Component {
  render() {
    return (
      <>
        <Container className="info-container">
          <h2>Test Container</h2>
          <Padding msg="尚未啟用" />
        </Container>
      </>
    );
  }
}

export default TestPage;
