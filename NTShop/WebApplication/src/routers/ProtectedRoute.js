import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
