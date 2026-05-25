import type {
  CreateDriverPayloadDto,
  DriverResponseDto,
  ICmsDriver,
  IDriverListResponse,
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
  const response = await axiosClient.get<IDriverListResponse>(
    DriverEndPoints.GET_DRIVERS,
  );
  return response.data.items;
};

export const getDriverById = async (id: string): Promise<DriverResponseDto> => {
  const response = await axiosClient.get(
    DriverEndPoints.GET_DRIVER_BY_ID.replace(":id", id),
  );
  return response.data;
};

export const updateDriver = async (
  payload: UpdateDriverPayloadDto,
): Promise<DriverResponseDto> => {
  const response = await axiosClient.patch(
    DriverEndPoints.UPDATE_DRIVER,
    payload,
  );
  return response.data;
};

export const deleteDriver = async (id: string): Promise<void> => {
  await axiosClient.delete(DriverEndPoints.DELETE_DRIVER.replace(":id", id));
};
