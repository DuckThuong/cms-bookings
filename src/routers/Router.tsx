import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { Login } from "@/pages/auth/pages/Login";
import AppLayout from "@/pages/dashboard";
import DashboardPage from "@/pages/dashboard/Pages/Page1";
import BookingManagementPage from "@/pages/dashboard/Pages/Page2";
import ProvidersPage from "@/pages/dashboard/Pages/Providers";
import TripsPage from "@/pages/dashboard/Pages/Trips";
import RoutesPage from "@/pages/dashboard/Pages/Routes";
import FleetVehiclesPage from "@/pages/dashboard/Pages/Vehicles";
import CustomersPage from "@/pages/dashboard/Pages/Customers";
import DriversPage from "@/pages/dashboard/Pages/Drivers";
import RevenuePage from "@/pages/dashboard/Pages/Revenue";
import ReportsPage from "@/pages/dashboard/Pages/Reports";
import RefundManagementPage from "@/pages/dashboard/Pages/Refunds";
import { ChatLayout, ChatPage, ChatDetailPage } from "@/pages/chat";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import CompanyRegistrationsPage from "@/pages/dashboard/Pages/CompanyRegistrations";
import { SettingPage } from "@/pages/setting/pages";

export const WebRouter = () => (
  <Routes>
    <Route path={ROUTER_PATH.LOGIN} element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path={ROUTER_PATH.DASHBOARD} element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path={ROUTER_PATH.BOOKINGS} element={<AppLayout />}>
        <Route index element={<BookingManagementPage />} />
      </Route>
      <Route path={ROUTER_PATH.PROVIDERS} element={<AppLayout />}>
        <Route index element={<ProvidersPage />} />
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
      <Route path={ROUTER_PATH.REFUNDS} element={<AppLayout />}>
        <Route index element={<RefundManagementPage />} />
      </Route>
      <Route path={ROUTER_PATH.CHAT} element={<AppLayout />}>
        <Route element={<ChatLayout />}>
          <Route index element={<ChatPage />} />
          <Route path=":id" element={<ChatDetailPage />} />
        </Route>
      </Route>
      <Route path={ROUTER_PATH.SETTINGS} element={<AppLayout />}>
        <Route index element={<SettingPage />} />
      </Route>
      <Route path={ROUTER_PATH.COMPANY_REGISTRATIONS} element={<AppLayout />}>
        <Route index element={<CompanyRegistrationsPage />} />
      </Route>
    </Route>
    <Route path={ROUTER_PATH.NOT_FOUND} element={<NotFoundPage />} />
  </Routes>
);
