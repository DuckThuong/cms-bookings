import type { FilterOption, StatusMeta, SummaryItem } from "./types";

export type ProviderStatusKey = "active" | "pending" | "suspended";

export type ProviderRecord = {
  key: string;
  id: string;
  name: string;
  hotline: string;
  email: string;
  routeCount: number;
  vehicleCount: number;
  status: ProviderStatusKey;
  joinedAt: string;
  note: string;
};

export const PROVIDER_STATUS_META: Record<ProviderStatusKey, StatusMeta> = {
  active: { label: "Đang hoạt động", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  pending: { label: "Chờ duyệt", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  suspended: { label: "Tạm khóa", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

export const providerStatusOptions: FilterOption[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "suspended", label: "Tạm khóa" },
];

export const providers: ProviderRecord[] = [
  {
    key: "provider-01",
    id: "NX-1001",
    name: "Phương Trang FUTA",
    hotline: "19006067",
    email: "support@futa.vn",
    routeCount: 28,
    vehicleCount: 184,
    status: "active",
    joinedAt: "2024-01-12",
    note: "Nhà xe chủ lực khu vực phía Nam, ưu tiên tuyến HCM - Đà Lạt và HCM - Cần Thơ.",
  },
  {
    key: "provider-02",
    id: "NX-1002",
    name: "Thành Bưởi",
    hotline: "19001905",
    email: "contact@thanhbuoi.vn",
    routeCount: 18,
    vehicleCount: 96,
    status: "active",
    joinedAt: "2024-03-08",
    note: "Tập trung tuyến HCM - Đà Lạt, tần suất cao cuối tuần.",
  },
  {
    key: "provider-03",
    id: "NX-1003",
    name: "Hoàng Long",
    hotline: "19009898",
    email: "ops@hoanglong.com.vn",
    routeCount: 22,
    vehicleCount: 132,
    status: "active",
    joinedAt: "2024-05-20",
    note: "Vận hành nhiều tuyến dài Bắc - Nam, cần theo dõi đúng giờ.",
  },
  {
    key: "provider-04",
    id: "NX-1004",
    name: "Kumho Samco",
    hotline: "19006065",
    email: "support@kumhosamco.vn",
    routeCount: 11,
    vehicleCount: 54,
    status: "pending",
    joinedAt: "2025-11-02",
    note: "Đang bổ sung hồ sơ pháp lý cho nhóm xe limousine.",
  },
  {
    key: "provider-05",
    id: "NX-1005",
    name: "The Sinh Tourist",
    hotline: "02838389597",
    email: "booking@thesinhtourist.vn",
    routeCount: 7,
    vehicleCount: 31,
    status: "suspended",
    joinedAt: "2025-02-14",
    note: "Tạm khóa do chưa hoàn tất đối soát kỳ gần nhất.",
  },
];

export const getProviderSummary = (data: ProviderRecord[]): SummaryItem[] => [
  { key: "providers", label: "Tổng nhà xe", color: "#3b82f6", value: data.length },
  { key: "active", label: "Đang hoạt động", color: "#22c55e", value: data.filter((item) => item.status === "active").length },
  { key: "routes", label: "Tổng tuyến", color: "#f97316", value: data.reduce((sum, item) => sum + item.routeCount, 0) },
  { key: "vehicles", label: "Tổng xe", color: "#a855f7", value: data.reduce((sum, item) => sum + item.vehicleCount, 0) },
];
