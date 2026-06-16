import { Outlet } from "react-router-dom";
import "./style.scss";

export const ChatLayout = () => {
  return (
    <div className="chat-layout">
      <Outlet />
    </div>
  );
};
