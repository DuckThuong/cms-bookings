// components/booking/BookingDetailDrawer.jsx
import React from 'react';
import { Drawer, Button, Tag, Divider } from 'antd';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { BOOKING_STATUSES, vehicles } from '../../../share/bookingManagement';

const formatMoney = (n?: string | number | null) => {
  if (n === undefined || n === null || n === "") {
    return "";
  }
  return (Number(String(n).replace(/,/g, "")) || 0).toLocaleString("en-US");
};

interface BookingDetailDrawerProps {
  booking: any;
  open: boolean;
  onClose: () => void;
  onConfirm: (booking: any) => void;
  onCancel: (booking: any) => void;
}
const BookingDetailDrawer = ({ booking, open, onClose, onConfirm, onCancel }: BookingDetailDrawerProps) => {
  if (!booking) return null;

  const status = BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES];
  const vehicle = vehicles.find((v) => v.id === booking.vehicleId);

  return (
    <Drawer
      className="booking-drawer"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#f97316' }}>
            {booking.id}
          </span>
          <span
            className="booking-status"
            style={{ background: status.bg, color: status.color }}
          >
            <span
              className="booking-status__dot"
              style={{ background: status.color }}
            />
            {status.label}
          </span>
        </div>
      }
      width={400}
      open={open}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {booking.status === 'pending' && (
            <Button
              className="btn-primary"
              icon={<CheckCircleOutlined />}
              onClick={() => onConfirm(booking)}
            >
              Xác nhận
            </Button>
          )}
          {['pending', 'confirmed'].includes(booking.status) && (
            <Button
              danger
              icon={<CloseCircleOutlined />}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                borderRadius: 8,
                fontWeight: 600,
              }}
              onClick={() => onCancel(booking)}
            >
              Huỷ vé
            </Button>
          )}
          <Button className="btn-ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
      styles={{ footer: { background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px' } }}
    >
      <div className="drawer-body">
        {/* Customer Info */}
        <div className="drawer-body__section">
          <div className="drawer-body__section-title">Thông tin khách hàng</div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Họ tên</span>
            <span className="drawer-body__val" style={{ color: '#f1f5f9', fontWeight: 600 }}>
              {booking.customer}
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">
              <PhoneOutlined style={{ marginRight: 4 }} />Số điện thoại
            </span>
            <span className="drawer-body__val" style={{ color: '#3b82f6' }}>
              {booking.phone}
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Đặt lúc</span>
            <span className="drawer-body__val">{booking.bookedAt}</span>
          </div>
        </div>

        {/* Journey */}
        <div className="drawer-body__section">
          <div className="drawer-body__section-title">Hành trình</div>
          <div className="journey-timeline">
            <div className="journey-timeline__line" />
            <div className="journey-timeline__point">
              <div className="journey-timeline__dot">🚉</div>
              <div className="journey-timeline__info">
                <div className="journey-timeline__label">Điểm đón</div>
                <div className="journey-timeline__place">{booking.pickup}</div>
                <div className="journey-timeline__time">
                  {booking.departure}
                </div>
              </div>
            </div>
            <div className="journey-timeline__point">
              <div className="journey-timeline__dot">📍</div>
              <div className="journey-timeline__info">
                <div className="journey-timeline__label">Điểm trả</div>
                <div className="journey-timeline__place">{booking.dropoff}</div>
                <div className="journey-timeline__time">
                  {booking.arrival}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Seats */}
        <div className="drawer-body__section">
          <div className="drawer-body__section-title">Xe & Ghế ngồi</div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">
              <CarOutlined style={{ marginRight: 4 }} />Xe
            </span>
            <span className="drawer-body__val">
              {vehicle?.icon} {vehicle?.label} — {vehicle?.type}
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Ghế đã chọn</span>
            <div className="seat-badges">
              {booking.seats.map((s: string | number | null | undefined) => (
                <span key={s as string} className="seat-badge">{s as string}</span>
              ))}
            </div>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Số ghế</span>
            <span className="drawer-body__val">{booking.seatCount} ghế</span>
          </div>
        </div>

        {/* Payment */}
        <div className="drawer-body__section">
          <div className="drawer-body__section-title">Thanh toán</div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Tổng tiền</span>
            <span
              className="drawer-body__val"
              style={{ color: '#22c55e', fontSize: 16, fontWeight: 700 }}
            >
              {formatMoney(booking.amount)}
            </span>
          </div>
        </div>

        {/* Note */}
        {booking.note && (
          <div className="drawer-body__section">
            <div className="drawer-body__section-title">Ghi chú</div>
            <div
              style={{
                background: 'rgba(234,179,8,0.08)',
                border: '1px solid rgba(234,179,8,0.2)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: '#eab308',
              }}
            >
              {booking.note}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default BookingDetailDrawer;