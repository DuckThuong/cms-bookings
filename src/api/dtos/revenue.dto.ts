export type CmsRevenueTxnStatus = "settled" | "processing" | "refunded";

export interface CmsRevenueQuery {
  companyId?: number;
  dateFrom?: string;
  dateTo?: string;
  route?: string;
  vehicle?: string;
}

export interface CmsRevenueSummaryItem {
  key: string;
  label: string;
  color: string;
  value: number | string;
}

export interface CmsRevenueTrendPoint {
  period: string;
  revenue: number;
  bookings: number;
}

export interface CmsRevenueRouteRow {
  key: string;
  route: string;
  vehicle: string;
  bookings: number;
  revenue: number;
  growth: number;
}

export interface CmsRevenueTransaction {
  key: string;
  id: string;
  route: string;
  vehicle: string;
  createdAt: string;
  bookings: number;
  revenue: number;
  status: CmsRevenueTxnStatus;
}

export interface CmsRevenueOverview {
  totalRevenue: number;
  totalBookings: number;
  refundedRevenue: number;
  averageBookingValue: number;
  revenueMomPercent: number;
  strongestRoute?: string;
  strongestRouteBookings?: number;
  strongestRouteGrowth?: number;
}

export interface CmsRevenueFilterOption {
  value: string;
  label: string;
}

export interface CmsRevenuePageResponse {
  scope: "platform" | "company";
  companyId?: number;
  summary: CmsRevenueSummaryItem[];
  overview: CmsRevenueOverview;
  trend: CmsRevenueTrendPoint[];
  byRoute: CmsRevenueRouteRow[];
  transactions: CmsRevenueTransaction[];
  routeOptions: CmsRevenueFilterOption[];
  vehicleOptions: CmsRevenueFilterOption[];
}
