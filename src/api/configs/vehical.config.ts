import axiosClient from "../axiosClient";
import type { CreateVehicalPayloadDto } from "../dtos/vehical.dto";
import { VehicalEndPoints } from "../endpoints/vehical.endpoint";

export const createVehical = async (
  payload: CreateVehicalPayloadDto,
): Promise<any> => {
  const response = await axiosClient.post(
    VehicalEndPoints.CREATE_VEHICAL,
    payload,
  );
  return response.data;
};
