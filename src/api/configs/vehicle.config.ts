import axiosClient from "../axiosClient";
import type {
  CreateVehiclePayloadDto,
  CreateVehicleResponseDto,
  IVehicleResponse,
  UpdateVehiclePayloadDto,
} from "../dtos/vehicle.dto";
import { VehicleEndPoints } from "../endpoints/vehicle.endpoint";

export const createVehicle = async (
  payload: CreateVehiclePayloadDto,
): Promise<CreateVehicleResponseDto> => {
  const response = await axiosClient.post(
    VehicleEndPoints.CREATE_VEHICLE,
    payload,
  );
  return response.data;
};

export const updateVehicle = async (
  payload: UpdateVehiclePayloadDto,
): Promise<CreateVehicleResponseDto> => {
  const response = await axiosClient.patch(
    VehicleEndPoints.UPDATE_VEHICLE,
    payload,
  );
  return response.data;
};

export const getVehicles = async (): Promise<IVehicleResponse> => {
  const response = await axiosClient.get(VehicleEndPoints.GET_VEHICLES);
  return response.data;
};

export const getVehicleById = async (id: string): Promise<IVehicleResponse> => {
  const response = await axiosClient.get(
    VehicleEndPoints.GET_VEHICLE_BY_ID.replace(":id", id),
  );
  return response.data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await axiosClient.delete(VehicleEndPoints.DELETE_VEHICLE.replace(":id", id));
};
