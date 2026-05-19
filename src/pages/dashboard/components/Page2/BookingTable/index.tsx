import React from 'react';
import { Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import {
  BOOKING_STATUSES,
  vehicles,
  type BookingRecord,
} from '../../../share/bookingManagement';

const formatMoney = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  return (Number(String(value).replace(/,/g, '')) || 0).toLocaleString('vi-VN');
};

interface BookingTableProps {
  data: BookingRecord[];
  onView: (record: BookingRecord) => void;
  onConfirm: (record: BookingRecord) => void;
  onCancel: (record: BookingRecord) => void;
  loading: boolean;
}

const BookingTable = ({ data, onView, onConfirm, onCancel, loading }: BookingTableProps) => {
  const columns: ColumnsType<BookingRecord> = [
    {
      title: 'Mã đặt vé',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span style={{ color: '#f97316', fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>
          {id}
        </span>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div className="cust-cell">
          <div className="cust-cell__avatar">{record.customer.charAt(0)}</div>
          <div>
            <div className="cust-cell__name">{record.customer}</div>
            <div className="cust-cell__phone">{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tuyến / giờ đi',
      key: 'route',
      render: (_, record) => (
        <div className="route-cell">
          <div className="route-cell__line">{record.route}</div>
          <div className="route-cell__time">{record.departure}</div>
        </div>
      ),
    },
    {
      title: 'Xe',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
      render: (vehicleId: string) => {
        const vehicle = vehicles.find((item) => item.id === vehicleId);
        return vehicle ? (
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {vehicle.icon} {vehicle.label}
          </span>
        ) : (
          '—'
        );
      },
    },
    {
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats: string[]) => (
        <div className="seat-badges">
          {seats.slice(0, 4).map((seat) => (
            <span key={seat} className="seat-badge">
              {seat}
            </span>
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
      render: (value) => <span className="amount-cell">{formatMoney(value)}₫</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: BookingRecord['status']) => {
        const meta = BOOKING_STATUSES[status];
        return (
          <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
            <span className="booking-status__dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
        );
      },
    },
    {
      title: 'Đặt lúc',
      dataIndex: 'bookedAt',
      key: 'bookedAt',
      render: (bookedAt: string) => (
        <span style={{ fontSize: 11, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
          {bookedAt}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <div className="row-actions">
          <Tooltip title="Xem chi tiết">
            <button type="button" title="Xem chi tiết" onClick={() => onView(record)}>
              <EyeOutlined />
            </button>
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Xác nhận">
              <button
                type="button"
                title="Xác nhận"
                onClick={(event) => {
                  event.stopPropagation();
                  onConfirm(record);
                }}
                style={{ borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }}
              >
                <CheckOutlined />
              </button>
            </Tooltip>
          )}
          {['pending', 'confirmed'].includes(record.status) && (
            <Tooltip title="Hủy vé">
              <button
                type="button"
                title="Hủy vé"
                className="danger"
                onClick={(event) => {
                  event.stopPropagation();
                  onCancel(record);
                }}
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
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="key"
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ['8', '15', '30'],
          showTotal: (total, range) => (
            <span style={{ color: '#64748b', fontSize: 12 }}>
              {range[0]}-{range[1]} / {total} bản ghi
            </span>
          ),
        }}
        onRow={(record) => ({
          onClick: () => onView(record),
        })}
      />
    </div>
  );
};

export default BookingTable;
