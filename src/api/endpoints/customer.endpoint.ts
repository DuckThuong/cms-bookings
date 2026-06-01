export const CustomerEndPoints = {
  LIST: "cms/customer",
  DETAIL: (userCode: string) => `cms/customer/${userCode}`,
};
