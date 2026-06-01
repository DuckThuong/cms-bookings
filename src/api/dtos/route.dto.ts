export interface CreateRoadPayloadDto {
  name: string;
  length: number;
  pickUpPoint: string;
  dropOffPoint: string;
  status: string;
  totalTurn?: number;
  standardDuration?: string;
  tripsPerDay?: number;
  averageOccupancy?: number;
  estimatedRevenue?: number;
  leadVehicle?: string | null;
  demandLevel?: string | null;
  note?: string | null;
}

export interface UpdateRoadPayloadDto extends CreateRoadPayloadDto {
  id: number;
}

export interface RoadListQueryDto {
  companyId: number;
}

export type DeleteRoadResponse = {
  message: string;
};

export interface IRoad {
  id: number;
  companyId: number;
  code: string;
  name: string;
  length: number;
  status: string;
  startPoint: string;
  endPoint: string;
  pickUpPoint: string;
  dropOffPoint: string;
  totalTurn: number;
  standardDuration: string;
  tripsPerDay: number;
  averageOccupancy: number;
  estimatedRevenue: number;
  leadVehicle: string | null;
  demandLevel: string | null;
  note: string | null;
}
