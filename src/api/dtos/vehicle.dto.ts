export interface CreateVehiclePayloadDto {
  name: string;
  code: string;
  seatType: string;
  seatCount: number;
  type: string;
  status: string;
  schedule?: string;
  description?: string;
}

export interface UpdateVehiclePayloadDto extends CreateVehiclePayloadDto {
  id: number;
}

export interface IVehicle {
  id: number;
  companyId: number;
  code: string;
  name: string;
  type: string;
  status: string;
  schedule?: string;
  description?: string;
  image?: string;
  seatType: string;
  seatCount: number;
}

export type VehicleResponseDto = IVehicle;

export interface IVehicleResponse {
  items: IVehicle[];
  total: number;
}

export interface ITrip {
  id?: number;
  code?: string;
  name?: string;
}

export interface ICompanyTrip {
  id?: number;
  code?: string;
  name?: string;
}
