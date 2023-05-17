import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const SupperAdminRoute = () => {
  const currentStaff = useSelector(state => state.staff.currentStaff)
  return (currentStaff.Role === 'Admin')  ? <Outlet /> : <Navigate to="admin-login" />;
};

export default SupperAdminRoute;
