import type {
  CreateDriverPayloadDto,
  DriverResponseDto,
  UpdateDriverPayloadDto,
} from "../dtos/driver.dto";
import axiosClient from "../axiosClient";
import { DriverEndPoints } from "../endpoints/driver.endpoint";

export const createDriver = async (
  payload: CreateDriverPayloadDto,
): Promise<DriverResponseDto> => {
  const response = await axiosClient.post(
    DriverEndPoints.CREATE_DRIVER,
    payload,
  );
  return response.data;
};

export const getDrivers = async (): Promise<DriverResponseDto[]> => {
  const response = await axiosClient.get(DriverEndPoints.GET_DRIVERS);
  return response.data;
};

export const getDriverById = async (id: string): Promise<DriverResponseDto> => {
  const response = await axiosClient.get(
    DriverEndPoints.GET_DRIVER_BY_ID.replace(":id", id),
  );
  return response.data;
};

export const updateDriver = async (
  id: string,
  payload: UpdateDriverPayloadDto,
): Promise<DriverResponseDto> => {
  const response = await axiosClient.put(
    DriverEndPoints.UPDATE_DRIVER.replace(":id", id),
    payload,
  );
  return response.data;
};

export const deleteDriver = async (id: string): Promise<void> => {
  await axiosClient.delete(DriverEndPoints.DELETE_DRIVER.replace(":id", id));
};
