import type { FilterOption, StatusMeta, SummaryItem } from "./types";

export type RouteStatusKey = "ACTIVE" | "INACTIVE";
export type VehicleStatusKey = "ready" | "in_service" | "maintenance" | "idle";

export type OperationStatusKey =
  | "SCHEDULED"
  | "PREPARING"
  | "BOARDING"
  | "DEPARTED"
  | "APPROACHING"
  | "MOVING"
  | "ARRIVED"
  | "COMPLETED"
  | "CANCELLED"
  | "DELAYED";

export type TripStatusKey =
  | "scheduled"
  | "boarding"
  | "running"
  | "completed"
  | "delayed";

export type TripRecord = {
  key: string;
  id: string;
  route: string;
  vehicle: string;
  driver: string;
  departure: string;
  arrival: string;
  bookedSeats: number;
  capacity: number;
  occupancyRate: number;
  status: TripStatusKey;
  operationStatus?: OperationStatusKey;
  note: string;
};

export type RouteRecord = {
  key: string;
  id: string;
  route: string;
  distanceKm: number;
  standardDuration: string;
  tripsPerDay: number;
  averageOccupancy: number;
  estimatedRevenue: number;
  status: RouteStatusKey;
  leadVehicle: string;
  demandLevel: string;
  note: string;
};

export type FleetVehicleRecord = {
  key: string;
  plateNumber: string;
  type: string;
  seats: number;
  assignedRoute: string;
  primaryDriver: string;
  status: VehicleStatusKey;
  lastMaintenance: string;
  nextMaintenance: string;
  utilizationRate: number;
  note: string;
};

