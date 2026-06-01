import axiosClient from "../axiosClient";
import type {
  CmsReportListQuery,
  CmsReportListResponse,
} from "../dtos/report.dto";
import { ReportEndPoints } from "../endpoints/report.endpoint";

export const getCmsReports = async (
  params?: CmsReportListQuery,
): Promise<CmsReportListResponse> => {
  const response = await axiosClient.get<CmsReportListResponse>(
    ReportEndPoints.LIST,
    { params },
  );
  return response.data;
};
