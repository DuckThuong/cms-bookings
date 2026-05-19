const ROUTER = "";

export const ROUTER_NAME = {
  // auth
  LOGIN: "login",
  DASHBOARD: "dashboard",
  PAGE1: "page1",
};

export const ROUTER_PATH = {
  // auth
  LOGIN: `${ROUTER}/${ROUTER_NAME.LOGIN}`,
  DASHBOARD: `${ROUTER}/${ROUTER_NAME.DASHBOARD}`,
  PAGE1: `${ROUTER}/${ROUTER_NAME.DASHBOARD}/${ROUTER_NAME.PAGE1}`,
};
