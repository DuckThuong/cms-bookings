import { useAuth } from "@/common/contexts/authContext";
import { Role } from "@/api/dtos/auth.dto";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTER_PATH } from "./Route";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isAuthResolved, role, signOut } = useAuth();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const canAccessCms = role === Role.ADMIN || role === Role.CUSTOMER;

  useEffect(() => {
    if (isAuthResolved && isAuthenticated && !canAccessCms) {
      signOut();
    }
  }, [canAccessCms, isAuthResolved, isAuthenticated, signOut]);

  if (!isAuthResolved) {
    return null;
  }

  if (!isAuthenticated || !canAccessCms) {
    return (
      <Navigate to={ROUTER_PATH.LOGIN} replace state={{ from: currentPath }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
