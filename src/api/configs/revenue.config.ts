import axiosClient from "../axiosClient";
import type {
  CmsRevenuePageResponse,
  CmsRevenueQuery,
} from "../dtos/revenue.dto";
import { RevenueEndPoints } from "../endpoints/revenue.endpoint";

export const getCmsRevenuePage = async (
  params?: CmsRevenueQuery,
): Promise<CmsRevenuePageResponse> => {
  const response = await axiosClient.get<CmsRevenuePageResponse>(
    RevenueEndPoints.PAGE,
    { params },
  );
  return response.data;
};
