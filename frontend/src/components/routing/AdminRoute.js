import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// This is a simplified version - in a real app, you'd check admin status
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && user.isAdmin ? (
    children
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default AdminRoute;
