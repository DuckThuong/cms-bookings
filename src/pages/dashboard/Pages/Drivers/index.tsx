import React, { useMemo, useState } from 'react';
import { Button, Drawer, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import SummaryStrip from '../../components/Page2/SummaryStrip';
import {
  DRIVER_STATUS_META,
  driverLicenseOptions,
  driverStatusOptions,
  drivers,
  getDriverSummary,
  routeOptions,
  type DriverRecord,
} from '../../share';
import '../Page2/style.scss';
import '../management.scss';

const DriversPage = () => {
  const [search, setSearch] = useState('');
  const [license, setLicense] = useState('all');
  const [status, setStatus] = useState('all');
  const [route, setRoute] = useState('all');
  const [selected, setSelected] = useState<DriverRecord | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return drivers.filter((driver) => {
      const matchKeyword =
        !keyword ||
        driver.name.toLowerCase().includes(keyword) ||
        driver.phone.includes(keyword) ||
        driver.id.toLowerCase().includes(keyword);
      const matchLicense = license === 'all' || driver.license === license;
      const matchStatus = status === 'all' || driver.status === status;
      const matchRoute = route === 'all' || driver.mainRoute === route;
      return matchKeyword && matchLicense && matchStatus && matchRoute;
    });
  }, [search, license, status, route]);

  const columns: ColumnsType<DriverRecord> = [
    {
      title: 'Mã tài xế',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => (
        <span style={{ color: '#f97316', fontFamily: 'monospace', fontWeight: 700 }}>{value}</span>
      ),
    },
    {
      title: 'Tài xế',
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
    { title: 'Bằng lái', dataIndex: 'license', key: 'license' },
    { title: 'Xe phụ trách', dataIndex: 'assignedVehicle', key: 'assignedVehicle' },
    { title: 'Tuyến chính', dataIndex: 'mainRoute', key: 'mainRoute' },
    { title: 'Số chuyến', dataIndex: 'tripCount', key: 'tripCount' },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (value: number) => <span className="amount-cell">{value.toFixed(1)}★</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: DriverRecord['status']) => {
        const meta = DRIVER_STATUS_META[value];
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
        <div className="mgmt-hero__eyebrow">Quản lý tài xế</div>
        <div className="mgmt-hero__title">Nguồn lực vận hành theo ca và tuyến</div>
        <div className="mgmt-hero__subtitle">
          Giám sát tài xế đang chạy tuyến, năng lực bằng lái và trạng thái phân công trong ngày.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách tài xế</span>
          <span className="bm-toolbar__count">{filtered.length} hồ sơ</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm tên, SĐT, mã tài xế..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ minWidth: 0, flex: '1 1 180px' }}
          />
          <Select className="bm-select" value={license} onChange={setLicense} options={driverLicenseOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Select className="bm-select" value={status} onChange={setStatus} options={driverStatusOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Select className="bm-select" value={route} onChange={setRoute} options={routeOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Button
            className="btn-ghost"
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearch('');
              setLicense('all');
              setStatus('all');
              setRoute('all');
            }}
          />
        </div>
      </div>

      <SummaryStrip items={getDriverSummary(filtered)} />

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
              <div className="drawer-body__section-title">Thông tin hồ sơ</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Điện thoại</span>
                  <span className="mgmt-detail-list__value">{selected.phone}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Bằng lái</span>
                  <span className="mgmt-detail-list__value">{selected.license}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Ca làm</span>
                  <span className="mgmt-detail-list__value">{selected.shift}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Xe phụ trách</span>
                  <span className="mgmt-detail-list__value">{selected.assignedVehicle}</span>
                </div>
              </div>
              <div className="mgmt-note">{selected.note}</div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Năng suất hiện tại</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Tổng chuyến</div>
                    <div className="revenue-metric-card__value">{selected.tripCount}</div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Đánh giá</div>
                    <div className="revenue-metric-card__value">{selected.rating.toFixed(1)}★</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Phân công</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Tuyến chính</span>
                  <span className="mgmt-detail-list__value">{selected.mainRoute}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Trạng thái</span>
                  <span className="mgmt-detail-list__value">{DRIVER_STATUS_META[selected.status].label}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DriversPage;
