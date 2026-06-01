export type CmsReportType =
  | "operations"
  | "finance"
  | "customer"
  | "compliance";

export type CmsReportStatus = "ready" | "processing" | "scheduled";

export interface CmsReportListQuery {
  companyId?: number;
  search?: string;
  type?: string;
  status?: string;
}

export interface CmsReportSummaryItem {
  key: string;
  label: string;
  color: string;
  value: number | string;
}

export interface CmsReportItem {
  key: string;
  id: string;
  name: string;
  type: CmsReportType;
  period: string;
  createdBy: string;
  createdAt: string;
  status: CmsReportStatus;
  fileSize: string;
  description: string;
}

export interface CmsReportListResponse {
  scope: "platform" | "company";
  companyId?: number;
  summary: CmsReportSummaryItem[];
  items: CmsReportItem[];
  total: number;
}
