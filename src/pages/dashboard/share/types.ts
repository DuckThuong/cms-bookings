export type SummaryItem = {
  key: string;
  label: string;
  color: string;
  value: number | string;
};

export type StatusMeta = {
  label: string;
  color: string;
  bg: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type ManagementModalMode = 'create' | 'edit';

export type AddTripFormValues = {
  id: string;
  route: string;
  vehicle: string;
  driver: string;
  departure: string;
  arrival: string;
  capacity: number;
  bookedSeats: number;
  status: string;
  note?: string;
};

export type AddRouteFormValues = {
  id: string;
  route: string;
  distanceKm: number;
  standardDuration: string;
  tripsPerDay: number;
  averageOccupancy: number;
  estimatedRevenue: number;
  status: string;
  leadVehicle: string;
  demandLevel: string;
  note?: string;
};

export type AddVehicleFormValues = {
  plateNumber: string;
  type: string;
  seats: number;
  assignedRoute: string;
  primaryDriver: string;
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
  utilizationRate: number;
  note?: string;
};

export type AddDriverFormValues = {
  id: string;
  name: string;
  phone: string;
  license: string;
  assignedVehicle: string;
  mainRoute: string;
  shift: string;
  tripCount: number;
  status: string;
  note?: string;
};
