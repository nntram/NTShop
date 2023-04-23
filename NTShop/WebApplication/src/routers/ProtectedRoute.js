import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const currentUser = useSelector(state => state.customer.currentUser);
  return (currentUser) ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
