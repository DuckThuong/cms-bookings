import type { ICompanyTrip, ITrip, IVehicle } from "./vehicle.dto";

export interface CreateDriverPayloadDto {
  name: string;
  code: string;
  vehicleId: number;
  license: string;
  phone: string;
  email: string;
  driverStatus: string;
  description: string;
}

export interface UpdateDriverPayloadDto {
  id: number;
  name: string;
  vehicleId: number;
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
  vehicleId: number;
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
  vehicleId: string;
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
  vehicle: IVehicle | null;
  trip: ITrip | null;
  companyTrip: ICompanyTrip | null;
  companyTrips?: ICompanyTrip[];
  vehicleId: string;
  tripId: string;
  companyTripId?: number;
}

/** CmsDriverListResponseDto */
export interface IDriverListResponse {
  items: IDriverItem[];
  total: number;
}
