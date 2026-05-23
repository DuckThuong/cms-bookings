import type { ICompanyTrip, ITrip, IVerhical } from "./vehical.dto";

export interface CreateDriverPayloadDto {
  name: string;
  code: string;
  verhicalId: number;
  license: string;
  phone: string;
  email: string;
  driverStatus: string;
  description: string;
}

export interface UpdateDriverPayloadDto {
  id: number;
  name: string;
  verhicalId: number;
  license: string;
  phone: string;
  email: string;
  driverStatus: string;
  description?: string;
}

/** CmsDriverEntityDto */
export interface ICmsDriver {
  id: number;
  code: string;
  companyId: number;
  verhicalId: number;
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
  code: string;
  verhicalId: string;
  license: string;
  phone: string;
  email: string;
  driverStatus: string;
  description?: string;
  rate: number;
  totalTurn: number;
  createdAt: string;
  updatedAt: string;
}

/** CmsDriverDetailResponseDto */
export interface IDriverItem {
  driver: ICmsDriver;
  verhical: IVerhical | null;
  trip: ITrip | null;
  companyTrip: ICompanyTrip | null;
  companyTrips?: ICompanyTrip[];
  verhicalId: string;
  tripId: string;
  companyTripId?: number;
}

/** CmsDriverListResponseDto */
export interface IDriverListResponse {
  items: IDriverItem[];
  total: number;
}
