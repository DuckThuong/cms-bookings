import axiosClient from "../axiosClient";
import type { CreateVerhicalPayloadDto } from "../dtos/verhical.dto";
import { VerhicalEndPoints } from "../endpoints/verhical.endpoint";

export const createVerhical = async (
  payload: CreateVerhicalPayloadDto,
): Promise<any> => {
  const response = await axiosClient.post(
    VerhicalEndPoints.CREATE_VERHICAL,
    payload,
  );
  return response.data;
};
