
import React, { useState } from 'react';
import './style.scss';
import AppSidebar from '@/components/Sidebar';
import AppHeader from '@/components/TopBar';

interface DashBoardProps {
    children: React.ReactNode;
}
const Dashboard = ({ children }: DashBoardProps) => {
  const [collapsed, setCollapsed]   = useState(false);
  const [activeKey, setActiveKey]   = useState('dashboard');

  const handleToggle = () => setCollapsed((prev) => !prev);
  const handleMenuSelect = (key: string) => setActiveKey(key);

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
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;