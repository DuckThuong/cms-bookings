import { MasterDataEndPoints } from '../endpoints/master-data.endpoint';
import axiosClient from '../axiosClient';
import { MasterDataAllResponse } from '../dtos/master-data.dto';

export const masterDataConfig = {
  getAllStatuses: async (): Promise<MasterDataAllResponse> => {
    const response = await axiosClient.get<MasterDataAllResponse>(
      MasterDataEndPoints.GET_ALL_STATUSES,
    );
    return response.data;
  },
};
