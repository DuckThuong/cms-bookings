
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import AppSidebar from '@/components/Sidebar';
import AppHeader from '@/components/TopBar';
import { ROUTER_PATH } from '@/routers/Route';

const MENU_PATHS: Record<string, string> = {
  dashboard: ROUTER_PATH.DASHBOARD,
  page1: ROUTER_PATH.PAGE1,
};

const getActiveKeyFromPath = (pathname: string): string => {
  if (pathname === ROUTER_PATH.PAGE1 || pathname.endsWith('/page1')) {
    return 'page1';
  }
  return 'dashboard';
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(() =>
    getActiveKeyFromPath(location.pathname),
  );

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
        <AppHeader
          sidebarCollapsed={collapsed}
          activeKey={activeKey}
        />

        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