export const TRIP_STATUS_META: Record<TripStatusKey, StatusMeta> = {
  scheduled: {
    label: "Đã lên lịch",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  boarding: {
    label: "Đang đón khách",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  running: { label: "Đang chạy", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  completed: {
    label: "Hoàn thành",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
  },
  delayed: {
    label: "Trễ chuyến",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

export const TRIP_ROUTE_STATUS_META: Record<RouteStatusKey, StatusMeta> = {
  ACTIVE: {
    label: "Đang khai thác",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  INACTIVE: {
    label: "Tạm dừng",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
  },
};

export const TRIP_VEHICLE_STATUS_META: Record<VehicleStatusKey, StatusMeta> = {
  ready: { label: "Sẵn sàng", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  in_service: {
    label: "Đang khai thác",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  maintenance: {
    label: "Bảo dưỡng",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
  idle: {
    label: "Chờ phân công",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
};

export const OPERATION_STATUS_META: Record<OperationStatusKey, StatusMeta> = {
  SCHEDULED: {
    label: "Đã lên lịch",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  PREPARING: {
    label: "Chuẩn bị khởi hành",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
  },
  BOARDING: {
    label: "Đang đón khách",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  DEPARTED: {
    label: "Đã khởi hành",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  APPROACHING: {
    label: "Sắp đến điểm đón",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
  },
  MOVING: {
    label: "Đang di chuyển",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
  },
  ARRIVED: {
    label: "Đã đến điểm đón",
    color: "#14b8a6",
    bg: "rgba(20,184,166,0.12)",
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
  DELAYED: {
    label: "Trễ chuyến",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
  },
};

export const operationStatusOptions: FilterOption[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "PREPARING", label: "Chuẩn bị khởi hành" },
  { value: "BOARDING", label: "Đang đón khách" },
  { value: "DEPARTED", label: "Đã khởi hành" },
  { value: "APPROACHING", label: "Sắp đến điểm đón" },
  { value: "MOVING", label: "Đang di chuyển" },
  { value: "ARRIVED", label: "Đã đến điểm đón" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "DELAYED", label: "Trễ chuyến" },
];

export const tripStatusOptions: FilterOption[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "scheduled", label: "Đã lên lịch" },
  { value: "boarding", label: "Đang đón khách" },
  { value: "running", label: "Đang chạy" },
  { value: "completed", label: "Hoàn thành" },
  { value: "delayed", label: "Trễ chuyến" },
];

export const tripRouteStatusOptions: FilterOption[] = [
  { value: "all", label: "Tất cả tuyến" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
];

export const fleetStatusOptions: FilterOption[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "ready", label: "Sẵn sàng" },
  { value: "in_service", label: "Đang khai thác" },
  { value: "maintenance", label: "Bảo dưỡng" },
  { value: "idle", label: "Chờ phân công" },
];

export const fleetTypeOptions: FilterOption[] = [
  { value: "all", label: "Tất cả loại xe" },
  { value: "Xe khách 45 chỗ", label: "Xe khách 45 chỗ" },
  { value: "Xe limousine 16 chỗ", label: "Xe limousine 16 chỗ" },
  { value: "Xe giường nằm 34 chỗ", label: "Xe giường nằm 34 chỗ" },
  { value: "Xe limousine 9 chỗ", label: "Xe limousine 9 chỗ" },
];

export const demandLevelOptions: FilterOption[] = [
  { value: "Cao", label: "Cao" },
  { value: "Ổn định", label: "Ổn định" },
  { value: "Chiến lược", label: "Chiến lược" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Thấp", label: "Thấp" },
];

export const trips: TripRecord[] = [
  {
    key: "trip-01",
    id: "TRP-2101",
    route: "HCM → Đà Lạt",
    vehicle: "51B-123.45",
    driver: "Nguyễn Quốc Huy",
    departure: "2026-05-20 07:00",
    arrival: "2026-05-20 14:30",
    bookedSeats: 37,
    capacity: 45,
    occupancyRate: 82,
    status: "scheduled",
    note: "Dự kiến full tải vào sáng thứ 4.",
  },
  {
    key: "trip-02",
    id: "TRP-2102",
    route: "HCM → Nha Trang",
    vehicle: "51B-456.78",
    driver: "Trần Văn Hậu",
    departure: "2026-05-19 22:00",
    arrival: "2026-05-20 05:30",
    bookedSeats: 15,
    capacity: 16,
    occupancyRate: 94,
    status: "running",
    note: "Đang đúng ETA, không có cảnh báo.",
  },
  {
    key: "trip-03",
    id: "TRP-2103",
    route: "HCM → Hà Nội",
    vehicle: "51B-789.01",
    driver: "Phạm Đức Long",
    departure: "2026-05-19 18:00",
    arrival: "2026-05-20 18:00",
    bookedSeats: 30,
    capacity: 34,
    occupancyRate: 88,
    status: "running",
    note: "Tuyến dài, theo dõi tiếp nhiên liệu tại điểm dừng.",
  },
  {
    key: "trip-04",
    id: "TRP-2104",
    route: "HCM → Vũng Tàu",
    vehicle: "51B-567.89",
    driver: "Đặng Thanh Bình",
    departure: "2026-05-19 08:00",
    arrival: "2026-05-19 10:30",
    bookedSeats: 8,
    capacity: 9,
    occupancyRate: 89,
    status: "completed",
    note: "Tỉ lệ đúng giờ 100%.",
  },
  {
    key: "trip-05",
    id: "TRP-2105",
    route: "HCM → Cần Thơ",
    vehicle: "51B-234.56",
    driver: "Lý Minh Tâm",
    departure: "2026-05-20 06:30",
    arrival: "2026-05-20 10:00",
    bookedSeats: 18,
    capacity: 45,
    occupancyRate: 40,
    status: "delayed",
    note: "Xe đổi bãi vì đang kiểm tra kỹ thuật nhẹ.",
  },
  {
    key: "trip-06",
    id: "TRP-2106",
    route: "HCM → Đà Lạt",
    vehicle: "51B-123.45",
    driver: "Nguyễn Quốc Huy",
    departure: "2026-05-20 06:15",
    arrival: "2026-05-20 06:55",
    bookedSeats: 45,
    capacity: 45,
    occupancyRate: 100,
    status: "boarding",
    note: "Đang đón nhóm khách cuối tại bến xe.",
  },
];

export const operationRoutes: RouteRecord[] = [
  {
    key: "route-01",
    id: "RT-101",
    route: "HCM → Đà Lạt",
    distanceKm: 305,
    standardDuration: "7h30",
    tripsPerDay: 12,
    averageOccupancy: 84,
    estimatedRevenue: 42800000,
    status: "ACTIVE",
    leadVehicle: "51B-123.45",
    demandLevel: "Cao",
    note: "Tuyến chủ lực cuối tuần và lễ.",
  },
  {
    key: "route-02",
    id: "RT-102",
    route: "HCM → Nha Trang",
    distanceKm: 430,
    standardDuration: "7h00",
    tripsPerDay: 9,
    averageOccupancy: 79,
    estimatedRevenue: 39100000,
    status: "ACTIVE",
    leadVehicle: "51B-456.78",
    demandLevel: "Ổn định",
    note: "Tuyến đêm có tỷ lệ lấp đầy cao.",
  },
  {
    key: "route-03",
    id: "RT-103",
    route: "HCM → Hà Nội",
    distanceKm: 1715,
    standardDuration: "24h00",
    tripsPerDay: 3,
    averageOccupancy: 86,
    estimatedRevenue: 51700000,
    status: "ACTIVE",
    leadVehicle: "51B-789.01",
    demandLevel: "Chiến lược",
    note: "Cần theo dõi xoay tài xế 2 ca.",
  },
  {
    key: "route-04",
    id: "RT-104",
    route: "HCM → Cần Thơ",
    distanceKm: 170,
    standardDuration: "3h30",
    tripsPerDay: 6,
    averageOccupancy: 62,
    estimatedRevenue: 22300000,
    status: "INACTIVE",
    leadVehicle: "51B-234.56",
    demandLevel: "Trung bình",
    note: "Đã giảm 1 chuyến/ngày do nhu cầu thấp giữa tuần.",
  },
  {
    key: "route-05",
    id: "RT-105",
    route: "HCM → Phan Thiết",
    distanceKm: 190,
    standardDuration: "4h00",
    tripsPerDay: 4,
    averageOccupancy: 48,
    estimatedRevenue: 12400000,
    status: "INACTIVE",
    leadVehicle: "51B-234.56",
    demandLevel: "Thấp",
    note: "Tạm dừng khung giờ tối để tái cơ cấu lịch chạy.",
  },
];

export const fleetVehicles: FleetVehicleRecord[] = [
  {
    key: "fleet-01",
    plateNumber: "51B-123.45",
    type: "Xe khách 45 chỗ",
    seats: 45,
    assignedRoute: "HCM → Đà Lạt",
    primaryDriver: "Nguyễn Quốc Huy",
    status: "ready",
    lastMaintenance: "2026-05-05",
    nextMaintenance: "2026-06-05",
    utilizationRate: 86,
    note: "Xe chủ lực tuyến Đà Lạt, nội thất mới thay tháng trước.",
  },
  {
    key: "fleet-02",
    plateNumber: "51B-456.78",
    type: "Xe limousine 16 chỗ",
    seats: 16,
    assignedRoute: "HCM → Nha Trang",
    primaryDriver: "Trần Văn Hậu",
    status: "in_service",
    lastMaintenance: "2026-05-11",
    nextMaintenance: "2026-06-10",
    utilizationRate: 92,
    note: "Khai thác mạnh chuyến đêm và cuối tuần.",
  },
  {
    key: "fleet-03",
    plateNumber: "51B-789.01",
    type: "Xe giường nằm 34 chỗ",
    seats: 34,
    assignedRoute: "HCM → Hà Nội",
    primaryDriver: "Phạm Đức Long",
    status: "in_service",
    lastMaintenance: "2026-05-09",
    nextMaintenance: "2026-06-08",
    utilizationRate: 88,
    note: "Theo dõi hệ thống điều hòa sau 2 tuyến dài liên tiếp.",
  },
  {
    key: "fleet-04",
    plateNumber: "51B-234.56",
    type: "Xe khách 45 chỗ",
    seats: 45,
    assignedRoute: "HCM → Cần Thơ",
    primaryDriver: "Lý Minh Tâm",
    status: "maintenance",
    lastMaintenance: "2026-05-18",
    nextMaintenance: "2026-05-25",
    utilizationRate: 41,
    note: "Đang kiểm tra hệ thống phanh, chưa mở chuyến mới.",
  },
  {
    key: "fleet-05",
    plateNumber: "51B-567.89",
    type: "Xe limousine 9 chỗ",
    seats: 9,
    assignedRoute: "HCM → Vũng Tàu",
    primaryDriver: "Đặng Thanh Bình",
    status: "idle",
    lastMaintenance: "2026-05-02",
    nextMaintenance: "2026-06-01",
    utilizationRate: 57,
    note: "Chờ phân công cho khung giờ chiều.",
  },
];

export const getTripSummary = (data: TripRecord[]): SummaryItem[] => [
  { key: "total", label: "Tổng chuyến", color: "#3b82f6", value: data.length },
  {
    key: "running",
    label: "Đang chạy",
    color: "#22c55e",
    value: data.filter((item) => item.status === "running").length,
  },
  {
    key: "boarding",
    label: "Đang đón khách",
    color: "#f59e0b",
    value: data.filter((item) => item.status === "boarding").length,
  },
  {
    key: "load",
    label: "Lấp đầy TB",
    color: "#f97316",
    value: `${Math.round(data.reduce((sum, item) => sum + item.occupancyRate, 0) / data.length)}%`,
  },
];

export const getRouteSummary = (data: RouteRecord[]): SummaryItem[] => [
  { key: "routes", label: "Tổng tuyến", color: "#3b82f6", value: data.length },
  {
    key: "peak",
    label: "Nhu cầu cao",
    color: "#f97316",
    value: data.filter((item) => item.status === "peak").length,
  },
  {
    key: "tripsPerDay",
    label: "Chuyến/ngày",
    color: "#22c55e",
    value: data.reduce((sum, item) => sum + item.tripsPerDay, 0),
  },
  {
    key: "occupancy",
    label: "Lấp đầy TB",
    color: "#eab308",
    value: `${Math.round(data.reduce((sum, item) => sum + item.averageOccupancy, 0) / data.length)}%`,
  },
];

export const getFleetSummary = (data: FleetVehicleRecord[]): SummaryItem[] => [
  { key: "vehicles", label: "Tổng xe", color: "#3b82f6", value: data.length },
  {
    key: "ready",
    label: "Sẵn sàng",
    color: "#22c55e",
    value: data.filter((item) => item.status === "ready").length,
  },
  {
    key: "in_service",
    label: "Đang khai thác",
    color: "#f97316",
    value: data.filter((item) => item.status === "in_service").length,
  },
  {
    key: "utilization",
    label: "Sử dụng TB",
    color: "#a855f7",
    value: `${Math.round(data.reduce((sum, item) => sum + item.utilizationRate, 0) / data.length)}%`,
  },
];

export type VehicleFleetSummaryInput = {
  status: string;
  seatCount: number;
};

export const getVehicleFleetSummary = (
  data: VehicleFleetSummaryInput[],
): SummaryItem[] => [
  { key: "vehicles", label: "Tổng xe", color: "#3b82f6", value: data.length },
  {
    key: "active",
    label: "Đang hoạt động",
    color: "#22c55e",
    value: data.filter((item) => item.status === "ACTIVE").length,
  },
  {
    key: "maintenance",
    label: "Bảo dưỡng",
    color: "#ef4444",
    value: data.filter((item) => item.status === "MAINTENANCE").length,
  },
  {
    key: "seats",
    label: "Tổng chỗ",
    color: "#a855f7",
    value: data.reduce((sum, item) => sum + item.seatCount, 0),
  },
];
