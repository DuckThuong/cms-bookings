import type { StatusMeta, SummaryItem } from './types';

export type BookingStatusKey =
  | 'confirmed'
  | 'moving'
  | 'completed'
  | 'cancelled'
  | 'pending'
  | 'no_show';

export type VehicleRecord = {
  id: string;
  label: string;
  icon: string;
  count: number;
  type?: string;
  status?: 'active' | 'maintenance';
};

export type BookingRecord = {
  key: string;
  id: string;
  vehicleId: string;
  customer: string;
  phone: string;
  route: string;
  departure: string;
  arrival: string;
  seats: string[];
  seatCount: number;
  amount: number;
  status: BookingStatusKey;
  bookedAt: string;
  note: string;
  pickup: string;
  dropoff: string;
};

export const vehicles: VehicleRecord[] = [
  { id: 'all', label: 'Tất cả xe', icon: '🚌', count: 142 },
  { id: 'v001', label: '51B-123.45', icon: '🚌', type: 'Xe khách 45 chỗ', count: 38, status: 'active' },
  { id: 'v002', label: '51B-456.78', icon: '🚐', type: 'Xe limousine 16 chỗ', count: 27, status: 'active' },
  { id: 'v003', label: '51B-789.01', icon: '🛏️', type: 'Xe giường nằm 34 chỗ', count: 31, status: 'active' },
  { id: 'v004', label: '51B-234.56', icon: '🚌', type: 'Xe khách 45 chỗ', count: 22, status: 'maintenance' },
  { id: 'v005', label: '51B-567.89', icon: '🚐', type: 'Xe limousine 9 chỗ', count: 24, status: 'active' },
];

