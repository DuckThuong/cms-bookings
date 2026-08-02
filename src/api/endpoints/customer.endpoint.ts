export const CustomerEndPoints = {
  LIST: "cms/customer",
  LIST_COMPANY: "companies/cms",
  DETAIL: (userCode: string) => `cms/customer/${userCode}`,
};
