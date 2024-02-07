// ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useAuth();


  if (authenticated) {
    return children
  } 

  return (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
