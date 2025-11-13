import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ user, children }) => {
  if (user) {
    // If logged in, redirect to correct dashboard
    if (user.role === "student") return <Navigate to="/student" replace />;
    if (user.role === "teacher") return <Navigate to="/teacher" replace />;
  }
  return children;
};

export default PublicRoute;
