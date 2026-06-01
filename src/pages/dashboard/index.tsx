import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import AppSidebar from '@/components/Sidebar';
import AppHeader from '@/components/TopBar';
import { ROUTER_PATH } from '@/routers/Route';
import { useAuth } from '@/common/contexts/authContext';
import {
  MENU_PATHS,
  getActiveKeyFromPath,
  getMenuGroupsForRole,
  isPathAllowedForRole,
} from '@/routers/navigation';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(() => getActiveKeyFromPath(location.pathname));
  const menuGroups = getMenuGroupsForRole(role);
  const isCurrentPathAllowed = isPathAllowedForRole(location.pathname, role);

  useEffect(() => {
    setActiveKey(getActiveKeyFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (!isCurrentPathAllowed) {
      navigate(ROUTER_PATH.DASHBOARD, { replace: true });
    }
  }, [isCurrentPathAllowed, navigate]);

  const handleToggle = () => setCollapsed((prev) => !prev);

  const handleMenuSelect = (key: string) => {
    setActiveKey(key);
    const path = MENU_PATHS[key];
    if (path) {
      navigate(path);
    }
  };

  if (!isCurrentPathAllowed) {
    return null;
  }

  return (
    <div className="app-layout">
      <AppSidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        activeKey={activeKey}
        menuGroups={menuGroups}
        onMenuSelect={handleMenuSelect}
      />

      <div className={`app-layout__content ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <AppHeader sidebarCollapsed={collapsed} activeKey={activeKey} role={role} />
        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
