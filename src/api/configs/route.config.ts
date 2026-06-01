import axiosClient from "../axiosClient";
import type {
  CreateRoadPayloadDto,
  DeleteRoadResponse,
  IRoad,
  RoadListQueryDto,
  UpdateRoadPayloadDto,
} from "../dtos/route.dto";
import { ROAD_ENDPOINTS } from "../endpoints/route.endpoint";

type RoadListResponse = IRoad[] | { items: IRoad[] };

const withId = (path: string, id: number | string) =>
  path.replace(":id", String(id));

const normalizeRoadList = (data: RoadListResponse): IRoad[] => {
  if (Array.isArray(data)) {
    return data;
  }

  return data.items ?? [];
};

export const getRoads = async (
  query?: Partial<RoadListQueryDto>,
): Promise<IRoad[]> => {
  const response = await axiosClient.get<RoadListResponse>(
    ROAD_ENDPOINTS.list.path,
    {
      params: query?.companyId ? { companyId: query.companyId } : undefined,
    },
  );

  return normalizeRoadList(response.data);
};

export const getRoadById = async (id: number | string): Promise<IRoad> => {
  const response = await axiosClient.get<IRoad>(
    withId(ROAD_ENDPOINTS.detail.path, id),
  );

  return response.data;
};

export const createRoad = async (
  payload: CreateRoadPayloadDto,
): Promise<IRoad> => {
  const response = await axiosClient.post<IRoad>(
    ROAD_ENDPOINTS.create.path,
    payload,
  );

  return response.data;
};

export const updateRoad = async (
  payload: UpdateRoadPayloadDto,
): Promise<IRoad> => {
  const { id, ...body } = payload;
  const response = await axiosClient.patch<IRoad>(
    withId(ROAD_ENDPOINTS.update.path, id),
    body,
  );

  return response.data;
};

export const deleteRoad = async (
  id: number | string,
): Promise<DeleteRoadResponse | void> => {
  const response = await axiosClient.delete<DeleteRoadResponse>(
    withId(ROAD_ENDPOINTS.delete.path, id),
  );

  return response.data;
};
