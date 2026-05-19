// src/components/dashboard/BookingTable.jsx
import React, { useState } from 'react';
import { Table, Input, Button, Space, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined } from '@ant-design/icons';
import { recentBookings, CHART_COLORS } from '@/pages/dashboard/share';

const STATUS_MAP = {
  completed: { label: 'Hoàn thành', cls: 'status-badge--success' },
  moving:    { label: 'Đang di chuyển', cls: 'status-badge--info' },
  pending:   { label: 'Chờ xác nhận', cls: 'status-badge--warning' },
  cancelled: { label: 'Đã hủy', cls: 'status-badge--error' },
};

const columns = [
  {
    title: 'Mã đặt vé',
    dataIndex: 'id',
    key: 'id',
    render: (id: string) => (
      <span style={{ color: CHART_COLORS.accent, fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>
        {id}
      </span>
    ),
  },
  {
    title: 'Khách hàng',
    dataIndex: 'customer',
    key: 'customer',
    render: (name: string) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#f97316',
            flexShrink: 0,
          }}
        >
          {name.charAt(0)}
        </div>
        <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{name}</span>
      </div>
    ),
  },
  {
    title: 'Tuyến đường',
    dataIndex: 'route',
    key: 'route',
    render: (route: string) => (
      <span style={{ color: '#94a3b8' }}>{route}</span>
    ),
  },
  {
    title: 'Nhà xe',
    dataIndex: 'provider',
    key: 'provider',
    render: (provider: string) => (
      <span style={{ color: '#94a3b8' }}>{provider}</span>
    ),
  },
  {
    title: 'Ngày đi',
    dataIndex: 'date',
    key: 'date',
    render: (date: string) => (
      <span style={{ color: '#64748b', fontSize: 12 }}>{date}</span>
    ),
  },
  {
    title: 'Ghế',
    dataIndex: 'seats',
    key: 'seats',
    align: 'center',
    render: (seats: number) => (
      <span style={{ color: '#94a3b8' }}>{seats}</span>
    ),
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: string) => (
      <span style={{ color: '#22c55e', fontWeight: 600 }}>{amount}</span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const s = STATUS_MAP[status as keyof typeof STATUS_MAP] || STATUS_MAP.pending;
      return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
    },
  },
];

const BookingTable = () => {
  const [search, setSearch] = useState('');

  const filtered = recentBookings.filter(
    (b) =>
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.route.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="table-section">
      <div className="table-section__header">
        <div>
          <div className="table-section__title">Danh sách đặt vé gần đây</div>
        </div>
        <Space size={8}>
          <Input
            prefix={<SearchOutlined style={{ color: '#64748b' }} />}
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              color: '#f1f5f9',
              width: 220,
              fontSize: 13,
            }}
          />
          <Button
            icon={<FilterOutlined />}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
              borderRadius: 8,
            }}
          >
            Lọc
          </Button>
          <Button
            icon={<DownloadOutlined />}
            style={{
              background: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.3)',
              color: '#f97316',
              borderRadius: 8,
            }}
          >
            Xuất Excel
          </Button>
        </Space>
      </div>

      <Table
        columns={columns as any}
        dataSource={filtered}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total: number) => (
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Tổng {total} bản ghi
            </span>
          ),
        }}
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default BookingTable;