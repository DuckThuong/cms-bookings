import axiosClient from "../axiosClient";
import type {
  CreateVehicalPayloadDto,
  CreateVehicalResponseDto,
  IVerhicalResponse,
  UpdateVehicalPayloadDto,
} from "../dtos/vehical.dto";
import { VehicalEndPoints } from "../endpoints/vehical.endpoint";

export const createVehical = async (
  payload: CreateVehicalPayloadDto,
): Promise<CreateVehicalResponseDto> => {
  const response = await axiosClient.post(
    VehicalEndPoints.CREATE_VEHICAL,
    payload,
  );
  return response.data;
};

export const updateVehical = async (
  payload: UpdateVehicalPayloadDto,
): Promise<CreateVehicalResponseDto> => {
  const response = await axiosClient.patch(
    VehicalEndPoints.UPDATE_VEHICAL,
    payload,
  );
  return response.data;
};

export const getVehicals = async (): Promise<IVerhicalResponse> => {
  const response = await axiosClient.get(VehicalEndPoints.GET_VEHICALS);
  return response.data;
};

export const getVehicalById = async (
  id: string,
): Promise<IVerhicalResponse> => {
  const response = await axiosClient.get(
    VehicalEndPoints.GET_VEHICAL_BY_ID.replace(":id", id),
  );
  return response.data;
};

export const deleteVehical = async (id: string): Promise<void> => {
  await axiosClient.delete(VehicalEndPoints.DELETE_VEHICAL.replace(":id", id));
};
