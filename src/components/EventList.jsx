import React from "react";
import { Container, ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import "../css/list-group.css";
import PropTypes from "prop-types";
import ExpiredStorage from "expired-storage";

function isEventHide(code) {
  switch (code) {
    case "fsshlib1f":
      return true;
    case "fsshlib1f2":
      return true;
    case "fsshlib3fk":
      return true;
    case "khitlc1101":
      return true;
    case "demo":
      return true;
    default:
      return false;
  }
}

export default function EventList(props) {
  const history = useHistory();
  const { events } = props;
  const user = new ExpiredStorage().getJson("user");

  return (
    <>
      <Container className="info-container">
        <h2>所有進行中活動</h2>
        <ListGroup className="toc-container" id="toc">
          {events
            .slice(0)
            .reverse()
            .map(
              (item) =>
                ((!!user &&
                  (user.organize === "devteam" ||
                    user.organize === item.organize)) ||
                  !isEventHide(item.code)) && (
                  <ListGroupItem
                    action
                    className="rnrs-list-item"
                    onClick={() => {
                      history.push(`/declare/${item.code}`);
                    }}
                    key={item.id}
                  >
                    <h5>
                      {item.name}
                      {isEventHide(item.code) && "（不公開）"}
                    </h5>
                    <Badge variant="warning">
                      <FontAwesomeIcon icon={["far", "clock"]} /> {item.date}
                    </Badge>{" "}
                    <Badge variant="secondary">
                      <FontAwesomeIcon icon={["far", "map"]} /> {item.location}
                    </Badge>
                  </ListGroupItem>
                )
            )}
        </ListGroup>
      </Container>
    </>
  );
}

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      organize: PropTypes.string.isRequired,
    })
  ).isRequired,
};
