import React from "react";
import { Redirect } from "react-router-dom";
import loadable from "@loadable/component";
import NotFoundPage from "../pages/NotFoundPage";

const routes = {
  routes: [
    {
      path: "/",
      exact: true,
      render: () => <Redirect to="/index" />,
    },
    {
      path: "/index",
      component: loadable(() => import("../pages/IndexPage")),
    },
    {
      path: "/announcement",
      component: loadable(() => import("../pages/testPage")),
    },
    {
      path: "/scan",
      component: loadable(() => import("../pages/ScanPage")),
      protected: true,
    },
    {
      path: "/manageParts",
      component: loadable(() => import("../pages/ManagePartsPage")),
      protected: true,
    },
    {
      path: "/manageStores",
      component: loadable(() => import("../pages/ManageCheckinPage")),
      protected: true,
    },
    {
      path: "/manageHistory",
      component: loadable(() => import("../pages/testPage")),
      protected: true,
    },
    {
      path: "/login",
      component: loadable(() => import("../pages/LoginPage")),
    },
    {
      path: "*",
      component: NotFoundPage,
    },
  ],
};

export default routes;
