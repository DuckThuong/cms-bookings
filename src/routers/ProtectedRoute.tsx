import { useAuth } from "@/common/contexts/authContext";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTER_PATH } from "./Route";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isAuthResolved } = useAuth();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  if (!isAuthResolved) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTER_PATH.LOGIN} replace state={{ from: currentPath }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
