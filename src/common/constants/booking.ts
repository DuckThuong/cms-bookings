import type {
  RowDef,
  SeatDef,
  SeatStatus,
  VehicleConfig,
  VehicleType,
} from "@/common/types/booking";

const createSeat = (id: string, status: SeatStatus = "available"): SeatDef => ({
  id,
  status,
});

const LAYOUT_16: RowDef[] = [
  {
    row: 1,
    seats: [
      createSeat("A1", "vip"),
      createSeat("A2"),
      null,
      createSeat("A3"),
      createSeat("A4", "booked"),
    ],
  },
  {
    row: 2,
    seats: [
      createSeat("B1"),
      createSeat("B2"),
      null,
      createSeat("B3", "booked"),
      createSeat("B4"),
    ],
  },
  {
    row: 3,
    seats: [
      createSeat("C1"),
      createSeat("C2", "booked"),
      null,
      createSeat("C3"),
      createSeat("C4"),
    ],
  },
  {
    row: 4,
    seats: [
      createSeat("D1"),
      createSeat("D2"),
      null,
      createSeat("D3"),
      createSeat("D4", "booked"),
    ],
  },
  {
    row: 5,
    seats: [
      createSeat("E1"),
      createSeat("E2"),
      createSeat("E3"),
      createSeat("E4", "booked"),
      createSeat("E5"),
    ],
    full: true,
  },
];

const makeFloor = (prefix: string, bookedNums: number[]): RowDef[] =>
  Array.from({ length: 9 }, (_, r) => ({
    row: r + 1,
    seats: [1, 2, null, 3, 4].map((c) => {
      if (c === null) return null;
      const num = r * 4 + c;
      const id = `${prefix}${String.fromCharCode(65 + r)}${c}`;
      return createSeat(
        id,
        bookedNums.includes(num)
          ? "booked"
          : c === 1 && r < 2
            ? "vip"
            : "available",
      );
    }),
  }));

const LAYOUT_36_F1 = makeFloor("F1", [2, 6, 11, 14, 20, 24, 28, 30, 35]);
const LAYOUT_36_F2 = makeFloor("F2", [1, 5, 9, 13, 18, 22, 25, 29, 33]);

const makeLayout45 = (): RowDef[] => {
  const booked = new Set([2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32]);
  let num = 0;
  const rows: RowDef[] = Array.from({ length: 9 }, (_, r) => ({
    row: r + 1,
    seats: [0, 1, null, 2, 3].map((c) => {
      if (c === null) return null;
      num++;
      return createSeat(`S${num}`, booked.has(num) ? "booked" : "available");
    }),
  }));
  const backRow: RowDef = {
    row: 10,
    full: true,
    seats: Array.from({ length: 5 }, () => {
      num++;
      return createSeat(`S${num}`, booked.has(num) ? "booked" : "available");
    }),
  };
  return [...rows, backRow];
};

export const VEHICLES: Record<VehicleType, VehicleConfig> = {
  "16": {
    label: "Xe 16 chỗ",
    icon: "ti-car-suv",
    mapTitle: "Xe 16 chỗ — Limousine SUV",
    mapSub: "Chọn ghế bạn muốn ngồi. Tối đa 4 ghế mỗi lần đặt.",
    floors: 1,
    layout: LAYOUT_16,
  },
  "36": {
    label: "Giường nằm 36",
    icon: "ti-bus",
    mapTitle: "Giường nằm 36 chỗ — 2 tầng",
    mapSub: "Xe 2 tầng — mỗi tầng 18 giường. Chọn tầng bên dưới.",
    floors: 2,
    floor1: LAYOUT_36_F1,
    floor2: LAYOUT_36_F2,
    isSleeper: true,
  },
  "45": {
    label: "Ghế ngồi 45",
    icon: "ti-bus",
    mapTitle: "Xe ghế ngồi 45 chỗ",
    mapSub: "Ghế ngồi tiêu chuẩn — có điều hoà, wifi.",
    floors: 1,
    layout: makeLayout45(),
  },
};

export const UNIT_PRICE = 350000;
export const FEE_RATE = 0.05;
export const MAX_SEATS = 4;
export const PICKUP_PRICE = 50_000;

