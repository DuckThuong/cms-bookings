import type React from "react";
import { Role } from "@/api/dtos/auth.dto";
import { ROUTER_PATH } from "./Route";
import {
  ApartmentOutlined,
  BarChartOutlined,
  CarOutlined,
  DashboardOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export type MenuBadge = {
  text: string;
  type: string;
};

export type AppMenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge: MenuBadge | null;
};

export type AppMenuGroup = {
  label: string;
  items: AppMenuItem[];
};

export type BreadcrumbCrumb = {
  label: string;
  icon?: React.ReactNode;
};

export const MENU_PATHS: Record<string, string> = {
  dashboard: ROUTER_PATH.DASHBOARD,
  bookings: ROUTER_PATH.BOOKINGS,
  providers: ROUTER_PATH.PROVIDERS,
  trips: ROUTER_PATH.TRIPS,
  routes: ROUTER_PATH.ROUTES,
  vehicles: ROUTER_PATH.VEHICLES,
  customers: ROUTER_PATH.CUSTOMERS,
  drivers: ROUTER_PATH.DRIVERS,
  revenue: ROUTER_PATH.REVENUE,
  reports: ROUTER_PATH.REPORTS,
};

const CUSTOMER_MENU_GROUPS: AppMenuGroup[] = [
  {
    label: "Tổng quan",
    items: [{ key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", badge: null }],
  },
  {
    label: "Vận hành",
    items: [
      { key: "bookings", icon: <ScheduleOutlined />, label: "Đặt vé", badge: { text: "24", type: "orange" } },
      { key: "trips", icon: <CarOutlined />, label: "Chuyến xe", badge: { text: "8", type: "green" } },
      { key: "routes", icon: <EnvironmentOutlined />, label: "Tuyến đường", badge: null },
      { key: "vehicles", icon: <ApartmentOutlined />, label: "Phương tiện", badge: null },
    ],
  },
  {
    label: "Quản lý",
    items: [
      { key: "customers", icon: <TeamOutlined />, label: "Khách hàng", badge: { text: "120", type: "blue" } },
      { key: "drivers", icon: <CarOutlined />, label: "Tài xế", badge: null },
      { key: "revenue", icon: <DollarOutlined />, label: "Doanh thu", badge: null },
      { key: "reports", icon: <BarChartOutlined />, label: "Báo cáo", badge: null },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { key: "settings", icon: <SettingOutlined />, label: "Cài đặt", badge: null },
      { key: "help", icon: <QuestionCircleOutlined />, label: "Trợ giúp", badge: null },
    ],
  },
];

const ADMIN_MENU_GROUPS: AppMenuGroup[] = [
  {
    label: "Tổng quan",
    items: [{ key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", badge: null }],
  },
  {
    label: "Quản lý",
    items: [
      { key: "providers", icon: <ApartmentOutlined />, label: "Quản lý nhà xe", badge: null },
      { key: "customers", icon: <TeamOutlined />, label: "Quản lý người dùng", badge: { text: "120", type: "blue" } },
    ],
  },
];

export const ADMIN_ALLOWED_MENU_KEYS = new Set(["dashboard", "providers", "customers"]);

export const getMenuGroupsForRole = (role: Role | null): AppMenuGroup[] => {
  if (role === Role.ADMIN) {
    return ADMIN_MENU_GROUPS;
  }
  return CUSTOMER_MENU_GROUPS;
};

export const getActiveKeyFromPath = (pathname: string): string => {
  const match = Object.entries(MENU_PATHS).find(([, path]) => pathname === path || pathname.endsWith(`/${path}`));
  return match?.[0] ?? "dashboard";
};

export const isPathAllowedForRole = (pathname: string, role: Role | null): boolean => {
  if (role !== Role.ADMIN) {
    return true;
  }
  return ADMIN_ALLOWED_MENU_KEYS.has(getActiveKeyFromPath(pathname));
};

export const getBreadcrumbs = (activeKey: string, role: Role | null): BreadcrumbCrumb[] => {
  if (activeKey === "customers" && role === Role.ADMIN) {
    return [{ label: "Quản lý" }, { label: "Người dùng" }];
  }

  const routeMap: Record<string, BreadcrumbCrumb[]> = {
    dashboard: [{ icon: <HomeOutlined />, label: "Dashboard" }],
    bookings: [{ label: "Vận hành" }, { label: "Đặt vé" }],
    providers: [{ label: "Quản lý" }, { label: "Nhà xe" }],
    trips: [{ label: "Vận hành" }, { label: "Chuyến xe" }],
    routes: [{ label: "Vận hành" }, { label: "Tuyến đường" }],
    vehicles: [{ label: "Vận hành" }, { label: "Phương tiện" }],
    customers: [{ label: "Quản lý" }, { label: "Khách hàng" }],
    drivers: [{ label: "Quản lý" }, { label: "Tài xế" }],
    revenue: [{ label: "Quản lý" }, { label: "Doanh thu" }],
    reports: [{ label: "Quản lý" }, { label: "Báo cáo" }],
    settings: [{ label: "Hệ thống" }, { label: "Cài đặt" }],
    help: [{ label: "Hệ thống" }, { label: "Trợ giúp" }],
  };

  return routeMap[activeKey] ?? routeMap.dashboard;
};
