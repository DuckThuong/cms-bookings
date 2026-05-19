import { useState, useRef, useEffect } from "react";
import { Avatar, Button, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { Logo } from "@/components/Logo";
import chevronDownIcn from "@/assets/icons/chevron-down.svg";
import { ROUTER_PATH } from "@/routers/Route";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/common/contexts/UserContext";
import { MENU_ITEMS } from "@/pages/profile/components/ProfileSideBar";
import "./style.scss";
// ─── Types ──────────────────────────────────────────────────────────────────

type NotifType = "ticket" | "promo" | "system" | "cancel";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  sub: string;
  time: string;
  read: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Trang chủ", href: ROUTER_PATH.HOME },
  { label: "Đặt vé", href: ROUTER_PATH.TRIP },
  { label: "Khuyến mãi", href: ROUTER_PATH.PROMOS },
  { label: "Hỗ trợ", href: ROUTER_PATH.SUPPORT },
];

const NOTIF_ICON: Record<NotifType, string> = {
  ticket: "🎫",
  promo: "🏷️",
  system: "✅",
  cancel: "❌",
};

const INITIAL_NOTIFS: Notification[] = [
  {
    id: "1",
    type: "ticket",
    title: "Vé xác nhận – HN → ĐN",
    sub: "Chuyến 14:30 ngày 18/05 đã được xác nhận",
    time: "2 ph",
    read: false,
  },
  {
    id: "2",
    type: "promo",
    title: "Giảm 30% cho chuyến cuối tuần",
    sub: "Dùng mã WEEKEND30 trước 23:59 hôm nay",
    time: "1 giờ",
    read: false,
  },
  {
    id: "3",
    type: "system",
    title: "Thanh toán thành công",
    sub: "Đơn #BG-20480 · 320.000 VNĐ",
    time: "3 giờ",
    read: false,
  },
  {
    id: "4",
    type: "cancel",
    title: "Chuyến bị huỷ – Hoàn tiền",
    sub: "180.000 VNĐ sẽ về ví trong 3–5 ngày",
    time: "Hôm qua",
    read: true,
  },
];

// ─── NotificationPanel ───────────────────────────────────────────────────────

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const unreadCount = notifs.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const handleViewAll = () => {
    navigate(ROUTER_PATH.NOTIFICATION);
  };

  return (
    <div className="notif-wrap" ref={panelRef}>
      {/* Bell button */}
      <button
        className={`notif-bell-btn${open ? " active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Thông báo"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-bell-badge">{unreadCount}</span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="notif-panel">
          <div className="notif-panel__header">
            <span className="notif-panel__title">Thông báo</span>
            {unreadCount > 0 && (
              <button className="notif-panel__mark-all" onClick={markAllRead}>
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="notif-panel__list">
            {notifs.map((n) => (
              <div
                key={n.id}
                className={`notif-item${n.read ? "" : " notif-item--unread"}`}
                onClick={() => markRead(n.id)}
              >
                {!n.read && <span className="notif-item__dot" />}
                <div className={`notif-item__icon notif-item__icon--${n.type}`}>
                  {NOTIF_ICON[n.type]}
                </div>
                <div className="notif-item__content">
                  <p className="notif-item__title">{n.title}</p>
                  <p className="notif-item__sub">{n.sub}</p>
                </div>
                <span className="notif-item__time">{n.time}</span>
              </div>
            ))}
          </div>

          <div className="notif-panel__footer">
            <button className="notif-panel__view-all" onClick={handleViewAll}>
              Xem tất cả thông báo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── HomeHeader ───────────────────────────────────────────────────────────────

export const HomeHeader = () => {
  const { pathname } = useLocation();
  const { user } = useUser();
  const { userName } = user;
  const navigate = useNavigate();

  const isNavItemActive = (href: string) => {
    const normalize = (path: string) =>
      path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
    const currentPath = normalize(pathname);
    const navPath = normalize(href);
    if (navPath === ROUTER_PATH.HOME) return currentPath === navPath;
    if (navPath === ROUTER_PATH.TRIP)
      return (
        currentPath === navPath ||
        currentPath.startsWith(`${navPath}/`) ||
        currentPath === ROUTER_PATH.BOOKING ||
        currentPath.startsWith(`${ROUTER_PATH.BOOKING}/`)
      );
    return currentPath === navPath || currentPath.startsWith(`${navPath}/`);
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const tabMap: Record<string, string> = {
      account: "account",
      overview: "overview",
      trips: "trips",
      payment: "payment",
      settings: "settings",
    };
    navigate(ROUTER_PATH.PROFILE, {
      state: { tab: tabMap[key] ?? "overview" },
    });
  };

  return (
    <header className="home-header">
      <div className="home-header__inner">
        {/* Logo */}
        <div className="home-header__logo">
          <Logo />
        </div>

        {/* Nav */}
        <nav className="home-header__nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`home-header__nav-link${isNavItemActive(item.href) ? " active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="home-header__actions">
          {/* Notification bell + panel */}
          <NotificationPanel />

          {/* Avatar dropdown */}
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            dropdownRender={() => (
              <Menu
                className="home-header__user-menu"
                items={MENU_ITEMS}
                onClick={handleMenuClick}
              />
            )}
          >
            <button className="home-header__avatar-btn">
              {/* Avatar with ring + online dot */}
              <div className="home-header__avatar-ring">
                <Avatar size={34} className="home-header__avatar">
                  {userName?.charAt(0).toUpperCase() || "K"}
                </Avatar>
                <span className="home-header__avatar-online" />
              </div>

              {/* Name + role */}
              <div className="home-header__user-info">
                <span className="home-header__username">
                  {userName || "Khách"}
                </span>
                <span className="home-header__user-role">Tài khoản thường</span>
              </div>

              {/* Chevron */}
              <img
                src={chevronDownIcn}
                alt=""
                width={12}
                height={12}
                className="home-header__chevron"
              />
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
