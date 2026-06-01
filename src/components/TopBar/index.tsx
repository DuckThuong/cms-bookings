import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Dropdown, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useAuth } from "@/common/contexts/authContext";
import type { Role } from "@/api/dtos/auth.dto";
import { ROUTER_PATH } from "@/routers/Route";
import { getBreadcrumbs } from "@/routers/navigation";
import {
  BellOutlined,
  DownOutlined,
  GlobalOutlined,
  LogoutOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./style.scss";

const USER_MENU_ITEMS = [
  { key: "profile", icon: <UserOutlined />, label: "Hồ sơ cá nhân" },
  { key: "activity", icon: <ProfileOutlined />, label: "Lịch sử hoạt động" },
  { key: "language", icon: <GlobalOutlined />, label: "Ngôn ngữ: Tiếng Việt" },
  { type: "divider" as const },
  { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
];

const NOTIF_ITEMS = [
  {
    key: "n1",
    label: (
      <div className="header-notif-item">
        <div className="header-notif-item__title">Vé mới #VX-2045</div>
        <div className="header-notif-item__subtitle">Hà Nội - Đà Nẵng · 2 phút trước</div>
      </div>
    ),
  },
  {
    key: "n2",
    label: (
      <div className="header-notif-item">
        <div className="header-notif-item__title">Chuyến BX-08 xuất phát</div>
        <div className="header-notif-item__subtitle">Tài xế: Nguyễn Văn A · 15 phút trước</div>
      </div>
    ),
  },
  {
    key: "n3",
    label: (
      <div className="header-notif-item">
        <div className="header-notif-item__title">Doanh thu vượt mục tiêu</div>
        <div className="header-notif-item__subtitle header-notif-item__subtitle--success">
          +12.4% so với tháng trước
        </div>
      </div>
    ),
  },
];

const HeaderBreadcrumb = ({ activeKey, role }: { activeKey: string; role: Role | null }) => {
  const crumbs = getBreadcrumbs(activeKey, role);

  return (
    <div className="header-breadcrumb">
      {crumbs.map((crumb, idx) => (
        <React.Fragment key={`${String(crumb.label)}-${idx}`}>
          {idx > 0 && <span className="header-breadcrumb__separator">›</span>}
          <span className="header-breadcrumb__item">
            {crumb.icon && <span className="header-breadcrumb__icon">{crumb.icon}</span>}
            {crumb.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

const HeaderSearch = () => {
  return (
    <div className="header-search">
      <label className="header-search__input-wrap">
        <SearchOutlined className="header-search__icon" />
        <input
          className="header-search__field"
          placeholder="Tìm kiếm vé, chuyến xe, khách hàng..."
        />
        <span className="header-search__shortcut">Ctrl K</span>
      </label>
    </div>
  );
};

const HeaderStatus = () => (
  <div className="header-status">
    <div className="header-status__dot" />
    <span className="header-status__text">Trực tuyến</span>
    <span className="header-status__value">12 xe</span>
  </div>
);

const HeaderNotification = () => (
  <Dropdown
    menu={{ items: NOTIF_ITEMS }}
    placement="bottomRight"
    trigger={["click"]}
    styles={{
      root: {
        background: "#152045",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "4px",
      },
    }}
  >
    <div className="header-notif-badge">
      <Badge count={3} size="small">
        <Tooltip title="Thông báo">
          <div className="header-action-btn">
            <BellOutlined />
            <span className="header-action-btn__dot" />
          </div>
        </Tooltip>
      </Badge>
    </div>
  </Dropdown>
);

const HeaderSettings = () => (
  <Tooltip title="Cài đặt nhanh">
    <div className="header-action-btn">
      <SettingOutlined />
    </div>
  </Tooltip>
);

const HeaderHelp = () => (
  <Tooltip title="Trợ giúp">
    <div className="header-action-btn">
      <QuestionCircleOutlined />
    </div>
  </Tooltip>
);

const HeaderUser = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      signOut();
      navigate(ROUTER_PATH.LOGIN, { replace: true });
    }
  };

  return (
    <Dropdown
      menu={{ items: USER_MENU_ITEMS, onClick: handleUserMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
      styles={{
        root: {
          background: "#152045",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          minWidth: 200,
        },
      }}
    >
      <div className="header-user">
        <div className="header-user__avatar">AD</div>
        <span className="header-user__name">Admin</span>
        <DownOutlined className="header-user__caret" />
      </div>
    </Dropdown>
  );
};

const AppHeader = ({
  sidebarCollapsed,
  activeKey,
  role,
}: {
  sidebarCollapsed: boolean;
  activeKey: string;
  role: Role | null;
}) => {
  return (
    <header className={`app-header ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
      <HeaderBreadcrumb activeKey={activeKey} role={role} />
      <HeaderSearch />
      <div className="header-actions">
        <HeaderStatus />
        <div className="header-divider" />
        <HeaderNotification />
        <HeaderSettings />
        <HeaderHelp />
        <div className="header-divider" />
        <HeaderUser />
      </div>
    </header>
  );
};

export default AppHeader;
