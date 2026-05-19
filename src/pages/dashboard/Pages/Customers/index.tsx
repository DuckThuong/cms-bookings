import React, { useMemo, useState } from 'react';
import { Button, Drawer, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import SummaryStrip from '../../components/Page2/SummaryStrip';
import {
  CUSTOMER_STATUS_META,
  customerStatusOptions,
  customerTierOptions,
  customers,
  getCustomerSummary,
  type CustomerRecord,
} from '../../share';
import '../Page2/style.scss';
import '../management.scss';

const formatMoney = (value: number) => value.toLocaleString('vi-VN');

const getTierLabel = (tier: CustomerRecord['tier']) => {
  switch (tier) {
    case 'vip':
      return 'VIP';
    case 'than-thiet':
      return 'Thân thiết';
    default:
      return 'Phổ thông';
  }
};

const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<CustomerRecord | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchKeyword =
        !keyword ||
        customer.name.toLowerCase().includes(keyword) ||
        customer.phone.includes(keyword) ||
        customer.id.toLowerCase().includes(keyword);
      const matchTier = tier === 'all' || customer.tier === tier;
      const matchStatus = status === 'all' || customer.status === status;
      return matchKeyword && matchTier && matchStatus;
    });
  }, [search, tier, status]);

  const columns: ColumnsType<CustomerRecord> = [
    {
      title: 'Mã khách',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => (
        <span style={{ color: '#f97316', fontFamily: 'monospace', fontWeight: 700 }}>{value}</span>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'name',
      render: (_, record) => (
        <div className="cust-cell">
          <div className="cust-cell__avatar">{record.name.charAt(0)}</div>
          <div>
            <div className="cust-cell__name">{record.name}</div>
            <div className="cust-cell__phone">{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Hạng',
      dataIndex: 'tier',
      key: 'tier',
      render: (value: CustomerRecord['tier']) => <span className="seat-badge">{getTierLabel(value)}</span>,
    },
    {
      title: 'Tuyến ưa thích',
      dataIndex: 'preferredRoute',
      key: 'preferredRoute',
    },
    {
      title: 'Số booking',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (value: number) => <span className="amount-cell">{formatMoney(value)}₫</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: CustomerRecord['status']) => {
        const meta = CUSTOMER_STATUS_META[value];
        return (
          <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
            <span className="booking-status__dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <div className="row-actions">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelected(record);
            }}
          >
            <EyeOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Quản lý khách hàng</div>
        <div className="mgmt-hero__title">Tệp khách hàng và mức độ gắn bó</div>
        <div className="mgmt-hero__subtitle">
          Theo dõi nhóm khách giá trị cao, khách suy giảm tần suất và lịch sử giao dịch gần đây.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách khách hàng</span>
          <span className="bm-toolbar__count">{filtered.length} hồ sơ</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm tên, SĐT, mã khách..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ minWidth: 0, flex: '1 1 180px' }}
          />
          <Select className="bm-select" value={tier} onChange={setTier} options={customerTierOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Select className="bm-select" value={status} onChange={setStatus} options={customerStatusOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Button
            className="btn-ghost"
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearch('');
              setTier('all');
              setStatus('all');
            }}
          />
          <Button className="btn-primary" icon={<PlusOutlined />}>
            Tạo phân nhóm
          </Button>
        </div>
      </div>

      <SummaryStrip items={getCustomerSummary(filtered)} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table
            rowKey="key"
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 6, showSizeChanger: false }}
            onRow={(record) => ({ onClick: () => setSelected(record) })}
          />
        </div>
      </div>

      <Drawer
        className="booking-drawer"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={420}
        title={selected ? `${selected.name} · ${selected.id}` : ''}
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin chung</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Điện thoại</span>
                  <span className="mgmt-detail-list__value">{selected.phone}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Email</span>
                  <span className="mgmt-detail-list__value">{selected.email}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Hạng khách</span>
                  <span className="mgmt-detail-list__value">{getTierLabel(selected.tier)}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Booking gần nhất</span>
                  <span className="mgmt-detail-list__value">{selected.lastBooking}</span>
                </div>
              </div>
              {selected.note && <div className="mgmt-note">{selected.note}</div>}
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Chỉ số giao dịch</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Tổng booking</div>
                    <div className="revenue-metric-card__value">{selected.bookingCount}</div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Tổng chi tiêu</div>
                    <div className="revenue-metric-card__value">{formatMoney(selected.totalSpent)}₫</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Lịch sử gần đây</div>
              <div className="mgmt-activity">
                {selected.recentTrips.map((trip) => (
                  <div className="mgmt-activity__item" key={trip.id}>
                    <div className="mgmt-activity__code">{trip.id}</div>
                    <div className="mgmt-activity__main">
                      <div className="mgmt-activity__title">{trip.route}</div>
                      <div className="mgmt-activity__meta">{trip.date}</div>
                    </div>
                    <div className="mgmt-activity__amount">{formatMoney(trip.amount)}₫</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CustomersPage;
