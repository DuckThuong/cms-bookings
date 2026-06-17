import { io, type Socket } from "socket.io-client";
import { getStoredToken } from "../common/utils/authStorage";

const resolveSocketUrl = () => {
  const explicitUrl = process.env.REACT_APP_SOCKET_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  const apiUrl = process.env.REACT_APP_API_URL ?? "http://localhost:8000/";
  return apiUrl.replace(/\/$/, "");
};

let socketInstance: Socket | null = null;

export const getSocketClient = () => {
  if (socketInstance) {
    return socketInstance;
  }

  const token = getStoredToken();

  socketInstance = io(resolveSocketUrl() + "/chat", {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: {
      token: token ? `Bearer ${token}` : undefined,
    },
  });

  socketInstance.on("reconnect_attempt", () => {
    const reconnectToken = getStoredToken();
    socketInstance?.auth &&
      (socketInstance.auth = {
        ...socketInstance.auth,
        token: reconnectToken ? `Bearer ${reconnectToken}` : undefined,
      });
  });

  return socketInstance;
};
