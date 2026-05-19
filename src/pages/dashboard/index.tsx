import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import AppSidebar from '@/components/Sidebar';
import AppHeader from '@/components/TopBar';
import { ROUTER_PATH } from '@/routers/Route';

const MENU_PATHS: Record<string, string> = {
  dashboard: ROUTER_PATH.DASHBOARD,
  bookings: ROUTER_PATH.BOOKINGS,
  trips: ROUTER_PATH.TRIPS,
  routes: ROUTER_PATH.ROUTES,
  vehicles: ROUTER_PATH.VEHICLES,
  customers: ROUTER_PATH.CUSTOMERS,
  drivers: ROUTER_PATH.DRIVERS,
  revenue: ROUTER_PATH.REVENUE,
  reports: ROUTER_PATH.REPORTS,
};

const getActiveKeyFromPath = (pathname: string): string => {
  if (pathname === ROUTER_PATH.BOOKINGS || pathname.endsWith('/bookings')) {
    return 'bookings';
  }
  if (pathname === ROUTER_PATH.TRIPS || pathname.endsWith('/trips')) {
    return 'trips';
  }
  if (pathname === ROUTER_PATH.ROUTES || pathname.endsWith('/routes')) {
    return 'routes';
  }
  if (pathname === ROUTER_PATH.VEHICLES || pathname.endsWith('/vehicles')) {
    return 'vehicles';
  }
  if (pathname === ROUTER_PATH.CUSTOMERS || pathname.endsWith('/customers')) {
    return 'customers';
  }
  if (pathname === ROUTER_PATH.DRIVERS || pathname.endsWith('/drivers')) {
    return 'drivers';
  }
  if (pathname === ROUTER_PATH.REVENUE || pathname.endsWith('/revenue')) {
    return 'revenue';
  }
  if (pathname === ROUTER_PATH.REPORTS || pathname.endsWith('/reports')) {
    return 'reports';
  }
  return 'dashboard';
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(() => getActiveKeyFromPath(location.pathname));

  useEffect(() => {
    setActiveKey(getActiveKeyFromPath(location.pathname));
  }, [location.pathname]);

  const handleToggle = () => setCollapsed((prev) => !prev);

  const handleMenuSelect = (key: string) => {
    setActiveKey(key);
    const path = MENU_PATHS[key];
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="app-layout">
      <AppSidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        activeKey={activeKey}
        onMenuSelect={handleMenuSelect}
      />

      <div className={`app-layout__content ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <AppHeader sidebarCollapsed={collapsed} activeKey={activeKey} />
        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
