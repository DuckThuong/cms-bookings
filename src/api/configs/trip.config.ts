import axiosClient from "../axiosClient";
import type {
  CmsTripItem,
  CmsTripListResponse,
  CreateTripPayloadDto,
  UpdateTripPayloadDto,
} from "../dtos/trip.dto";
import { TripEndpoint } from "../endpoints/trip.endpoint";

const withId = (path: string, id: number | string) =>
  path.replace(/\{id\}|:id/g, String(id));

export const createTrip = async (
  payload: CreateTripPayloadDto,
): Promise<CmsTripItem> => {
  const response = await axiosClient.post<CmsTripItem>(
    TripEndpoint.CREATE_TRIP,
    payload,
  );
  return response.data;
};

export const updateTrip = async (
  payload: UpdateTripPayloadDto,
): Promise<CmsTripItem> => {
  const response = await axiosClient.patch<CmsTripItem>(
    TripEndpoint.UPDATE_TRIP,
    payload,
  );
  return response.data;
};

export const deleteTrip = async (id: number | string): Promise<void> => {
  await axiosClient.delete(withId(TripEndpoint.DELETE_TRIP, id));
};

export const getTripById = async (id: number | string): Promise<CmsTripItem> => {
  const response = await axiosClient.get<CmsTripItem>(
    withId(TripEndpoint.GET_TRIP, id),
  );
  return response.data;
};

export const getAllTrips = async (): Promise<CmsTripItem[]> => {
  const response = await axiosClient.get<CmsTripListResponse>(
    TripEndpoint.GET_ALL_TRIPS,
  );
  return response.data.items ?? [];
};
