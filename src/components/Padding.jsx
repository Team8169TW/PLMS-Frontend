import React from "react";
import PropTypes from "prop-types";

export default function Padding(props) {
  const { msg } = props;
  return <p className="m-0 p-2 padding">{msg}</p>;
}

Padding.propTypes = {
  msg: PropTypes.string.isRequired,
};
