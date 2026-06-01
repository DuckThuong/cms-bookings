export type DashboardPeriod = "7N" | "1T" | "3T" | "1N";

export type DashboardBookingUiStatus =
  | "completed"
  | "moving"
  | "pending"
  | "cancelled";

export interface CmsDashboardQuery {
  period?: DashboardPeriod;
  companyId?: number;
}

export interface CmsDashboardStatCard {
  key: string;
  label: string;
  value: string;
  icon: string;
  iconClass: string;
  trend: string;
  trendDir: "up" | "down";
  trendNote: string;
}

export interface CmsDashboardRevenuePoint {
  month: string;
  revenue: number;
  bookings: number;
}

export interface CmsDashboardStatusSlice {
  name: string;
  value: number;
  color: string;
  status: DashboardBookingUiStatus;
}

export interface CmsDashboardWeeklyPoint {
  day: string;
  completed: number;
  cancelled: number;
}

export interface CmsDashboardVehicleType {
  type: string;
  count: number;
  color: string;
}

export interface CmsDashboardTopProvider {
  rank: number;
  name: string;
  trips: number;
  revenue: string;
  pct: number;
}

export interface CmsDashboardActivity {
  id: number;
  name: string;
  initials: string;
  desc: string;
  time: string;
  dot: string;
}

export interface CmsDashboardRecentBooking {
  key: string;
  id: string;
  customer: string;
  route: string;
  provider: string;
  date: string;
  seats: number;
  amount: string;
  status: DashboardBookingUiStatus;
}

export interface CmsDashboardOverview {
  scope: "platform" | "company";
  companyId?: number;
  period: string;
  statCards: CmsDashboardStatCard[];
  revenueSeries: CmsDashboardRevenuePoint[];
  revenueMomPercent: number;
  bookingStatusDistribution: CmsDashboardStatusSlice[];
  weeklyBookings: CmsDashboardWeeklyPoint[];
  vehicleTypes: CmsDashboardVehicleType[];
  topProviders: CmsDashboardTopProvider[];
  recentActivities: CmsDashboardActivity[];
  recentBookings: CmsDashboardRecentBooking[];
}
