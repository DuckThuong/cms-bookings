export interface MasterDataItem {
  id: number;
  type: string;
  code: string;
  name: string;
  rule?: string;
  sort: number;
}

export interface MasterDataAllResponse {
  driverStatuses: MasterDataItem[];
  driverLicenses: MasterDataItem[];
  vehicleStatuses: MasterDataItem[];
  vehicleTypes: MasterDataItem[];
  routeStatuses: MasterDataItem[];
  customerStatuses: MasterDataItem[];
  customerTiers: MasterDataItem[];
  reportStatuses: MasterDataItem[];
  reportTypes: MasterDataItem[];
  seatTypes: MasterDataItem[];
  registrationStatuses: MasterDataItem[];
  bookingStatuses: MasterDataItem[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface StatusMeta {
  label: string;
  color: string;
  bg: string;
}
