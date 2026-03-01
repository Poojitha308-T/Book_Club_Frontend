import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes.config";
import ProtectedRoute from "./ProtectedRoute";

const Router = ({ isAuthenticated }) => {
  const renderRoutes = (routeArray) =>
    routeArray.map((route, index) => {
      if (route.protected) {
        // Wrap protected routes with ProtectedRoute
        return (
          <Route
            key={index}
            path={route.path || undefined} // Some layouts may not have path
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={route.requiredRole}>
                {route.element}
              </ProtectedRoute>
            }
          >
            {route.children && renderRoutes(route.children)}
          </Route>
        );
      }
      // Public route
      return (
        <Route key={index} path={route.path} element={route.element}>
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });

  return (
    <BrowserRouter>
      <Routes>{renderRoutes(routes)}</Routes>
    </BrowserRouter>
  );
};

export default Router;