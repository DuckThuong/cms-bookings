import axiosClient from "../axiosClient";
import type {
  CmsCompanyListQuery,
  CmsCustomerDetailResponse,
  CmsCustomerListQuery,
  CmsCustomerListResponse,
  CmsProviderListResponse,
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

export const getAllCompanies = async (
  params?: CmsCompanyListQuery,
): Promise<CmsProviderListResponse> => {
  const response = await axiosClient.get<CmsProviderListResponse>(
    CustomerEndPoints.LIST_COMPANY,
    { params },
  );
  return response.data;
};