export const OPERATOR_AMENITIES = [
  { icon: "wifi", label: "Wifi 5G" },
  { icon: "air-conditioning", label: "Điều hoà" },
  { icon: "plug", label: "Sạc USB" },
  { icon: "device-tv", label: "Màn hình" },
  { icon: "bowl", label: "Bữa nhẹ" },
  { icon: "shield-check", label: "Bảo hiểm" },
] as const;

// ──────────────────────────────────────────────────────────
// ADD-ON SERVICES
// ──────────────────────────────────────────────────────────
export type AddonService = {
  id: string;
  icon: string;
  name: string;
  desc: string;
  price: number; // 0 = miễn phí
  hasQty?: boolean; // true = dùng stepper thay checkbox
};

export const ADDON_SERVICES: AddonService[] = [
  {
    id: "insurance",
    icon: "shield-check",
    name: "Bảo hiểm chuyến đi",
    desc: "Bồi thường đến 50 triệu — tai nạn, mất hành lý",
    price: 30_000,
  },
  {
    id: "meal",
    icon: "tools-kitchen-2",
    name: "Suất ăn cao cấp",
    desc: "Cơm hộp nóng giao tận ghế — Việt Nam / Hàn Quốc",
    price: 45_000,
  },
  {
    id: "baggage",
    icon: "luggage",
    name: "Hành lý thêm",
    desc: "Cho phép thêm 1 kiện ≤ 20 kg vào khoang xe",
    price: 0,
  },
  {
    id: "pillow",
    icon: "bed",
    name: "Gối + chăn cao cấp",
    desc: "Bộ gối chăn fleece mềm, sạch — đảm bảo vệ sinh",
    price: 15_000,
  },
  {
    id: "pickup",
    icon: "map-pin",
    name: "Đưa đón tận nơi",
    desc: "Bán kính ≤ 5 km từ bến xe — đặt thêm sau khi chọn ghế",
    price: PICKUP_PRICE,
    hasQty: true,
  },
];

// ──────────────────────────────────────────────────────────
// PROMO CODES
// ──────────────────────────────────────────────────────────
export type PromoCode = {
  code: string;
  icon: string; // tabler icon name (ti-xxx)
  discount: string; // display label
  desc: string;
  type: "fixed" | "percent";
  value: number; // fixed: VND amount | percent: 0–1
  max?: number; // percent only: cap in VND
  minOrder?: number; // minimum order value
};

export const PROMO_CODES: PromoCode[] = [
  {
    code: "RIDE50",
    icon: "ti-ticket",
    discount: "Giảm 50.000đ",
    desc: "Đơn từ 300k",
    type: "fixed",
    value: 50_000,
    minOrder: 300_000,
  },
  {
    code: "GORIDE10",
    icon: "ti-ticket",
    discount: "Giảm 10%",
    desc: "Tối đa 100k",
    type: "percent",
    value: 0.1,
    max: 100_000,
  },
  {
    code: "NEWBIE",
    icon: "ti-gift",
    discount: "-30% lần đầu",
    desc: "Khách mới",
    type: "percent",
    value: 0.3,
    max: 150_000,
  },
];

// ──────────────────────────────────────────────────────────
// POLICIES
// ──────────────────────────────────────────────────────────
export type PolicyTagVariant = "green" | "amber" | "red";

export type Policy = {
  icon: string;
  title: string;
  desc: string;
  tagLabel: string;
  tagVariant: PolicyTagVariant;
};

export const POLICIES: Policy[] = [
  {
    icon: "clock-cancel",
    title: "Huỷ vé",
    desc: "Hoàn 80% nếu huỷ trước 24h khởi hành. Hoàn 50% nếu huỷ trước 6h.",
    tagLabel: "Linh hoạt",
    tagVariant: "green",
  },
  {
    icon: "clock-edit",
    title: "Đổi vé",
    desc: "Đổi ngày / giờ miễn phí 1 lần, thực hiện trước 12h khởi hành.",
    tagLabel: "1 lần",
    tagVariant: "amber",
  },
  {
    icon: "backpack",
    title: "Hành lý",
    desc: "Miễn phí 1 kiện ≤ 20 kg và xách tay ≤ 7 kg. Kiện thêm 50.000đ / kiện.",
    tagLabel: "Miễn phí",
    tagVariant: "green",
  },
  {
    icon: "smoking-no",
    title: "Nội quy xe",
    desc: "Không hút thuốc, không thực phẩm mùi nồng, lên xe đúng giờ.",
    tagLabel: "Bắt buộc",
    tagVariant: "red",
  },
];
