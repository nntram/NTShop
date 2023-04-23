import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AdminRoute = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  return (currentUser && currentUser.Role === 'admin')  ? <Outlet /> : <Navigate to="/ad-login" />;
};

export default AdminRoute;
