import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({
  children,
  isAuthenticated,
  user,
  redirectPath = "/dashboard",
}) => {
  useEffect(() => {
    console.log("[AdminRoute] Rendered with auth state:", isAuthenticated);
    console.log("[AdminRoute] User role:", user?.role);
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    console.log("[AdminRoute] Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (!user || user.role !== "admin") {
    console.log("[AdminRoute] Not admin, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} />;
  }

  console.log("[AdminRoute] Admin authenticated, rendering children");
  return children;
};

export default AdminRoute;
