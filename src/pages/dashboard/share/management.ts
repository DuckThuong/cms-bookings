import type { FilterOption, StatusMeta, SummaryItem } from './types';

export type CustomerTrip = {
  id: string;
  route: string;
  date: string;
  amount: number;
  status: string;
};

export type CustomerRecord = {
  key: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'vip' | 'than-thiet' | 'pho-thong';
  bookingCount: number;
  totalSpent: number;
  lastBooking: string;
  preferredRoute: string;
  status: 'active' | 'at-risk' | 'inactive';
  note: string;
  recentTrips: CustomerTrip[];
};

export type DriverRecord = {
  key: string;
  id: string;
  name: string;
  phone: string;
  license: 'B2' | 'C' | 'D' | 'E';
  assignedVehicle: string;
  mainRoute: string;
  tripCount: number;
  rating: number;
  status: 'available' | 'on-trip' | 'off-duty' | 'leave';
  shift: string;
  note: string;
};

export type RevenueTrendRecord = {
  period: string;
  revenue: number;
  bookings: number;
};

export type RevenueRouteRecord = {
  key: string;
  route: string;
  vehicle: string;
  bookings: number;
  revenue: number;
  growth: number;
};

export type RevenueTransactionRecord = {
  key: string;
  id: string;
  route: string;
  vehicle: string;
  createdAt: string;
  bookings: number;
  revenue: number;
  status: 'settled' | 'processing' | 'refunded';
};

export type ReportRecord = {
  key: string;
  id: string;
  name: string;
  type: 'operations' | 'finance' | 'customer' | 'compliance';
  period: string;
  createdBy: string;
  createdAt: string;
  status: 'ready' | 'processing' | 'scheduled';
  fileSize: string;
  description: string;
};

