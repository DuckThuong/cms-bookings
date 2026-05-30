import type { BookingRecord, BookingStatusKey, VehicleRecord } from "@/pages/dashboard/share/bookingManagement";

export interface CmsBookingListQuery {
  companyId?: number;
  status?: BookingStatusKey | "all";
  vehicleId?: string;
  search?: string;
}

export interface CmsBookingListResponse {
  items: BookingRecord[];
  total: number;
  vehicles: VehicleRecord[];
}

export interface CmsConfirmBookingPayload {
  transactionRef?: string;
  commissionRate?: number;
}

export interface CmsRejectBookingPayload {
  reason?: string;
}
