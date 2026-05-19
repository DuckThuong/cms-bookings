import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { Login } from "@/pages/auth/pages/Login";
import AppLayout from "@/pages/dashboard";
import DashboardPage from "@/pages/dashboard/Pages/Page1";
import BookingManagementPage from "@/pages/dashboard/Pages/Page2";

export const WebRouter = () => (
  <Routes>
    <Route path={ROUTER_PATH.LOGIN} element={<Login />} />
    <Route path={ROUTER_PATH.DASHBOARD} element={<AppLayout />}>
      <Route index element={<DashboardPage />} />
    </Route>
    <Route path={ROUTER_PATH.BOOKINGS} element={<AppLayout />}>
      <Route index element={<BookingManagementPage />} />
    </Route>
  </Routes>
);
