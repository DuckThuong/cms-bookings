import type { CmsTripItem } from "@/api/dtos/trip.dto";
import type {
  TripRecord,
  TripStatusKey,
} from "@/pages/dashboard/share/operations";

const displayText = (value?: string | null, fallback = "—") => {
  if (!value?.trim()) return fallback;
  return value.trim();
};

const mapTripStatus = (status: string): TripStatusKey => {
  const normalized = status?.toUpperCase();
  if (normalized === "ACTIVE") return "scheduled";
  if (normalized === "INACTIVE") return "completed";
  if (
    status === "scheduled" ||
    status === "boarding" ||
    status === "running" ||
    status === "completed" ||
    status === "delayed"
  ) {
    return status;
  }
  return "scheduled";
};

export const mapCmsTripToRecord = (trip: CmsTripItem): TripRecord => {
  const capacity = trip.capacity ?? 0;
  const bookedSeats = trip.bookedSeats ?? 0;
  const occupancyRate =
    trip.occupancyRate ??
    (capacity > 0 ? Math.round((bookedSeats / capacity) * 100) : 0);

  const route = trip.roadName || trip.name || "—";

  const departure = displayText(trip.departure);
  const arrival = displayText(trip.arrival);

  return {
    key: String(trip.id),
    id: trip.code || String(trip.id),
    route,
    vehicle: displayText(trip.vehicleLabel),
    driver: displayText(trip.driverName),
    departure,
    arrival,
    bookedSeats,
    capacity,
    occupancyRate,
    status: mapTripStatus(trip.status),
    note: trip.description?.trim() ?? "",
  };
};

export const mapCmsTripsToRecords = (trips: CmsTripItem[]): TripRecord[] =>
  trips.map(mapCmsTripToRecord);
