import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import ExpiredStorage from "expired-storage";

const expiredStorage = new ExpiredStorage();

export default function Menu() {
  const [user, setUser] = useState(expiredStorage.getJson("user"));
  useEffect(() => {
    setUser(expiredStorage.getJson("user"));
  }, [useLocation().pathname, expiredStorage.getItem("access_token")]);

  return (
    <>
      <Nav className="mr-auto">
        {/* <Nav.Item>
          <NavLink
            to="/announcement"
            activeClassName="active"
            className="nav-link"
          >
            <span className="nav-link-span">系統公告</span>
          </NavLink>
        </Nav.Item> */}
        {!!user && user.role !== "visitor" && (
          <Nav.Item>
            <NavLink to="/scan" activeClassName="active" className="nav-link">
              <span className="nav-link-span">一般作業</span>
            </NavLink>
          </Nav.Item>
        )}
      </Nav>
      <Nav className="ml-auto">
        {!!user && user.role !== "visitor" && (
          <Nav.Item>
            <NavLink
              to="/manageParts"
              activeClassName="active"
              className="nav-link"
            >
              <span className="nav-link-span">零件管理</span>
            </NavLink>
          </Nav.Item>
        )}
        {!!user && user.role !== "visitor" && (
          <Nav.Item>
            <NavLink
              to="/manageStores"
              activeClassName="active"
              className="nav-link"
            >
              <span className="nav-link-span">倉儲管理</span>
            </NavLink>
          </Nav.Item>
        )}
        {!!user && user.role !== "visitor" && (
          <Nav.Item>
            <NavLink
              to="/manageHistory"
              activeClassName="active"
              className="nav-link"
            >
              <span className="nav-link-span">歷史紀錄</span>
            </NavLink>
          </Nav.Item>
        )}
        <Nav.Item>
          <NavLink to="/login" activeClassName="active" className="nav-link">
            <span className="nav-link-span">
              {user ? `${user.name}/登出` : "登入"}
            </span>
          </NavLink>
        </Nav.Item>
      </Nav>
    </>
  );
}
