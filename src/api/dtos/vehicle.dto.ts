export interface CreateVehiclePayloadDto {
  vehicleName: string;
  vehicleCode: string;
  seatType: string;
  seatCount: number;
  vehicleType: string;
  vehicleStatus: string;
  schedule: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  pricePerSeat: number;
}
export interface UpdateVehiclePayloadDto {
  id: number;
  vehicleName: string;
  vehicleCode: string;
  seatType: string;
  seatCount: number;
  vehicleType: string;
  vehicleStatus: string;
  tripId: string;
  driverId: string;
  schedule: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  pricePerSeat: number;
  companyTripId: number;
}

export interface CreateVehicleResponseDto {
  id: string;
  name: string;
  code: string;
  seatType: string;
  seatCount: number;
  vehicleType: string;
  vehicleStatus: string;
  tripId: string;
  driverId: string;
  pricePerSeat: number;
  schedule: string;
  description: string;
  timeStart: string;
  timeEnd: string;
}

export interface IVehicleResponse {
  items: IVehicleItem[];
  total: number;
}

export interface IVehicleItem {
  vehicle: IVehicle;
  seats: ISeat[];
  trip: ITrip | null;
  driver: IDriver | null;
  companyTrip: ICompanyTrip | null;
  companyTrips: ICompanyTrip[];
  seatType: string;
  seatCount: number;
  tripId: string;
  driverId: string;
  timeStart: string;
  timeEnd: string;
}

export interface IVehicle {
  id: number;
  companyId: number;
  code: string;
  name: string;
  type: string;
  status: string;
  schedule: string;
  description: string;
}

export interface ISeat {
  id: number;
  vehicleId: number;
  code: string;
  name: string;
  index: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITrip {
  id?: number;
  code?: string;
  name?: string;
}

export interface IDriver {
  id?: number;
  code?: string;
  name?: string;
}

export interface ICompanyTrip {
  id?: number;
  code?: string;
  name?: string;
}
