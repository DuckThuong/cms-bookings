import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLoading } from "../providers/loadingProvider";
import { ROUTER_PATH } from "./Route";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { setLoading } = useLoading();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const token = localStorage.getItem("token");
  setLoading(true);
  if (!token) {
    setLoading(false);
    return (
      <Navigate to={ROUTER_PATH.LOGIN} replace state={{ from: currentPath }} />
    );
  }
  
  setLoading(false);
  return <Outlet />;
};

export default ProtectedRoute;
