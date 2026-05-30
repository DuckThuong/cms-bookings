export interface CmsTripItem {
  id: number;
  code: string;
  name: string;
  roadId: number;
  companyId: number;
  driverId: number;
  vehicleId: number;
  status: string;
  description?: string;
  departure: string;
  arrival: string;
  seatPrice: string;
  bookedSeats: number;
  roadName?: string;
  driverName?: string;
  vehicleLabel?: string;
  capacity?: number;
  occupancyRate?: number;
}

export interface CmsTripListResponse {
  items: CmsTripItem[];
  total: number;
}

export class CreateTripPayloadDto {
  code: string;
  name: string;
  roadId: number;
  driverId: number;
  vehicleId: number;
  status: string;
  description: string;
  departure: string;
  arrival: string;
  seatPrice: string;
  bookedSeats: number;
}

export class UpdateTripPayloadDto {
  id: number;
  code: string;
  name: string;
  roadId: number;
  driverId: number;
  vehicleId: number;
  status: string;
  description: string;
  departure: string;
  arrival: string;
  seatPrice: string;
  bookedSeats: number;
}
