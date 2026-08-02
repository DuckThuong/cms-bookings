import {
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined,
  MailOutlined,
  MessageOutlined,
  BellOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

export enum PaymentMethod {
  CASH = "cash",
}
export enum CardNetwork {
  VISA = "visa",
  MASTERCARD = "mastercard",
  JCB = "jcb",
}

export interface MethodOption {
  key: PaymentMethod;
  icon: React.ReactNode;
  label: string;
  desc: string;
}

export const METHOD_OPTIONS: MethodOption[] = [
  {
    key: PaymentMethod.CASH,
    icon: <DollarOutlined /> as React.ReactNode,
    label: "Tiền mặt",
    desc: "Thanh toán tại quầy",
  },
];

export const CARD_NETWORKS: { value: CardNetwork; label: string; color: string }[] = [];

// ─── Profile Page 1: Summary Stats ─────────────────────────
export const SUMMARY_STATS = [
  {
    id: "trips",
    icon: "ti-bus",
    label: "Số chuyến đã đặt",
    key: "bookingCount",
    sub: "chuyến xe",
  },
  {
    id: "paid",
    icon: "ti-coin",
    label: "Tổng chi tiêu",
    key: "spentAmount",
    sub: "VND",
  },
  {
    id: "tickets",
    icon: "ti-eye",
    label: "Số vé",
    key: "ticketCount",
    sub: "vé đã phát hành",
  },
] as const;

export type ProfileStatKey = (typeof SUMMARY_STATS)[number]["key"];

// ─── Profile Page 3: Ticket Status Config ───────────────────
export type ProfileBookingStatus =
  | "Đã xác nhận"
  | "Chờ khởi hành"
  | "Chờ xác nhận"
  | "Chưa thanh toán"
  | "Đã hủy"
  | "Chuẩn bị khởi hành"
  | "Đang đón khách"
  | "Đã khởi hành"
  | "Sắp đến điểm đón"
  | "Đang di chuyển"
  | "Đã đến điểm đón"
  | "Hoàn thành"
  | "Chờ hoàn tiền";

export const STATUS_CONFIG: Record<
  ProfileBookingStatus,
  { color: string; bg: string; dot: string }
> = {
  "Đã xác nhận": { color: "#15803d", bg: "#dcfce7", dot: "#22c55e" },
  "Chờ khởi hành": { color: "#854d0e", bg: "#fef9c3", dot: "#eab308" },
  "Chờ xác nhận": { color: "#1d4ed8", bg: "#dbeafe", dot: "#3b82f6" },
  "Chưa thanh toán": { color: "#9a3412", bg: "#ffedd5", dot: "#f97316" },
  "Đã hủy": { color: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
  "Chuẩn bị khởi hành": { color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6" },
  "Đang đón khách": { color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" },
  "Đã khởi hành": { color: "#0369a1", bg: "#e0f2fe", dot: "#0ea5e9" },
  "Sắp đến điểm đón": { color: "#6d28d9", bg: "#f3e8ff", dot: "#a855f7" },
  "Đang di chuyển": { color: "#0f766e", bg: "#ccfbf1", dot: "#14b8a6" },
  "Đã đến điểm đón": { color: "#15803d", bg: "#dcfce7", dot: "#22c55e" },
  "Hoàn thành": { color: "#166534", bg: "#bbf7d0", dot: "#10b981" },
  "Chờ hoàn tiền": { color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6" },
};

// ─── Profile Page 5: Notification Settings ────────────────────
export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  promotions: boolean;
  bookingUpdates: boolean;
  paymentReminders: boolean;
  travelAlerts: boolean;
  preferredContact: "email" | "sms" | "phone";
}

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  promotions: false,
  bookingUpdates: true,
  paymentReminders: true,
  travelAlerts: false,
  preferredContact: "email",
};

export type NotificationChannelKey = keyof Omit<NotificationSettings, "preferredContact">;

export interface NotificationSwitchItem {
  key: NotificationChannelKey;
  icon: React.ReactNode;
  label: string;
  desc: string;
}

export const CHANNEL_ITEMS: NotificationSwitchItem[] = [
  {
    key: "email",
    icon: <MailOutlined />,
    label: "Email",
    desc: "Thông báo gửi đến hộp thư của bạn",
  },
  {
    key: "sms",
    icon: <MessageOutlined />,
    label: "SMS",
    desc: "Tin nhắn thông báo đến số điện thoại",
  },
  {
    key: "push",
    icon: <BellOutlined />,
    label: "Thông báo đẩy",
    desc: "Thông báo trong ứng dụng GoRide",
  },
  // {
  //   key: "promotions",
  //   icon: <TagsOutlined />,
  //   label: "Khuyến mãi",
  //   desc: "Ưu đãi, voucher và tin tức mới nhất",
  // },
];

export const ALERT_ITEMS: NotificationSwitchItem[] = [
  {
    key: "bookingUpdates",
    icon: <CheckCircleOutlined />,
    label: "Cập nhật đặt vé",
    desc: "Thông báo hủy hoặc thay đổi chuyến đi",
  },
  {
    key: "paymentReminders",
    icon: <CreditCardOutlined />,
    label: "Nhắc thanh toán",
    desc: "Nhắc trước khi đến hạn thanh toán",
  },
  {
    key: "travelAlerts",
    icon: <WarningOutlined />,
    label: "Cảnh báo chuyến đi",
    desc: "Thông báo cho các sự cố hoặc thay đổi liên quan đến chuyến đi",
  },
];

// ─── Profile Page 6: Company Registration ──────────────────────
export type CompanyRegistrationFormValues = {
  companyName: string;
  address?: string;
  representativePhone?: string;
  representativeName?: string;
  representativePosition?: string;
  taxCode?: string;
  businessAddress?: string;
  businessLicenseDate?: string;
  businessLicenseUrl?: string;
  idCardUrl?: string;
  description?: string;
};
