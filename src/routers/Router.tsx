import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { Login } from "@/pages/auth/pages/Login";
import AppLayout from "@/pages/dashboard";
import DashboardPage from "@/pages/dashboard/Pages/Page1";

export const WebRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to={ROUTER_PATH.DASHBOARD} replace />} />
    <Route path={ROUTER_PATH.LOGIN} element={<Login />} />
    <Route path={ROUTER_PATH.DASHBOARD} element={<AppLayout />}>
      <Route index element={<DashboardPage />} />
    </Route>
  </Routes>
);
