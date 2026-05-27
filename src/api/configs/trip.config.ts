import axiosClient from "../axiosClient";
import type {
  CreateTripPayloadDto,
  UpdateTripPayloadDto,
} from "../dtos/trip.dto";
import { TripEndpoint } from "../endpoints/trip.endpoint";

const withId = (path: string, id: number | string) =>
  path.replace(":id", String(id));

const normalizeRoadList = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }

  return data.items ?? [];
};

export const createTrip = async (
  payload: CreateTripPayloadDto,
): Promise<any> => {
  const response = await axiosClient.post(TripEndpoint.CREATE_TRIP, payload);
  return response.data;
};

export const updateTrip = async (
  payload: UpdateTripPayloadDto,
): Promise<any> => {
  const { id, ...body } = payload;
  const response = await axiosClient.patch(
    withId(TripEndpoint.UPDATE_TRIP, id),
    body,
  );
  return response.data;
};

export const deleteTrip = async (id: number | string): Promise<void> => {
  await axiosClient.delete(withId(TripEndpoint.DELETE_TRIP, id));
};

export const getTripById = async (id: number | string): Promise<any> => {
  const response = await axiosClient.get(withId(TripEndpoint.GET_TRIP, id));
  return normalizeRoadList(response.data);
};

export const getAllTrips = async (): Promise<any[]> => {
  const response = await axiosClient.get<{ items: any[] }>(
    TripEndpoint.GET_ALL_TRIPS,
  );
  const data = response.data;
  return normalizeRoadList(data);
};
