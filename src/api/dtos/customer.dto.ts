import type {
  CustomerRecord,
  CustomerTrip,
} from "@/pages/dashboard/share/management";

export interface CmsCustomerListQuery {
  companyId?: number;
  search?: string;
  tier?: CustomerRecord["tier"] | "all";
  status?: CustomerRecord["status"] | "all";
}

export interface CmsCustomerSummary {
  totalCustomers: number;
  vipCount: number;
  activeCount: number;
  totalSpent: number;
}

export interface CmsCustomerListResponse {
  items: CustomerRecord[];
  total: number;
  summary: CmsCustomerSummary;
}

export type CmsCustomerDetailResponse = CustomerRecord;

export type { CustomerTrip };
