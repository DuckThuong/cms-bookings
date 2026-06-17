import axiosClient from "../axiosClient";
import type {
  CompanyRegistrationResponseDto,
  UpdateCompanyRegistrationStatusDto,
} from "../dtos/company-registration.dto";

export const COMPANY_REGISTRATION_API_PATH = {
  LIST: "/company-registrations",
  DETAIL: (id: number) => `/company-registrations/${id}`,
  UPDATE_STATUS: (id: number) => `/company-registrations/${id}/status`,
};

export const fetchCompanyRegistrations = async (
  status?: string,
): Promise<CompanyRegistrationResponseDto[]> => {
  const params = status ? { status } : {};
  const response = await axiosClient.get(COMPANY_REGISTRATION_API_PATH.LIST, {
    params,
  });
  return response.data;
};

export const fetchCompanyRegistrationDetail = async (
  id: number,
): Promise<CompanyRegistrationResponseDto> => {
  const response = await axiosClient.get(
    COMPANY_REGISTRATION_API_PATH.DETAIL(id),
  );
  return response.data;
};

export const updateCompanyRegistrationStatus = async (
  id: number,
  payload: UpdateCompanyRegistrationStatusDto,
): Promise<CompanyRegistrationResponseDto> => {
  const response = await axiosClient.put(
    COMPANY_REGISTRATION_API_PATH.UPDATE_STATUS(id),
    payload,
  );
  return response.data;
};
