import axiosClient from "../axiosClient";
import type { AuthResponseDto, LoginPayloadDto, SignUpPayloadDto } from "../dtos/auth.dto";
import { AuthEndPoints } from "../endpoints/auth.endpoint";

export const signUp = async (
    payload: SignUpPayloadDto,
  ): Promise<AuthResponseDto> => {
    const response = await axiosClient.post(AuthEndPoints.SIGN_UP, payload);
    return response.data;
  };

  export const signIn = async (
    payload: LoginPayloadDto,
  ): Promise<AuthResponseDto> => {
    const response = await axiosClient.post(AuthEndPoints.SIGN_IN, payload);
    return response.data;
  };