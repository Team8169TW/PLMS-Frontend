import React from "react";
import { Route, Redirect } from "react-router-dom";
import ExpiredStorage from "expired-storage";

const renderRoutes = (routes) =>
  routes
    ? routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) => {
            if (route.render) {
              return route.render();
            }
            const authed = !!new ExpiredStorage().getJson("user");
            if (!route.protected || authed || route.path === "/login") {
              // eslint-disable-next-line react/jsx-props-no-spreading
              return <route.component {...props} route={route} />;
            }
            return (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            );
          }}
        />
      ))
    : null;

export default renderRoutes;
