import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { Login } from "@/pages/auth/pages/Login";
import AppLayout from "@/pages/dashboard";
import DashboardPage from "@/pages/dashboard/Pages/Page1";
import BookingManagementPage from "@/pages/dashboard/Pages/Page2";
import TripsPage from "@/pages/dashboard/Pages/Trips";
import RoutesPage from "@/pages/dashboard/Pages/Routes";
import FleetVehiclesPage from "@/pages/dashboard/Pages/Vehicles";
import CustomersPage from "@/pages/dashboard/Pages/Customers";
import DriversPage from "@/pages/dashboard/Pages/Drivers";
import RevenuePage from "@/pages/dashboard/Pages/Revenue";
import ReportsPage from "@/pages/dashboard/Pages/Reports";

export const WebRouter = () => (
  <Routes>
    <Route path="" element={<Navigate to={ROUTER_PATH.DASHBOARD} />} />
    <Route path={ROUTER_PATH.LOGIN} element={<Login />} />
    <Route path={ROUTER_PATH.DASHBOARD} element={<AppLayout />}>
      <Route index element={<DashboardPage />} />
    </Route>
    <Route path={ROUTER_PATH.BOOKINGS} element={<AppLayout />}>
      <Route index element={<BookingManagementPage />} />
    </Route>
    <Route path={ROUTER_PATH.TRIPS} element={<AppLayout />}>
      <Route index element={<TripsPage />} />
    </Route>
    <Route path={ROUTER_PATH.ROUTES} element={<AppLayout />}>
      <Route index element={<RoutesPage />} />
    </Route>
    <Route path={ROUTER_PATH.VEHICLES} element={<AppLayout />}>
      <Route index element={<FleetVehiclesPage />} />
    </Route>
    <Route path={ROUTER_PATH.CUSTOMERS} element={<AppLayout />}>
      <Route index element={<CustomersPage />} />
    </Route>
    <Route path={ROUTER_PATH.DRIVERS} element={<AppLayout />}>
      <Route index element={<DriversPage />} />
    </Route>
    <Route path={ROUTER_PATH.REVENUE} element={<AppLayout />}>
      <Route index element={<RevenuePage />} />
    </Route>
    <Route path={ROUTER_PATH.REPORTS} element={<AppLayout />}>
      <Route index element={<ReportsPage />} />
    </Route>
  </Routes>
);
