import React, { createContext, useCallback, useContext, useState } from "react";
import clear from "../../src/assets/svg/icn-clear.svg";
import "../index.scss";
interface Notification {
  id: string;
  message: string;
  type: "error" | "success";
}

interface NotificationContextType {
  showNotification: (message: unknown, type: "error" | "success") => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("Something wrong!");
  }
  return context;
};

const normalizeMessage = (message: unknown) => {
  if (typeof message === "string") {
    return message;
  }

  if (message instanceof Error) {
    return message.message;
  }

  if (message && typeof message === "object") {
    const apiMessage = (message as { message?: unknown }).message;
    if (typeof apiMessage === "string") {
      return apiMessage;
    }
  }

  return "Đã xảy ra lỗi.";
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: unknown, type: "error" | "success") => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newNotification: Notification = {
        id,
        message: normalizeMessage(message),
        type,
      };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        hideNotification(id);
      }, 5000);
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${notification.type} notification`}
          >
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <img
              crossOrigin="anonymous"
              src={clear}
              onClick={() => hideNotification(notification.id)}
              alt=""
              className="notification-close"
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
