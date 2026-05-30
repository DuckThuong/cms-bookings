import axiosClient from "../axiosClient";
import type {
  CmsBookingListQuery,
  CmsBookingListResponse,
  CmsConfirmBookingPayload,
  CmsRejectBookingPayload,
} from "../dtos/booking.dto";
import type { BookingRecord } from "@/pages/dashboard/share/bookingManagement";
import { BookingEndPoints } from "../endpoints/booking.endpoint";

export const getCmsBookings = async (
  params?: CmsBookingListQuery,
): Promise<CmsBookingListResponse> => {
  const response = await axiosClient.get<CmsBookingListResponse>(
    BookingEndPoints.LIST,
    { params },
  );
  return response.data;
};

export const getCmsBookingDetail = async (
  paymentId: number,
): Promise<BookingRecord> => {
  const response = await axiosClient.get<BookingRecord>(
    BookingEndPoints.DETAIL(paymentId),
  );
  return response.data;
};

export const confirmCmsBooking = async (
  paymentId: number,
  payload?: CmsConfirmBookingPayload,
) => {
  const response = await axiosClient.patch(
    BookingEndPoints.CONFIRM(paymentId),
    payload,
  );
  return response.data;
};

export const rejectCmsBooking = async (
  paymentId: number,
  payload?: CmsRejectBookingPayload,
) => {
  const response = await axiosClient.patch(
    BookingEndPoints.REJECT(paymentId),
    payload ?? {},
  );
  return response.data;
};
