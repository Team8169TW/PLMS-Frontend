import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Menu from "./Menu";
import "../css/Header.css";

export default function Header() {
  const styleBanner = {
    background:
      "url(/img/background.jpg) no-repeat fixed center center / cover",
  };
  return (
    <div className="header-container">
      <div className="banner-container" style={styleBanner} />
      <Container className="nav-container font-weight-bold" id="navbar">
        <Navbar expand="lg" variant="light" className="pb-3">
          <Container>
            <Navbar.Brand
              href="https://team8169tw.github.io/"
              id="logo"
              target="_blank"
            >
              FRC Team 8169
            </Navbar.Brand>
            <LinkContainer to="/index">
              <Navbar.Brand id="product">零件庫管理系統</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle />
            <Navbar.Collapse id="navbarNav">
              <Menu />
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
    </div>
  );
}
