import React from 'react';
import { Drawer, Button, Divider, Tag } from 'antd';
import {
  PhoneOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  REFUND_STATUSES,
  REFUND_POLICY,
  type RefundRecord,
  type RefundStatusKey,
} from '../../share/bookingManagement';

const formatMoney = (n?: string | number | null) => {
  if (n === undefined || n === null || n === '') {
    return '';
  }
  return (Number(String(n).replace(/,/g, '')) || 0).toLocaleString('vi-VN');
};

interface RefundDetailDrawerProps {
  refund: RefundRecord | null;
  open: boolean;
  onClose: () => void;
  onApprove: (refund: RefundRecord) => void;
  onReject: (refund: RefundRecord) => void;
}

const RefundDetailDrawer: React.FC<RefundDetailDrawerProps> = ({
  refund,
  open,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!refund) return null;

  const statusMeta = REFUND_STATUSES[refund.status as RefundStatusKey];

  const getRefundPolicyLabel = (percentage: number): string => {
    if (percentage === 80) return REFUND_POLICY.BEFORE_24H.label;
    if (percentage === 50) return REFUND_POLICY.BEFORE_6H.label;
    return REFUND_POLICY.UNDER_6H.label;
  };

  return (
    <Drawer
      className="refund-drawer"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#f97316' }}>
            {refund.refundCode}
          </span>
          <span
            className="booking-status"
            style={{ background: statusMeta.bg, color: statusMeta.color }}
          >
            <span className="booking-status__dot" style={{ background: statusMeta.color }} />
            {statusMeta.label}
          </span>
        </div>
      }
      width={420}
      open={open}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {refund.status === 'pending' && (
            <>
              <Button
                className="btn-danger-outline"
                icon={<CloseCircleOutlined />}
                onClick={() => onReject(refund)}
              >
                Từ chối
              </Button>
              <Button
                className="btn-primary"
                icon={<CheckCircleOutlined />}
                onClick={() => onApprove(refund)}
              >
                Duyệt hoàn tiền
              </Button>
            </>
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
              {refund.customer}
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">
              <PhoneOutlined style={{ marginRight: 4 }} />Số điện thoại
            </span>
            <span className="drawer-body__val" style={{ color: '#3b82f6' }}>
              {refund.phone}
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Yêu cầu lúc</span>
            <span className="drawer-body__val">{refund.requestedAt}</span>
          </div>
        </div>

        {/* Booking Info */}
        <div className="drawer-body__section">
          <div className="drawer-body__section-title">Thông tin đặt vé</div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Mã đặt vé</span>
            <span className="drawer-body__val" style={{ fontFamily: 'monospace' }}>
              {refund.bookingCode}
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Mã vé</span>
            <span className="drawer-body__val" style={{ fontFamily: 'monospace' }}>
              {refund.ticketCode}
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Tuyến</span>
            <span className="drawer-body__val">{refund.route}</span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">
              <ClockCircleOutlined style={{ marginRight: 4 }} />Giờ khởi hành
            </span>
            <span className="drawer-body__val">{refund.departure}</span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">
              <CarOutlined style={{ marginRight: 4 }} />Ghế đã đặt
            </span>
            <div className="seat-badges">
              {refund.seats.map((seat) => (
                <span key={seat} className="seat-badge">{seat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Refund Amount */}
        <div className="drawer-body__section">
          <div className="drawer-body__section-title">Chi tiết hoàn tiền</div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Số tiền đã thanh toán</span>
            <span className="drawer-body__val">
              {formatMoney(refund.paidAmount)}đ
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Phí hoàn tiền</span>
            <Tag color={refund.refundPercentage >= 50 ? 'green' : 'orange'}>
              {getRefundPolicyLabel(refund.refundPercentage)}
            </Tag>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Số tiền hoàn</span>
            <span
              className="drawer-body__val"
              style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}
            >
              {formatMoney(refund.refundAmount)}đ
            </span>
          </div>
          <div className="drawer-body__row">
            <span className="drawer-body__key">Tỷ lệ hoàn</span>
            <span className="drawer-body__val">{refund.refundPercentage}%</span>
          </div>
        </div>

        {/* Reason */}
        {refund.reason && (
          <div className="drawer-body__section">
            <div className="drawer-body__section-title">Lý do hủy vé</div>
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
              {refund.reason}
            </div>
          </div>
        )}

        {/* Refund Policy Info */}
        <div className="drawer-body__section">
          <div className="drawer-body__section-title">Chính sách hoàn tiền</div>
          <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
            <div>• Hoàn 80% nếu hủy trước 24 giờ</div>
            <div>• Hoàn 50% nếu hủy trước 6 giờ</div>
            <div>• Không hoàn nếu hủy dưới 6 giờ</div>
          </div>
        </div>

        {/* Processing Time */}
        {refund.status === 'approved' && (
          <div className="drawer-body__section">
            <div className="drawer-body__section-title">Thông tin xử lý</div>
            <div className="drawer-body__row">
              <span className="drawer-body__key">Ngày duyệt</span>
              <span className="drawer-body__val">{refund.processedAt ?? '—'}</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
              Thời gian xử lý hoàn tiền: 3-5 ngày làm việc
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default RefundDetailDrawer;
