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
