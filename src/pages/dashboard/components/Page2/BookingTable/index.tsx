// components/booking/BookingTable.jsx
import React from 'react';
import { Table, Tooltip, Modal } from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { BOOKING_STATUSES, vehicles } from '../../../share/bookingManagement';

const formatMoney = (n?: string | number | null) => {
  if (n === undefined || n === null || n === "") {
    return "";
  }
  return (Number(String(n).replace(/,/g, "")) || 0).toLocaleString("en-US");
};
interface BookingTableProps {
  data: any[];
  onView: (record: any) => void;
  onConfirm: (record: any) => void;
  onCancel: (record: any) => void;
  loading: boolean;
}
const BookingTable = ({ data, onView, onConfirm, onCancel, loading }: BookingTableProps) => {
  const columns = [
    {
      title: 'Mã đặt vé',
      dataIndex: 'id',
      key: 'id',
      width: 110,
      render: (id: string) => (
        <span style={{ color: '#f97316', fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>
          {id}
        </span>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 190,
      render: (_: any, r: any) => (
        <div className="cust-cell">
          <div className="cust-cell__avatar">
            {r.customer.charAt(0)}
          </div>
          <div>
            <div className="cust-cell__name">{r.customer}</div>
            <div className="cust-cell__phone">{r.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tuyến / Giờ đi',
      key: 'route',
      width: 200,
      render: (_: any, r: any) => (
        <div className="route-cell">
          <div className="route-cell__line">
            {r.route.split('→')[0].trim()}
            <span className="arrow">▶</span>
            {r.route.split('→')[1].trim()}
          </div>
          <div className="route-cell__time">{r.departure}</div>
        </div>
      ),
    },
    {
      title: 'Xe',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
      width: 140,
      render: (vId: string) => {
        const v = vehicles.find((x) => x.id === vId);
        return v ? (
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {v.icon} {v.label}
          </span>
        ) : '—';
      },
    },
    {
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      width: 120,
      render: (seats: string[]) => (
        <div className="seat-badges">
          {seats.slice(0, 4).map((s: string) => (
            <span key={s} className="seat-badge">{s}</span>
          ))}
          {seats.length > 4 && (
            <span className="seat-badge" style={{ color: '#f97316' }}>
              +{seats.length - 4}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Tiền vé',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (v: number | string | null | undefined) => <span className="amount-cell">{formatMoney(v)}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => {
        const s = BOOKING_STATUSES[status as keyof typeof BOOKING_STATUSES];
        if (!s) return null;
        return (
          <span
            className="booking-status"
            style={{ background: s.bg, color: s.color }}
          >
            <span className="booking-status__dot" style={{ background: s.color }} />
            {s.label}
          </span>
        );
      },
    },
    {
      title: 'Đặt lúc',
      dataIndex: 'bookedAt',
      key: 'bookedAt',
      width: 130,
      render: (t: string) => (
        <span style={{ fontSize: 11, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
          {t}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="row-actions">
          <Tooltip title="Xem chi tiết">
            <button title="Xem chi tiết" onClick={() => onView(record)}>
              <EyeOutlined />
            </button>
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Xác nhận">
              <button
                title="Xác nhận"
                onClick={(e) => { e.stopPropagation(); onConfirm(record); }}
                style={{ borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }}
              >
                <CheckOutlined />
              </button>
            </Tooltip>
          )}
          {['pending', 'confirmed'].includes(record.status) && (
            <Tooltip title="Huỷ vé">
              <button
                title="Huỷ vé"
                className="danger"
                onClick={(e) => { e.stopPropagation(); onCancel(record); }}
              >
                <CloseOutlined />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bm-table-wrap bm-table">
      <Table
        columns={columns as any[]}
        dataSource={data as any[]}
        loading={loading}
        rowKey="key"
        scroll={{ x: 1100 }}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ['8', '15', '30'],
          showTotal: (total: number, range: [number, number]) => (
            <span style={{ color: '#64748b', fontSize: 12 }}>
              {range[0]}-{range[1]} / {total} bản ghi
            </span>
          ),
        }}
        onRow={(record: any) => ({
          onClick: () => onView(record),
        })}
      />
    </div>
  );
};

export default BookingTable;