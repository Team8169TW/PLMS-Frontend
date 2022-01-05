import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";

export default function Title(props) {
  const { content } = props;

  return (
    <Container className="title-container">
      <div className="d-flex justify-content-center align-self-center">
        <h1 className="title-container-title">{content}</h1>
      </div>
    </Container>
  );
}

Title.propTypes = {
  content: PropTypes.string.isRequired,
};

/*
    <div className={'header-container-text d-flex justify-content-center align-self-center'}>
      <h2 className={'header-container-title'}>雄中雄女聯合耶誕晚會</h2>
    </div>
 */