export const BOOKING_STATUSES: Record<BookingStatusKey, StatusMeta> = {
  confirmed: { label: 'Đã xác nhận', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  moving: { label: 'Đang di chuyển', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  completed: { label: 'Hoàn thành', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  cancelled: { label: 'Đã hủy', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  pending: { label: 'Chờ xác nhận', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  no_show: { label: 'Không lên xe', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};

export const bookings: BookingRecord[] = [
  {
    key: 'bk001',
    id: '#BK-20501',
    vehicleId: 'v001',
    customer: 'Nguyễn Văn An',
    phone: '0901234567',
    route: 'HCM → Đà Lạt',
    departure: '2026-05-20 07:00',
    arrival: '2026-05-20 14:30',
    seats: ['A1', 'A2'],
    seatCount: 2,
    amount: 460000,
    status: 'confirmed',
    bookedAt: '2026-05-18 10:22',
    note: '',
    pickup: 'Bến xe Miền Đông',
    dropoff: 'Bến xe Đà Lạt',
  },
  {
    key: 'bk002',
    id: '#BK-20502',
    vehicleId: 'v001',
    customer: 'Trần Thị Bảo',
    phone: '0912345678',
    route: 'HCM → Đà Lạt',
    departure: '2026-05-20 07:00',
    arrival: '2026-05-20 14:30',
    seats: ['B3'],
    seatCount: 1,
    amount: 230000,
    status: 'confirmed',
    bookedAt: '2026-05-17 15:40',
    note: 'Cần hỗ trợ hành lý',
    pickup: 'Bến xe Miền Đông',
    dropoff: 'Đà Lạt - Hòa Bình',
  },
  {
    key: 'bk003',
    id: '#BK-20503',
    vehicleId: 'v002',
    customer: 'Lê Minh Cường',
    phone: '0923456789',
    route: 'HCM → Nha Trang',
    departure: '2026-05-19 22:00',
    arrival: '2026-05-20 05:30',
    seats: ['L1', 'L2', 'L3', 'L4'],
    seatCount: 4,
    amount: 1400000,
    status: 'moving',
    bookedAt: '2026-05-15 09:10',
    note: '',
    pickup: 'Văn phòng Q1',
    dropoff: 'Nha Trang - Trần Phú',
  },
  {
    key: 'bk004',
    id: '#BK-20504',
    vehicleId: 'v003',
    customer: 'Phạm Thu Dung',
    phone: '0934567890',
    route: 'HCM → Hà Nội',
    departure: '2026-05-19 18:00',
    arrival: '2026-05-20 18:00',
    seats: ['G7', 'G8'],
    seatCount: 2,
    amount: 1200000,
    status: 'moving',
    bookedAt: '2026-05-14 11:30',
    note: 'VIP - gọi trước 30 phút',
    pickup: 'Văn phòng Q3',
    dropoff: 'Bến xe Giáp Bát',
  },
  {
    key: 'bk005',
    id: '#BK-20505',
    vehicleId: 'v005',
    customer: 'Hoàng Văn Em',
    phone: '0945678901',
    route: 'HCM → Vũng Tàu',
    departure: '2026-05-21 08:00',
    arrival: '2026-05-21 10:30',
    seats: ['A1', 'A2', 'A3'],
    seatCount: 3,
    amount: 390000,
    status: 'pending',
    bookedAt: '2026-05-19 08:00',
    note: '',
    pickup: 'Văn phòng Q7',
    dropoff: 'Vũng Tàu - Bãi Trước',
  },
  {
    key: 'bk006',
    id: '#BK-20506',
    vehicleId: 'v001',
    customer: 'Vũ Thị Phương',
    phone: '0956789012',
    route: 'HCM → Đà Lạt',
    departure: '2026-05-22 07:00',
    arrival: '2026-05-22 14:30',
    seats: ['C1'],
    seatCount: 1,
    amount: 230000,
    status: 'pending',
    bookedAt: '2026-05-19 09:15',
    note: '',
    pickup: 'Bến xe Miền Đông',
    dropoff: 'Bến xe Đà Lạt',
  },
  {
    key: 'bk007',
    id: '#BK-20507',
    vehicleId: 'v002',
    customer: 'Đỗ Quang Hùng',
    phone: '0967890123',
    route: 'HCM → Cần Thơ',
    departure: '2026-05-18 06:30',
    arrival: '2026-05-18 10:00',
    seats: ['L5', 'L6'],
    seatCount: 2,
    amount: 420000,
    status: 'completed',
    bookedAt: '2026-05-16 14:20',
    note: '',
    pickup: 'Văn phòng Q1',
    dropoff: 'Bến xe Cần Thơ',
  },
  {
    key: 'bk008',
    id: '#BK-20508',
    vehicleId: 'v003',
    customer: 'Bùi Thị Hoa',
    phone: '0978901234',
    route: 'HCM → Đà Nẵng',
    departure: '2026-05-18 20:00',
    arrival: '2026-05-19 11:00',
    seats: ['G1', 'G2'],
    seatCount: 2,
    amount: 900000,
    status: 'completed',
    bookedAt: '2026-05-15 16:00',
    note: '',
    pickup: 'Bến xe Miền Đông',
    dropoff: 'Bến xe Đà Nẵng',
  },
  {
    key: 'bk009',
    id: '#BK-20509',
    vehicleId: 'v005',
    customer: 'Ngô Thành Kỳ',
    phone: '0989012345',
    route: 'HCM → Mũi Né',
    departure: '2026-05-17 07:00',
    arrival: '2026-05-17 12:00',
    seats: ['A4'],
    seatCount: 1,
    amount: 180000,
    status: 'cancelled',
    bookedAt: '2026-05-16 10:00',
    note: 'Khách hủy vì bận việc',
    pickup: 'Văn phòng Q7',
    dropoff: 'Mũi Né Resort',
  },
  {
    key: 'bk010',
    id: '#BK-20510',
    vehicleId: 'v001',
    customer: 'Lý Thị Lan',
    phone: '0990123456',
    route: 'HCM → Đà Lạt',
    departure: '2026-05-21 07:00',
    arrival: '2026-05-21 14:30',
    seats: ['D1', 'D2', 'D3'],
    seatCount: 3,
    amount: 690000,
    status: 'confirmed',
    bookedAt: '2026-05-18 20:00',
    note: 'Đoàn gia đình',
    pickup: 'Bến xe Miền Đông',
    dropoff: 'Đà Lạt - Hòa Bình',
  },
  {
    key: 'bk011',
    id: '#BK-20511',
    vehicleId: 'v004',
    customer: 'Trần Văn Minh',
    phone: '0901111222',
    route: 'HCM → Phan Thiết',
    departure: '2026-05-20 09:00',
    arrival: '2026-05-20 13:00',
    seats: ['B1', 'B2'],
    seatCount: 2,
    amount: 340000,
    status: 'confirmed',
    bookedAt: '2026-05-18 07:00',
    note: '',
    pickup: 'Bến xe Miền Đông',
    dropoff: 'Phan Thiết - TT',
  },
  {
    key: 'bk012',
    id: '#BK-20512',
    vehicleId: 'v002',
    customer: 'Phạm Ngọc Nam',
    phone: '0912222333',
    route: 'HCM → Đà Lạt',
    departure: '2026-05-23 08:00',
    arrival: '2026-05-23 15:00',
    seats: ['L7'],
    seatCount: 1,
    amount: 280000,
    status: 'pending',
    bookedAt: '2026-05-19 11:30',
    note: '',
    pickup: 'Văn phòng Q1',
    dropoff: 'Bến xe Đà Lạt',
  },
];

export const bookingSummary = {
  total: 142,
  confirmed: 48,
  moving: 12,
  completed: 63,
  cancelled: 11,
  pending: 8,
};

export const seatMap = {
  v001: {
    type: 'Xe khách 45 chỗ',
    rows: 9,
    cols: 5,
    layout: 'bus',
    seats: [
      'A1', 'A2', 'A3', 'A4', 'A5',
      'B1', 'B2', 'B3', 'B4', 'B5',
      'C1', 'C2', 'C3', 'C4', 'C5',
      'D1', 'D2', 'D3', 'D4', 'D5',
      'E1', 'E2', 'E3', 'E4', 'E5',
      'F1', 'F2', 'F3', 'F4', 'F5',
      'G1', 'G2', 'G3', 'G4', 'G5',
      'H1', 'H2', 'H3', 'H4', 'H5',
      'I1', 'I2', 'I3', 'I4', 'I5',
    ],
    booked: ['A1', 'A2', 'B3', 'C1', 'D1', 'D2', 'D3'],
    selected: [] as string[],
  },
};

export const getBookingStatusTabs = (data: BookingRecord[]) => [
  { key: 'all', label: 'Tất cả', color: '#94a3b8', count: data.length },
  ...Object.entries(BOOKING_STATUSES).map(([key, meta]) => ({
    key,
    label: meta.label,
    color: meta.color,
    count: data.filter((item) => item.status === key).length,
  })),
];

export const getBookingSummaryItems = (data: BookingRecord[]): SummaryItem[] => [
  { key: 'confirmed', label: 'Đã xác nhận', color: BOOKING_STATUSES.confirmed.color, value: data.filter((item) => item.status === 'confirmed').length },
  { key: 'moving', label: 'Đang chạy', color: BOOKING_STATUSES.moving.color, value: data.filter((item) => item.status === 'moving').length },
  { key: 'completed', label: 'Hoàn thành', color: BOOKING_STATUSES.completed.color, value: data.filter((item) => item.status === 'completed').length },
  { key: 'cancelled', label: 'Đã hủy', color: BOOKING_STATUSES.cancelled.color, value: data.filter((item) => item.status === 'cancelled').length },
  { key: 'pending', label: 'Chờ xác nhận', color: BOOKING_STATUSES.pending.color, value: data.filter((item) => item.status === 'pending').length },
];
