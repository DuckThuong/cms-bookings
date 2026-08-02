import type { ProviderRecord } from "@/pages/dashboard/share";
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

export interface CmsCompanyListQuery {
  search?: string;
  status?: ProviderRecord["status"] | "all";
}

export interface CmsCustomerSummary {
  totalCustomers: number;
  vipCount: number;
  activeCount: number;
  totalSpent: number;
}

export interface CmsProviderSummary {
  totalProviders: number;
  activeCount: number;
  totalRoutes: number;
  totalVehicles: number;
}

export interface CmsCustomerListResponse {
  items: CustomerRecord[];
  total: number;
  summary: CmsCustomerSummary;
}

export interface CmsProviderListResponse {
  items: ProviderRecord[];
  total: number;
  summary: CmsProviderSummary;
}

export type CmsCustomerDetailResponse = CustomerRecord;

export type { CustomerTrip };
