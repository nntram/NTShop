import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  if (currentUser === undefined) {
    return null; // or loading indicator, etc...
  }
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
