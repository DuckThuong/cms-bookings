import type { AxiosInstance } from "axios";
import type { UploadResponseDto } from "../../dtos/upload.dto";

const MOCK_MODE = true;

const mockUpload = (): Promise<UploadResponseDto> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        imageUrl:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
      });
    }, 350);
  });

export const uploadImage = async (
  formData: FormData,
  client?: AxiosInstance,
): Promise<UploadResponseDto> => {
  if (MOCK_MODE) {
    return mockUpload();
  }
  if (!client) {
    throw new Error("Axios client is required for non-mock upload");
  }
  const response = await client.post<UploadResponseDto>("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
