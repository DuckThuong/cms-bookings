import axiosClient from "../axiosClient";
import type { UploadResponseDto } from "../dtos/upload.dto";

export const uploadImage = async (
  formData: FormData,
): Promise<UploadResponseDto> => {
  const response = await axiosClient.post<UploadResponseDto>(
    "/upload/image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
