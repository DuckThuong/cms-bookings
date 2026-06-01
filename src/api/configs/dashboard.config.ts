import axiosClient from "../axiosClient";
import type {
  CmsDashboardOverview,
  CmsDashboardQuery,
} from "../dtos/dashboard.dto";
import { DashboardEndPoints } from "../endpoints/dashboard.endpoint";

export const getCmsDashboardOverview = async (
  params?: CmsDashboardQuery,
): Promise<CmsDashboardOverview> => {
  const response = await axiosClient.get<CmsDashboardOverview>(
    DashboardEndPoints.OVERVIEW,
    { params },
  );
  return response.data;
};
