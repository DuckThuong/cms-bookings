import { useState, useEffect, useCallback } from "react";
import { masterDataConfig } from "@/api/configs/master-data.config";
import { getRoads } from "@/api/configs/route.config";
import { getVehicles } from "@/api/configs/vehicle.config";
import {
  type MasterDataAllResponse,
  type MasterDataItem,
  type FilterOption,
  type StatusMeta,
} from "@/api/dtos/master-data.dto";
import type { IVehicle } from "@/api/dtos/vehicle.dto";

/**
 * Hook to fetch and manage master data from backend
 */
export const useMasterData = () => {
  const [data, setData] = useState<MasterDataAllResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await masterDataConfig.getAllStatuses();
      setData(response);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
      setError("Failed to load master data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Convert MasterDataItem[] to FilterOption[] with optional "all" option
  const toFilterOptions = useCallback(
    (
      items: MasterDataItem[],
      includeAll = false,
      allLabel = "Tất cả",
    ): FilterOption[] => {
      const options = items.map((item) => ({
        value: item.code,
        label: item.name,
      }));

      if (includeAll) {
        return [{ value: "all", label: allLabel }, ...options];
      }

      return options;
    },
    [],
  );

  // Convert MasterDataItem[] to StatusMeta Record
  const toStatusMetaMap = useCallback(
    (items: MasterDataItem[]): Record<string, StatusMeta> => {
      const result: Record<string, StatusMeta> = {};
      for (const item of items) {
        const color = item.rule || "#64748b";
        result[item.code] = {
          label: item.name,
          color,
          bg: `${color}1a`,
        };
      }
      return result;
    },
    [],
  );

  // Get status meta by code
  const getStatusMeta = useCallback(
    (items: MasterDataItem[], code: string): StatusMeta | undefined => {
      const item = items.find((i) => i.code === code);
      if (item?.rule) {
        return {
          label: item.name,
          color: item.rule,
          bg: `${item.rule}1a`,
        };
      }
      return undefined;
    },
    [],
  );

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    toFilterOptions,
    toStatusMetaMap,
    getStatusMeta,
  };
};

// ─── Specialized Hooks ────────────────────────────────────────

export const useDriverStatuses = () => {
  const {
    data,
    loading,
    error,
    refetch,
    toFilterOptions,
    toStatusMetaMap,
    getStatusMeta,
  } = useMasterData();

  return {
    driverStatuses: data?.driverStatuses ?? [],
    driverStatusOptions: toFilterOptions(data?.driverStatuses ?? [], false),
    driverStatusFilterOptions: toFilterOptions(
      data?.driverStatuses ?? [],
      true,
      "Tất cả trạng thái",
    ),
    driverStatusMeta: toStatusMetaMap(data?.driverStatuses ?? []),
    getDriverStatusMeta: (code: string) =>
      getStatusMeta(data?.driverStatuses ?? [], code),
    driverLicenses: data?.driverLicenses ?? [],
    driverLicenseOptions: toFilterOptions(
      data?.driverLicenses ?? [],
      true,
      "Tất cả bằng lái",
    ),
    loading,
    error,
    refetch,
  };
};

export const useVehicleStatuses = () => {
  const {
    data,
    loading,
    error,
    refetch,
    toFilterOptions,
    toStatusMetaMap,
    getStatusMeta,
  } = useMasterData();

  return {
    vehicleStatuses: data?.vehicleStatuses ?? [],
    vehicleStatusOptions: toFilterOptions(
      data?.vehicleStatuses ?? [],
      true,
      "Tất cả trạng thái",
    ),
    vehicleStatusMeta: toStatusMetaMap(data?.vehicleStatuses ?? []),
    getVehicleStatusMeta: (code: string) =>
      getStatusMeta(data?.vehicleStatuses ?? [], code),
    vehicleTypes: data?.vehicleTypes ?? [],
    vehicleTypeOptions: toFilterOptions(
      data?.vehicleTypes ?? [],
      true,
      "Tất cả loại xe",
    ),
    loading,
    error,
    refetch,
  };
};

export const useRouteStatuses = () => {
  const {
    data,
    loading,
    error,
    refetch,
    toFilterOptions,
    toStatusMetaMap,
    getStatusMeta,
  } = useMasterData();

  return {
    routeStatuses: data?.routeStatuses ?? [],
    routeStatusOptions: toFilterOptions(
      data?.routeStatuses ?? [],
      true,
      "Tất cả trạng thái",
    ),
    routeStatusMeta: toStatusMetaMap(data?.routeStatuses ?? []),
    getRouteStatusMeta: (code: string) =>
      getStatusMeta(data?.routeStatuses ?? [], code),
    loading,
    error,
    refetch,
  };
};

export const useBookingStatuses = () => {
  const {
    data,
    loading,
    error,
    refetch,
    toStatusMetaMap,
    getStatusMeta,
  } = useMasterData();

  return {
    bookingStatuses: data?.bookingStatuses ?? [],
    bookingStatusMeta: toStatusMetaMap(data?.bookingStatuses ?? []),
    getBookingStatusMeta: (code: string) =>
      getStatusMeta(data?.bookingStatuses ?? [], code),
    loading,
    error,
    refetch,
  };
};

