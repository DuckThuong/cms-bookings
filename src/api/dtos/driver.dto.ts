import type { ICompanyTrip, ITrip, IVehicle } from "./vehicle.dto";

export interface CreateDriverPayloadDto {
  name: string;
  license: string;
  licenseNum: string;
  phone: string;
  email: string;
  status: string;
  description?: string;
}

export interface UpdateDriverPayloadDto {
  id: number;
  name: string;
  license: string;
  licenseNum: string;
  phone: string;
  email: string;
  status: string;
  description?: string;
}

/** CmsDriverEntityDto */
export interface ICmsDriver {
  id: number;
  code?: string;
  licenseNum: string;
  companyId: number;
  name: string;
  license: string;
  phone: string;
  email: string;
  status: string;
  description?: string;
  rate: number;
  totalTurn: number;
  createdAt?: string;
  updatedAt?: string;
}

/** DriverResponseDto (create / update response) */
export interface DriverResponseDto {
  id: string;
  name: string;
  code?: string;
  license: string;
  licenseNum: string;
  phone: string;
  email: string;
  status: string;
  description?: string;
  rate: number;
  totalTurn: number;
  createdAt: string;
  updatedAt: string;
}

/** CmsDriverDetailResponseDto */
export interface IDriverItem {
  driver: ICmsDriver;
  vehicle: IVehicle | null;
  trip: ITrip | null;
  companyTrip: ICompanyTrip | null;
  companyTrips?: ICompanyTrip[];
  tripId: string;
  companyTripId?: number;
}

/** CmsDriverListResponseDto */
export interface IDriverListResponse {
  items: DriverResponseDto[];
  total: number;
}
