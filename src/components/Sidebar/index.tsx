import React, { useState } from "react";
import { Tooltip } from "antd";
import {
  DashboardOutlined,
  ScheduleOutlined,
  CarOutlined,
  TeamOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LeftOutlined,
  RightOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./style.scss";
import { Logo } from "../Logo";

const MENU_GROUPS = [
  {
    label: "Tổng quan",
    items: [
      {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        badge: null,
      },
    ],
  },
  {
    label: "Vận hành",
    items: [
      {
        key: "bookings",
        icon: <ScheduleOutlined />,
        label: "Đặt vé",
        badge: { text: "24", type: "orange" },
      },
      {
        key: "trips",
        icon: <CarOutlined />,
        label: "Chuyến xe",
        badge: { text: "8", type: "green" },
      },
      {
        key: "routes",
        icon: <EnvironmentOutlined />,
        label: "Tuyến đường",
        badge: null,
      },
      {
        key: "vehicles",
        icon: <ApartmentOutlined />,
        label: "Phương tiện",
        badge: null,
      },
    ],
  },
  {
    label: "Quản lý",
    items: [
      {
        key: "customers",
        icon: <TeamOutlined />,
        label: "Khách hàng",
        badge: { text: "120", type: "blue" },
      },
      {
        key: "drivers",
        icon: <CarOutlined />,
        label: "Tài xế",
        badge: null,
      },
      {
        key: "revenue",
        icon: <DollarOutlined />,
        label: "Doanh thu",
        badge: null,
      },
      {
        key: "reports",
        icon: <BarChartOutlined />,
        label: "Báo cáo",
        badge: null,
      },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
        badge: null,
      },
      {
        key: "help",
        icon: <QuestionCircleOutlined />,
        label: "Trợ giúp",
        badge: null,
      },
    ],
  },
];

type MenuItemProps = {
  item: any;
  isActive: boolean;
  collapsed: boolean;
  onClick: (key: string) => void;
};

type MenuGroupProps = {
  group: any;
  activeKey: string;
  collapsed: boolean;
  onSelect: (key: string) => void;
};

type CollapseToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  activeKey: string;
  onMenuSelect: (key: string) => void;
};

const SidebarLogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="app-sidebar__logo">
    <a className="sidebar-logo" href="/">
      <div className="sidebar-logo__icon">🚌</div>
      {!collapsed && (
        <div className="sidebar-logo__text-container">
          <div className="sidebar-logo__text">
            <Logo /> <span className="sidebar-logo__text-separator">|</span>
            <span>CMS System</span>
            <span className="sidebar-logo__badge">v2.5</span>
          </div>
        </div>
      )}
    </a>
  </div>
);

const MenuItem = ({ item, isActive, collapsed, onClick }: MenuItemProps) => {
  const content = (
    <div
      className={`menu-item ${isActive ? "active" : ""}`}
      onClick={() => onClick(item.key)}
    >
      <div className="menu-item__icon">{item.icon}</div>
      {!collapsed && (
        <>
          <span className="menu-item__label">{item.label}</span>
          {item.badge && (
            <span
              className={`menu-item__badge menu-item__badge--${item.badge.type}`}
            >
              {item.badge.text}
            </span>
          )}
        </>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right" mouseEnterDelay={0.1}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

const MenuGroup = ({
  group,
  activeKey,
  collapsed,
  onSelect,
}: MenuGroupProps) => (
  <div className="sidebar-menu__group">
    {!collapsed && (
      <div className="sidebar-menu__group-label">{group.label}</div>
    )}
    {group.items.map((item: any) => (
      <MenuItem
        key={item.key}
        item={item}
        isActive={activeKey === item.key}
        collapsed={collapsed}
        onClick={onSelect}
      />
    ))}
  </div>
);

const SidebarFooter = ({ collapsed }: { collapsed: boolean }) => (
  <div className="sidebar-footer">
    <div className="sidebar-footer__avatar">AD</div>
    {!collapsed && (
      <div className="sidebar-footer__info">
        <div className="sidebar-footer__info-name">Admin Hệ thống</div>
        <div className="sidebar-footer__info-role">Super Administrator</div>
      </div>
    )}
    {!collapsed && (
      <Tooltip title="Đăng xuất" placement="top">
        <div className="sidebar-footer__action">
          <LogoutOutlined />
        </div>
      </Tooltip>
    )}
  </div>
);

const CollapseToggle = ({ collapsed, onToggle }: CollapseToggleProps) => (
  <Tooltip title={collapsed ? "Mở rộng" : "Thu gọn"} placement="right">
    <div
      className={`sidebar-toggle ${collapsed ? "collapsed" : ""}`}
      onClick={onToggle}
    >
      {collapsed ? <RightOutlined /> : <LeftOutlined />}
    </div>
  </Tooltip>
);

const AppSidebar = ({
  collapsed,
  onToggle,
  activeKey,
  onMenuSelect,
}: AppSidebarProps) => {
  return (
    <>
      <div className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
        <SidebarLogo collapsed={collapsed} />

        <div className="sidebar-menu">
          {MENU_GROUPS.map((group, idx) => (
            <React.Fragment key={group.label}>
              {idx > 0 && <div className="sidebar-menu__divider" />}
              <MenuGroup
                group={group}
                activeKey={activeKey}
                collapsed={collapsed}
                onSelect={onMenuSelect}
              />
            </React.Fragment>
          ))}
        </div>

        <SidebarFooter collapsed={collapsed} />
      </div>

      <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
    </>
  );
};

export default AppSidebar;
