import { Button } from "antd";
import { createContext, useContext, useState, type ReactNode } from "react";

export type UserInfo = {
  userName: string;
  notifCount: number;
  phone?: string;
  email?: string;
  address?: string;
  birthday?: string;
  avatarUrl?: string;
};

interface UserContextType {
  user: UserInfo;
  setUser: (user: UserInfo) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: UserInfo;
}) => {
  const [user, setUser] = useState<UserInfo>(
    initialUser || {
      userName: "Khách",
      notifCount: 0,
    },
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const fieldStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#f1f5f9",
};

export const formLabel = (text: string) => (
  <span style={{ color: "#94a3b8", fontSize: 12 }}>{text}</span>
);

type ModalFooterProps = {
  cancelText: string;
  submitText: string;
  onCancel: () => void;
  onSubmit: () => void;
};

export const renderModalFooter = ({
  cancelText,
  submitText,
  onCancel,
  onSubmit,
}: ModalFooterProps) => (
  <div
    style={{
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      flexWrap: "wrap",
    }}
  >
    <Button className="btn-ghost" onClick={onCancel}>
      {cancelText}
    </Button>
    <Button className="btn-primary" onClick={onSubmit}>
      {submitText}
    </Button>
  </div>
);