export const CUSTOMER_STATUS_META: Record<CustomerRecord['status'], StatusMeta> = {
  active: { label: 'Đang hoạt động', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'at-risk': { label: 'Cần chăm sóc', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  inactive: { label: 'Ngừng giao dịch', color: '#64748b', bg: 'rgba(100,116,139,0.14)' },
};

export const DRIVER_STATUS_META: Record<DriverRecord['status'], StatusMeta> = {
  available: { label: 'Sẵn sàng', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'on-trip': { label: 'Đang chạy tuyến', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'off-duty': { label: 'Ngoài ca', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  leave: { label: 'Nghỉ phép', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
};

export const REVENUE_STATUS_META: Record<RevenueTransactionRecord['status'], StatusMeta> = {
  settled: { label: 'Đã đối soát', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  processing: { label: 'Đang xử lý', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  refunded: { label: 'Hoàn tiền', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

export const REPORT_STATUS_META: Record<ReportRecord['status'], StatusMeta> = {
  ready: { label: 'Sẵn sàng', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  processing: { label: 'Đang tạo', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  scheduled: { label: 'Lên lịch', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

export const customerTierOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả hạng' },
  { value: 'vip', label: 'VIP' },
  { value: 'than-thiet', label: 'Thân thiết' },
  { value: 'pho-thong', label: 'Phổ thông' },
];

export const customerStatusOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'at-risk', label: 'Cần chăm sóc' },
  { value: 'inactive', label: 'Ngừng giao dịch' },
];

export const driverLicenseOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả bằng lái' },
  { value: 'B2', label: 'B2' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
];

export const driverStatusOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'available', label: 'Sẵn sàng' },
  { value: 'on-trip', label: 'Đang chạy tuyến' },
  { value: 'off-duty', label: 'Ngoài ca' },
  { value: 'leave', label: 'Nghỉ phép' },
];

export const driverShiftOptions: FilterOption[] = [
  { value: 'Ca sáng', label: 'Ca sáng' },
  { value: 'Ca chiều', label: 'Ca chiều' },
  { value: 'Ca đêm', label: 'Ca đêm' },
  { value: 'Ca linh hoạt', label: 'Ca linh hoạt' },
];

export const routeOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả tuyến' },
  { value: 'HCM → Đà Lạt', label: 'HCM → Đà Lạt' },
  { value: 'HCM → Nha Trang', label: 'HCM → Nha Trang' },
  { value: 'HCM → Cần Thơ', label: 'HCM → Cần Thơ' },
  { value: 'HCM → Hà Nội', label: 'HCM → Hà Nội' },
];

export const vehicleOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả phương tiện' },
  { value: '51B-123.45', label: '51B-123.45' },
  { value: '51B-456.78', label: '51B-456.78' },
  { value: '51B-789.01', label: '51B-789.01' },
  { value: '51B-234.56', label: '51B-234.56' },
];

export const reportTypeOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả loại báo cáo' },
  { value: 'operations', label: 'Vận hành' },
  { value: 'finance', label: 'Tài chính' },
  { value: 'customer', label: 'Khách hàng' },
  { value: 'compliance', label: 'Tuân thủ' },
];

export const reportStatusOptions: FilterOption[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ready', label: 'Sẵn sàng' },
  { value: 'processing', label: 'Đang tạo' },
  { value: 'scheduled', label: 'Lên lịch' },
];

export const customers: CustomerRecord[] = [
  {
    key: 'cus-01',
    id: 'CUS-1001',
    name: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'an.nguyen@example.com',
    tier: 'vip',
    bookingCount: 28,
    totalSpent: 18650000,
    lastBooking: '2026-05-18 10:22',
    preferredRoute: 'HCM → Đà Lạt',
    status: 'active',
    note: 'Ưu tiên ghế đầu, thường đi cuối tuần.',
    recentTrips: [
      { id: '#BK-20501', route: 'HCM → Đà Lạt', date: '2026-05-18', amount: 460000, status: 'completed' },
      { id: '#BK-20444', route: 'HCM → Nha Trang', date: '2026-05-02', amount: 920000, status: 'completed' },
    ],
  },
  {
    key: 'cus-02',
    id: 'CUS-1002',
    name: 'Trần Thị Bảo',
    phone: '0912345678',
    email: 'bao.tran@example.com',
    tier: 'than-thiet',
    bookingCount: 17,
    totalSpent: 9420000,
    lastBooking: '2026-05-17 15:40',
    preferredRoute: 'HCM → Đà Lạt',
    status: 'active',
    note: 'Có nhu cầu hỗ trợ hành lý.',
    recentTrips: [
      { id: '#BK-20502', route: 'HCM → Đà Lạt', date: '2026-05-17', amount: 230000, status: 'confirmed' },
      { id: '#BK-20411', route: 'HCM → Vũng Tàu', date: '2026-04-21', amount: 390000, status: 'completed' },
    ],
  },
  {
    key: 'cus-03',
    id: 'CUS-1003',
    name: 'Lê Minh Cường',
    phone: '0923456789',
    email: 'cuong.le@example.com',
    tier: 'vip',
    bookingCount: 34,
    totalSpent: 24100000,
    lastBooking: '2026-05-15 09:10',
    preferredRoute: 'HCM → Nha Trang',
    status: 'active',
    note: 'Thường book nhóm 3-4 ghế.',
    recentTrips: [
      { id: '#BK-20503', route: 'HCM → Nha Trang', date: '2026-05-15', amount: 1400000, status: 'moving' },
      { id: '#BK-20398', route: 'HCM → Hà Nội', date: '2026-04-18', amount: 3200000, status: 'completed' },
    ],
  },
  {
    key: 'cus-04',
    id: 'CUS-1004',
    name: 'Phạm Thu Dung',
    phone: '0934567890',
    email: 'dung.pham@example.com',
    tier: 'than-thiet',
    bookingCount: 12,
    totalSpent: 8840000,
    lastBooking: '2026-05-14 11:30',
    preferredRoute: 'HCM → Hà Nội',
    status: 'at-risk',
    note: 'Đã 2 lần phản hồi trễ đón.',
    recentTrips: [
      { id: '#BK-20504', route: 'HCM → Hà Nội', date: '2026-05-14', amount: 1200000, status: 'moving' },
      { id: '#BK-20356', route: 'HCM → Đà Nẵng', date: '2026-03-28', amount: 900000, status: 'completed' },
    ],
  },
  {
    key: 'cus-05',
    id: 'CUS-1005',
    name: 'Hoàng Văn Em',
    phone: '0945678901',
    email: 'em.hoang@example.com',
    tier: 'pho-thong',
    bookingCount: 6,
    totalSpent: 2120000,
    lastBooking: '2026-05-19 08:00',
    preferredRoute: 'HCM → Vũng Tàu',
    status: 'active',
    note: '',
    recentTrips: [
      { id: '#BK-20505', route: 'HCM → Vũng Tàu', date: '2026-05-19', amount: 390000, status: 'pending' },
      { id: '#BK-20294', route: 'HCM → Mũi Né', date: '2026-02-15', amount: 180000, status: 'cancelled' },
    ],
  },
  {
    key: 'cus-06',
    id: 'CUS-1006',
    name: 'Vũ Thị Phương',
    phone: '0956789012',
    email: 'phuong.vu@example.com',
    tier: 'pho-thong',
    bookingCount: 3,
    totalSpent: 890000,
    lastBooking: '2026-01-08 09:15',
    preferredRoute: 'HCM → Đà Lạt',
    status: 'inactive',
    note: 'Không phát sinh booking trong 4 tháng gần đây.',
    recentTrips: [
      { id: '#BK-19988', route: 'HCM → Đà Lạt', date: '2026-01-08', amount: 230000, status: 'completed' },
    ],
  },
];

export const drivers: DriverRecord[] = [
  {
    key: 'drv-01',
    id: 'DRV-301',
    name: 'Nguyễn Quốc Huy',
    phone: '0903000111',
    license: 'E',
    assignedVehicle: '51B-123.45',
    mainRoute: 'HCM → Đà Lạt',
    tripCount: 42,
    rating: 4.9,
    status: 'available',
    shift: 'Ca sáng',
    note: 'Tài xế chủ lực tuyến Đà Lạt.',
  },
  {
    key: 'drv-02',
    id: 'DRV-302',
    name: 'Trần Văn Hậu',
    phone: '0903000222',
    license: 'D',
    assignedVehicle: '51B-456.78',
    mainRoute: 'HCM → Nha Trang',
    tripCount: 35,
    rating: 4.7,
    status: 'on-trip',
    shift: 'Ca đêm',
    note: 'Đang chạy chuyến đêm, ETA 05:30.',
  },
  {
    key: 'drv-03',
    id: 'DRV-303',
    name: 'Phạm Đức Long',
    phone: '0903000333',
    license: 'C',
    assignedVehicle: '51B-789.01',
    mainRoute: 'HCM → Hà Nội',
    tripCount: 29,
    rating: 4.8,
    status: 'on-trip',
    shift: 'Ca linh hoạt',
    note: 'Phối hợp 2 tài xế cho tuyến dài.',
  },
  {
    key: 'drv-04',
    id: 'DRV-304',
    name: 'Lý Minh Tâm',
    phone: '0903000444',
    license: 'B2',
    assignedVehicle: '51B-234.56',
    mainRoute: 'HCM → Cần Thơ',
    tripCount: 18,
    rating: 4.5,
    status: 'off-duty',
    shift: 'Ca chiều',
    note: 'Xe đang bảo dưỡng định kỳ.',
  },
  {
    key: 'drv-05',
    id: 'DRV-305',
    name: 'Đặng Thanh Bình',
    phone: '0903000555',
    license: 'D',
    assignedVehicle: '51B-567.89',
    mainRoute: 'HCM → Vũng Tàu',
    tripCount: 24,
    rating: 4.6,
    status: 'leave',
    shift: 'Ca sáng',
    note: 'Nghỉ phép đến 2026-05-22.',
  },
];

export const revenueTrend: RevenueTrendRecord[] = [
  { period: 'T1', revenue: 2800, bookings: 420 },
  { period: 'T2', revenue: 3200, bookings: 510 },
  { period: 'T3', revenue: 2950, bookings: 468 },
  { period: 'T4', revenue: 3880, bookings: 596 },
  { period: 'T5', revenue: 4320, bookings: 668 },
  { period: 'T6', revenue: 4100, bookings: 624 },
];

export const revenueByRoute: RevenueRouteRecord[] = [
  { key: 'rev-route-1', route: 'HCM → Đà Lạt', vehicle: '51B-123.45', bookings: 186, revenue: 42800000, growth: 14.2 },
  { key: 'rev-route-2', route: 'HCM → Nha Trang', vehicle: '51B-456.78', bookings: 154, revenue: 39100000, growth: 9.4 },
  { key: 'rev-route-3', route: 'HCM → Hà Nội', vehicle: '51B-789.01', bookings: 88, revenue: 51700000, growth: 17.8 },
  { key: 'rev-route-4', route: 'HCM → Cần Thơ', vehicle: '51B-234.56', bookings: 132, revenue: 22300000, growth: 6.1 },
];

export const revenueTransactions: RevenueTransactionRecord[] = [
  { key: 'txn-1', id: 'REV-5001', route: 'HCM → Đà Lạt', vehicle: '51B-123.45', createdAt: '2026-05-19 08:30', bookings: 24, revenue: 5520000, status: 'settled' },
  { key: 'txn-2', id: 'REV-5002', route: 'HCM → Nha Trang', vehicle: '51B-456.78', createdAt: '2026-05-19 10:15', bookings: 19, revenue: 6650000, status: 'processing' },
  { key: 'txn-3', id: 'REV-5003', route: 'HCM → Hà Nội', vehicle: '51B-789.01', createdAt: '2026-05-18 18:00', bookings: 12, revenue: 7200000, status: 'settled' },
  { key: 'txn-4', id: 'REV-5004', route: 'HCM → Vũng Tàu', vehicle: '51B-567.89', createdAt: '2026-05-18 12:45', bookings: 16, revenue: 2080000, status: 'refunded' },
];

export const reports: ReportRecord[] = [
  {
    key: 'rep-01',
    id: 'RPT-9001',
    name: 'Báo cáo hiệu suất tuyến tuần 20',
    type: 'operations',
    period: '13/05/2026 - 19/05/2026',
    createdBy: 'Điều phối vận hành',
    createdAt: '2026-05-19 09:00',
    status: 'ready',
    fileSize: '1.2 MB',
    description: 'Tổng hợp hiệu suất khai thác tuyến, tỷ lệ lấp đầy và độ đúng giờ.',
  },
  {
    key: 'rep-02',
    id: 'RPT-9002',
    name: 'Báo cáo doanh thu theo tuyến tháng 5',
    type: 'finance',
    period: '01/05/2026 - 19/05/2026',
    createdBy: 'Kế toán tổng hợp',
    createdAt: '2026-05-19 11:20',
    status: 'processing',
    fileSize: 'Đang tạo',
    description: 'Tổng hợp doanh thu, hoàn tiền và đối soát theo từng tuyến.',
  },
  {
    key: 'rep-03',
    id: 'RPT-9003',
    name: 'Danh sách khách hàng cần chăm sóc',
    type: 'customer',
    period: 'Tháng 05/2026',
    createdBy: 'CRM Lead',
    createdAt: '2026-05-18 16:40',
    status: 'ready',
    fileSize: '680 KB',
    description: 'Tập khách hàng có tần suất giảm và điểm hài lòng thấp.',
  },
  {
    key: 'rep-04',
    id: 'RPT-9004',
    name: 'Báo cáo tuân thủ bảo dưỡng xe',
    type: 'compliance',
    period: 'Quý 2/2026',
    createdBy: 'Quản lý đội xe',
    createdAt: '2026-05-20 06:00',
    status: 'scheduled',
    fileSize: 'Lên lịch 06:00',
    description: 'Theo dõi xe đến hạn bảo dưỡng và hồ sơ kiểm định.',
  },
];

export const getCustomerSummary = (data: CustomerRecord[]): SummaryItem[] => [
  { key: 'customers', label: 'Tổng khách', color: '#3b82f6', value: data.length },
  { key: 'vip', label: 'Khách VIP', color: '#f97316', value: data.filter((item) => item.tier === 'vip').length },
  { key: 'active', label: 'Đang hoạt động', color: '#22c55e', value: data.filter((item) => item.status === 'active').length },
  { key: 'spent', label: 'Tổng chi tiêu', color: '#eab308', value: data.reduce((sum, item) => sum + item.totalSpent, 0) },
];

export const getDriverSummary = (data: DriverRecord[]): SummaryItem[] => [
  { key: 'drivers', label: 'Tổng tài xế', color: '#3b82f6', value: data.length },
  { key: 'available', label: 'Sẵn sàng', color: '#22c55e', value: data.filter((item) => item.status === 'available').length },
  { key: 'on-trip', label: 'Đang chạy tuyến', color: '#f97316', value: data.filter((item) => item.status === 'on-trip').length },
  { key: 'e-license', label: 'Bằng E', color: '#a855f7', value: data.filter((item) => item.license === 'E').length },
];

export const getRevenueSummary = (data: RevenueTransactionRecord[]): SummaryItem[] => [
  { key: 'revenue', label: 'Doanh thu lọc', color: '#22c55e', value: data.reduce((sum, item) => sum + item.revenue, 0) },
  { key: 'bookings', label: 'Booking', color: '#3b82f6', value: data.reduce((sum, item) => sum + item.bookings, 0) },
  { key: 'settled', label: 'Đã đối soát', color: '#f97316', value: data.filter((item) => item.status === 'settled').length },
  { key: 'refunded', label: 'Hoàn tiền', color: '#ef4444', value: data.filter((item) => item.status === 'refunded').length },
];

export const getReportSummary = (data: ReportRecord[]): SummaryItem[] => [
  { key: 'reports', label: 'Tổng báo cáo', color: '#3b82f6', value: data.length },
  { key: 'ready', label: 'Sẵn sàng', color: '#22c55e', value: data.filter((item) => item.status === 'ready').length },
  { key: 'processing', label: 'Đang tạo', color: '#f97316', value: data.filter((item) => item.status === 'processing').length },
  { key: 'scheduled', label: 'Lên lịch', color: '#a855f7', value: data.filter((item) => item.status === 'scheduled').length },
];
