export enum RegistrationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface CreateCompanyRegistrationDto {
  companyName: string;
  address?: string;
  representativePhone?: string;
  representativeName?: string;
  representativePosition?: string;
  taxCode?: string;
  businessAddress?: string;
  businessLicenseDate?: string;
  businessLicenseUrl?: string;
  idCardUrl?: string;
  description?: string;
}

export interface UpdateCompanyRegistrationStatusDto {
  status: RegistrationStatus;
  rejectionReason?: string;
}

export interface CompanyRegistrationResponseDto {
  id: number;
  userId: number;
  userCode: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  companyName: string;
  address?: string;
  representativePhone?: string;
  representativeName?: string;
  representativePosition?: string;
  taxCode?: string;
  businessAddress?: string;
  businessLicenseDate?: string;
  businessLicenseUrl?: string;
  idCardUrl?: string;
  description?: string;
  status: RegistrationStatus;
  rejectionReason?: string;
  processedByAdminId?: number;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}
