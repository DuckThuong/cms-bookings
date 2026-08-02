export const NOTI_ERROR = "error";
export const NOTI_SUCCESS = "success";
export const DEFAULT_MESSAGE = "Đã xảy ra lỗi.";
export const SUCCESS_MESSAGE = "Thành công!";
export const TYPE_LOG_OUT = 99;

export const InputState = {
  idle: "idle",
  valid: "valid",
  error: "error",
  loading: "loading",
  success: "success",
};

export const STEPS = [
  { label: "Tài khoản" },
  { label: "Thông tin" },
  { label: "Xác nhận" },
];

export const BENEFITS = [
  { icon: "🛡️", text: "Bảo mật\ntuyệt đối" },
  { icon: "🎁", text: "Ưu đãi\nthành viên" },
  { icon: "⚡", text: "Đặt xe\n1 chạm" },
  { icon: "📍", text: "Theo dõi\nreal-time" },
];

export const LOGO_COLORS: Record<string, string> = {
  PT: "#e63946",
  TB: "#2563eb",
  HL: "#16a34a",
  KS: "#7c3aed",
};

export const LOGO_OPERATORS_COLORS: Record<string, string> = {
  PT: "#e63946",
  TB: "#2563eb",
  HL: "#16a34a",
  KS: "#7c3aed",
  CT: "#ea580c",
};

export const TAG_COLORS: Record<string, string> = {
  amber: "service-card__tag--amber",
  green: "service-card__tag--green",
  red: "service-card__tag--red",
};

export const statusMap: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
  blocked: "Đã khóa",
};

export const tierMap: Record<string, string> = {
  "pho-thong": "Phổ thông",
  "than-thiet": "Thân thiết",
  "vip": "VIP",
};