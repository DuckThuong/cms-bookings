export * from './types';
export * from './bookingManagement';
export * from './management';
export * from './operations';

export const CHART_COLORS = {
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',
  accent: '#f97316',
  textMuted: '#64748b',
  textSecondary: '#94a3b8',
  textPrimary: '#f1f5f9',
} as const;

export const STATUS_COLORS = {
  completed: CHART_COLORS.success,
  moving: CHART_COLORS.info,
  pending: CHART_COLORS.warning,
  cancelled: CHART_COLORS.error,
} as const;

export const statCards = [
  {
    key: 'users',
    label: 'Người dùng',
    value: '24,812',
    icon: '👤',
    iconClass: 'stat-card__icon--blue',
    trend: '+12.4%',
    trendDir: 'up',
    trendNote: 'so với tháng trước',
  },
  {
    key: 'providers',
    label: 'Nhà xe',
    value: '348',
    icon: '🚌',
    iconClass: 'stat-card__icon--orange',
    trend: '+5.2%',
    trendDir: 'up',
    trendNote: 'so với tháng trước',
  },
  {
    key: 'vehicles',
    label: 'Số lượng xe',
    value: '1,942',
    icon: '🚗',
    iconClass: 'stat-card__icon--yellow',
    trend: '+8.7%',
    trendDir: 'up',
    trendNote: 'so với tháng trước',
  },
  {
    key: 'revenue',
    label: 'Doanh thu',
    value: '₫4.28 tỷ',
    icon: '💰',
    iconClass: 'stat-card__icon--green',
    trend: '+18.3%',
    trendDir: 'up',
    trendNote: 'so với tháng trước',
  },
];

export const revenueData = [
  { month: 'T1', revenue: 2800, bookings: 420 },
  { month: 'T2', revenue: 3200, bookings: 510 },
  { month: 'T3', revenue: 2900, bookings: 460 },
  { month: 'T4', revenue: 3800, bookings: 590 },
  { month: 'T5', revenue: 4100, bookings: 640 },
  { month: 'T6', revenue: 3600, bookings: 570 },
  { month: 'T7', revenue: 4500, bookings: 720 },
  { month: 'T8', revenue: 4280, bookings: 685 },
  { month: 'T9', revenue: 3900, bookings: 610 },
  { month: 'T10', revenue: 5100, bookings: 820 },
  { month: 'T11', revenue: 4750, bookings: 760 },
  { month: 'T12', revenue: 6200, bookings: 980 },
];

export const bookingStatusData = [
  { name: 'Hoàn thành', value: 58, color: STATUS_COLORS.completed },
  { name: 'Đang di chuyển', value: 22, color: STATUS_COLORS.moving },
  { name: 'Chờ xác nhận', value: 12, color: STATUS_COLORS.pending },
  { name: 'Đã hủy', value: 8, color: STATUS_COLORS.cancelled },
];

export const vehicleTypeData = [
  { type: 'Xe khách', count: 720, color: CHART_COLORS.accent },
  { type: 'Xe limousine', count: 380, color: CHART_COLORS.info },
  { type: 'Xe giường nằm', count: 510, color: CHART_COLORS.success },
  { type: 'Xe du lịch', count: 332, color: CHART_COLORS.warning },
];

export const weeklyBookingData = [
  { day: 'T2', completed: 82, cancelled: 12 },
  { day: 'T3', completed: 95, cancelled: 8 },
  { day: 'T4', completed: 78, cancelled: 15 },
  { day: 'T5', completed: 110, cancelled: 10 },
  { day: 'T6', completed: 130, cancelled: 18 },
  { day: 'T7', completed: 155, cancelled: 22 },
  { day: 'CN', completed: 102, cancelled: 14 },
];

export const topProviders = [
  { rank: 1, name: 'Phương Trang (FUTA)', trips: 2840, revenue: '892tr', pct: 100 },
  { rank: 2, name: 'Thành Bưởi', trips: 2310, revenue: '721tr', pct: 81 },
  { rank: 3, name: 'Hoàng Long', trips: 1980, revenue: '618tr', pct: 69 },
  { rank: 4, name: 'Kumho Samco', trips: 1650, revenue: '512tr', pct: 57 },
  { rank: 5, name: 'The Sinh Tourist', trips: 1420, revenue: '441tr', pct: 49 },
];

export const recentBookings = [
  {
    key: '1',
    id: '#BK-20481',
    customer: 'Nguyễn Văn An',
    route: 'HCM → Đà Lạt',
    provider: 'Phương Trang',
    date: '19/05/2026',
    seats: 2,
    amount: '460,000₫',
    status: 'completed',
  },
  {
    key: '2',
    id: '#BK-20480',
    customer: 'Trần Thị Bảo',
    route: 'HN → Hải Phòng',
    provider: 'Hoàng Long',
    date: '19/05/2026',
    seats: 1,
    amount: '180,000₫',
    status: 'moving',
  },
  {
    key: '3',
    id: '#BK-20479',
    customer: 'Lê Minh Cường',
    route: 'ĐN → Huế',
    provider: 'Thành Bưởi',
    date: '18/05/2026',
    seats: 4,
    amount: '980,000₫',
    status: 'pending',
  },
  {
    key: '4',
    id: '#BK-20478',
    customer: 'Phạm Thu Dung',
    route: 'HCM → Nha Trang',
    provider: 'Kumho Samco',
    date: '18/05/2026',
    seats: 2,
    amount: '560,000₫',
    status: 'completed',
  },
  {
    key: '5',
    id: '#BK-20477',
    customer: 'Hoàng Văn Em',
    route: 'HN → Đà Nẵng',
    provider: 'The Sinh Tourist',
    date: '17/05/2026',
    seats: 3,
    amount: '1,050,000₫',
    status: 'cancelled',
  },
  {
    key: '6',
    id: '#BK-20476',
    customer: 'Vũ Thị Phương',
    route: 'HCM → Cần Thơ',
    provider: 'Phương Trang',
    date: '17/05/2026',
    seats: 1,
    amount: '210,000₫',
    status: 'completed',
  },
];

export const recentActivities = [
  { id: 1, name: 'Nguyễn Văn An', initials: 'NA', desc: 'Đặt vé HCM → Đà Lạt', time: '2 phút trước', dot: STATUS_COLORS.completed },
  { id: 2, name: 'Phương Trang (FUTA)', initials: 'PT', desc: 'Thêm 3 chuyến mới tuyến HCM - CT', time: '15 phút trước', dot: CHART_COLORS.accent },
  { id: 3, name: 'Trần Thị Bảo', initials: 'TB', desc: 'Hủy đặt vé #BK-20475', time: '28 phút trước', dot: STATUS_COLORS.cancelled },
  { id: 4, name: 'Kumho Samco', initials: 'KS', desc: 'Cập nhật giá vé tháng 6', time: '1 giờ trước', dot: STATUS_COLORS.moving },
  { id: 5, name: 'Lê Minh Cường', initials: 'LC', desc: 'Đăng ký tài khoản mới', time: '2 giờ trước', dot: STATUS_COLORS.pending },
];
