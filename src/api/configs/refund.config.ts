import axiosClient from "../axiosClient";
import type { RefundRecord } from "@/pages/dashboard/share/bookingManagement";

export interface RefundListResponse {
  items: RefundRecord[];
  total: number;
}

export const getRefundRequests = async (): Promise<RefundListResponse> => {
  const response = await axiosClient.get<RefundListResponse>('/refunds');
  return response.data;
};

export const getRefundDetail = async (refundId: number): Promise<RefundRecord> => {
  const response = await axiosClient.get<RefundRecord>(`/refunds/${refundId}`);
  return response.data;
};

export const processRefund = async (
  refundId: number,
  action: 'approve' | 'reject',
  notes?: string,
) => {
  const response = await axiosClient.patch(`/refunds/${refundId}/process`, {
    action,
    notes,
  });
  return response.data;
};
