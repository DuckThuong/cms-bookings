const ROUTER = "";

export const ROUTER_NAME = {
  // auth
  LOGIN: "login",
  DASHBOARD: "dashboard",
  BOOKINGS: "bookings",
};

export const ROUTER_PATH = {
  // auth
  LOGIN: `${ROUTER}/${ROUTER_NAME.LOGIN}`,
  DASHBOARD: `${ROUTER}/${ROUTER_NAME.DASHBOARD}`,
  BOOKINGS: `${ROUTER}/${ROUTER_NAME.BOOKINGS}`,
};
