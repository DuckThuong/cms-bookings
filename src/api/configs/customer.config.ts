import axiosClient from "../axiosClient";
import type {
  CmsCustomerDetailResponse,
  CmsCustomerListQuery,
  CmsCustomerListResponse,
} from "../dtos/customer.dto";
import { CustomerEndPoints } from "../endpoints/customer.endpoint";

export const getCmsCustomers = async (
  params?: CmsCustomerListQuery,
): Promise<CmsCustomerListResponse> => {
  const response = await axiosClient.get<CmsCustomerListResponse>(
    CustomerEndPoints.LIST,
    { params },
  );
  return response.data;
};

export const getCmsCustomerDetail = async (
  userCode: string,
  companyId?: number,
): Promise<CmsCustomerDetailResponse> => {
  const response = await axiosClient.get<CmsCustomerDetailResponse>(
    CustomerEndPoints.DETAIL(userCode),
    { params: companyId ? { companyId } : undefined },
  );
  return response.data;
};
