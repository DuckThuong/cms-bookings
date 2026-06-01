export const ROAD_ENDPOINTS = {
  create: {
    method: "POST",
    path: "cms/road",
  },
  list: {
    method: "GET",
    path: "cms/road",
    query: "companyId",
  },
  detail: {
    method: "GET",
    path: "cms/road/:id",
  },
  update: {
    method: "PATCH",
    path: "cms/road/:id",
  },
  delete: {
    method: "DELETE",
    path: "cms/road/:id",
  },
} as const;