export const useCustomerStatuses = () => {
  const {
    data,
    loading,
    error,
    refetch,
    toFilterOptions,
    toStatusMetaMap,
    getStatusMeta,
  } = useMasterData();

  return {
    customerStatuses: data?.customerStatuses ?? [],
    customerStatusOptions: toFilterOptions(
      data?.customerStatuses ?? [],
      true,
      "Tất cả trạng thái",
    ),
    customerStatusMeta: toStatusMetaMap(data?.customerStatuses ?? []),
    getCustomerStatusMeta: (code: string) =>
      getStatusMeta(data?.customerStatuses ?? [], code),
    customerTiers: data?.customerTiers ?? [],
    customerTierOptions: toFilterOptions(
      data?.customerTiers ?? [],
      true,
      "Tất cả hạng",
    ),
    loading,
    error,
    refetch,
  };
};

export const useReportStatuses = () => {
  const {
    data,
    loading,
    error,
    refetch,
    toFilterOptions,
    toStatusMetaMap,
    getStatusMeta,
  } = useMasterData();

  return {
    reportStatuses: data?.reportStatuses ?? [],
    reportStatusOptions: toFilterOptions(
      data?.reportStatuses ?? [],
      true,
      "Tất cả trạng thái",
    ),
    reportStatusMeta: toStatusMetaMap(data?.reportStatuses ?? []),
    getReportStatusMeta: (code: string) =>
      getStatusMeta(data?.reportStatuses ?? [], code),
    reportTypes: data?.reportTypes ?? [],
    reportTypeOptions: toFilterOptions(
      data?.reportTypes ?? [],
      true,
      "Tất cả loại báo cáo",
    ),
    loading,
    error,
    refetch,
  };
};

export const useRegistrationStatuses = () => {
  const {
    data,
    loading,
    error,
    refetch,
    toFilterOptions,
    toStatusMetaMap,
    getStatusMeta,
  } = useMasterData();

  return {
    registrationStatuses: data?.registrationStatuses ?? [],
    registrationStatusOptions: toFilterOptions(
      data?.registrationStatuses ?? [],
      true,
      "Tất cả trạng thái",
    ),
    registrationStatusMeta: toStatusMetaMap(data?.registrationStatuses ?? []),
    getRegistrationStatusMeta: (code: string) =>
      getStatusMeta(data?.registrationStatuses ?? [], code),
    loading,
    error,
    refetch,
  };
};

export const useRevenueStatuses = () => {
  // Revenue statuses are not in master-data, define locally or add to BE
  const revenueStatusMeta: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    settled: {
      label: "Đã đối soát",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
    },
    processing: {
      label: "Đang xử lý",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.12)",
    },
    refunded: {
      label: "Hoàn tiền",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.12)",
    },
  };
  return {
    revenueStatuses: [
      { code: "settled", name: "Đã đối soát", rule: "#22c55e" },
      { code: "processing", name: "Đang xử lý", rule: "#3b82f6" },
      { code: "refunded", name: "Hoàn tiền", rule: "#ef4444" },
    ] as MasterDataItem[],
    revenueStatusOptions: [
      { value: "settled", label: "Đã đối soát" },
      { value: "processing", label: "Đang xử lý" },
      { value: "refunded", label: "Hoàn tiền" },
    ] as FilterOption[],
    revenueStatusMeta,
  };
};

// ─── Routes Hook ─────────────────────────────────────────────

export const useRoutes = () => {
  const [routes, setRoutes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoads();
      setRoutes(
        data.map(
          (r: {
            id: number;
            name?: string;
            startPoint?: string;
            endPoint?: string;
          }) => ({
            id: r.id,
            name: r.name || `${r.startPoint} — ${r.endPoint}`,
          }),
        ),
      );
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      setError("Failed to load routes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const routeOptions: FilterOption[] = [
    { value: "all", label: "Tất cả tuyến" },
    ...routes.map((r) => ({ value: String(r.id), label: r.name })),
  ];

  return { routes, routeOptions, loading, error, refetch: fetchRoutes };
};

// ─── Vehicles Hook ────────────────────────────────────────────

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<
    { id: number; code: string; name: string; seatCount: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVehicles();
      const items = response.items ?? response ?? [];
      setVehicles(
        (items as IVehicle[]).map((v: IVehicle) => ({
          id: v.id,
          code: v.code ?? "",
          name: v.name ?? "",
          seatCount: v.seatCount ?? 0,
        })),
      );
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const vehicleOptions: FilterOption[] = [
    { value: "all", label: "Tất cả phương tiện" },
    ...vehicles.map((v) => ({
      value: String(v.id),
      label: `${v.code} · ${v.name} (${v.seatCount} chỗ)`,
    })),
  ];

  return { vehicles, vehicleOptions, loading, error, refetch: fetchVehicles };
};
