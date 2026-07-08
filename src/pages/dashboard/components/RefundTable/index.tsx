import React, { useState } from 'react';
import { Table, Tag, Tooltip, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  REFUND_STATUSES,
  REFUND_POLICY,
  type RefundRecord,
  type RefundStatusKey,
} from '../../share/bookingManagement';

const formatMoney = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return (Number(String(value).replace(/,/g, '')) || 0).toLocaleString('vi-VN');
};

interface RefundTableProps {
  data: RefundRecord[];
  onView: (record: RefundRecord) => void;
  onApprove: (record: RefundRecord) => void;
  onReject: (record: RefundRecord) => void;
  loading: boolean;
}

const RefundTable: React.FC<RefundTableProps> = ({
  data,
  onView,
  onApprove,
  onReject,
  loading,
}) => {
  const [searchText, setSearchText] = useState('');
  
  const filteredData = searchText
    ? data.filter(
        (item) =>
          item.customer.toLowerCase().includes(searchText.toLowerCase()) ||
          item.refundCode.toLowerCase().includes(searchText.toLowerCase()) ||
          item.phone.includes(searchText),
      )
    : data;

  const columns: ColumnsType<RefundRecord> = [
    {
      title: 'Mã hoàn tiền',
      dataIndex: 'refundCode',
      key: 'refundCode',
      render: (code: string) => (
        <span style={{ color: '#f97316', fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>
          {code}
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
      title: 'Mã đặt vé',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (code: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {code}
        </span>
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
      title: 'Ghế',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats: string[]) => (
        <div className="seat-badges">
          {seats.slice(0, 3).map((seat) => (
            <span key={seat} className="seat-badge">
              {seat}
            </span>
          ))}
          {seats.length > 3 && (
            <span className="seat-badge" style={{ color: '#f97316' }}>
              +{seats.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Số tiền',
      key: 'amount',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            Đã thanh toán: {formatMoney(record.paidAmount)}đ
          </div>
          <div style={{ color: '#22c55e', fontWeight: 600 }}>
            Hoàn: {formatMoney(record.refundAmount)}đ ({record.refundPercentage}%)
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: RefundStatusKey) => {
        const meta = REFUND_STATUSES[status];
        return (
          <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
            <span className="booking-status__dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
        );
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason?: string) => (
        <Tooltip title={reason || 'Không có'}>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {reason || '—'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Yêu cầu lúc',
      dataIndex: 'requestedAt',
      key: 'requestedAt',
      render: (date: string) => (
        <span style={{ fontSize: 11, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
          {date}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <div className="row-actions">
          <Tooltip title="Xem chi tiết">
            <button
              type="button"
              title="Xem chi tiết"
              onClick={() => onView(record)}
            >
              <span style={{ fontSize: 12 }}>Chi tiết</span>
            </button>
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Duyệt hoàn tiền">
                <button
                  type="button"
                  title="Duyệt hoàn tiền"
                  onClick={(event) => {
                    event.stopPropagation();
                    onApprove(record);
                  }}
                  style={{ borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }}
                >
                  <CheckOutlined />
                </button>
              </Tooltip>
              <Tooltip title="Từ chối">
                <button
                  type="button"
                  title="Từ chối"
                  className="danger"
                  onClick={(event) => {
                    event.stopPropagation();
                    onReject(record);
                  }}
                >
                  <CloseOutlined />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="refund-table-wrap">
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Input
          placeholder="Tìm kiếm theo tên, mã hoàn tiền, số điện thoại..."
          prefix={<SearchOutlined style={{ color: '#64748b' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 320, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="key"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => (
            <span style={{ color: '#64748b', fontSize: 12 }}>
              {range[0]}-{range[1]} / {total} yêu cầu
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

export default RefundTable;
