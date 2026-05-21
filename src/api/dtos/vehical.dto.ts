export interface CreateVehicalPayloadDto {
  vehicalName: string;
  vehicalCode: string;
  seatType: string;
  seatCount: number;
  vehicalType: string;
  vehicalStatus: string;
  schedule: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  pricePerSeat: number;
}
export interface UpdateVehicalPayloadDto {
  id: number;
  vehicalName: string;
  vehicalCode: string;
  seatType: string;
  seatCount: number;
  vehicalType: string;
  vehicalStatus: string;
  tripId: string;
  driverId: string;
  schedule: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  pricePerSeat: number;
  companyTripId: number;
}

export interface CreateVehicalResponseDto {
  id: string;
  name: string;
  code: string;
  seatType: string;
  seatCount: number;
  vehicalType: string;
  vehicalStatus: string;
  tripId: string;
  driverId: string;
  pricePerSeat: number;
  schedule: string;
  description: string;
  timeStart: string;
  timeEnd: string;
}

export interface IVerhicalResponse {
  items: IVerhicalItem[];
  total: number;
}

export interface IVerhicalItem {
  verhical: IVerhical;
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

export interface IVerhical {
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
  verhicalId: number;
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
