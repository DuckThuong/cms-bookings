import React, { useMemo, useState } from 'react';
import { Drawer, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SummaryStrip from '../../components/Page2/SummaryStrip';
import {
  getRouteSummary,
  operationRoutes,
  ROUTE_STATUS_META,
  routeStatusOptions,
  type RouteRecord,
} from '../../share';
import '../Page2/style.scss';
import '../management.scss';

const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')}₫`;

const RoutesPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<RouteRecord | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return operationRoutes.filter((route) => {
      const matchKeyword =
        !keyword ||
        route.id.toLowerCase().includes(keyword) ||
        route.route.toLowerCase().includes(keyword) ||
        route.leadVehicle.toLowerCase().includes(keyword);
      const matchStatus = status === 'all' || route.status === status;
      return matchKeyword && matchStatus;
    });
  }, [search, status]);

  const columns: ColumnsType<RouteRecord> = [
    {
      title: 'Mã tuyến',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => (
        <span style={{ color: '#f97316', fontFamily: 'monospace', fontWeight: 700 }}>{value}</span>
      ),
    },
    { title: 'Tuyến đường', dataIndex: 'route', key: 'route' },
    {
      title: 'Thông số',
      key: 'specs',
      render: (_, record) => (
        <div>
          <div className="cust-cell__name">{record.distanceKm} km</div>
          <div className="cust-cell__phone">{record.standardDuration} tiêu chuẩn</div>
        </div>
      ),
    },
    {
      title: 'Khai thác',
      key: 'ops',
      render: (_, record) => (
        <div>
          <div className="cust-cell__name">{record.tripsPerDay} chuyến/ngày</div>
          <div className="cust-cell__phone">{record.averageOccupancy}% lấp đầy</div>
        </div>
      ),
    },
    {
      title: 'Doanh thu ước tính',
      dataIndex: 'estimatedRevenue',
      key: 'estimatedRevenue',
      render: (value: number) => <span className="amount-cell">{formatMoney(value)}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: RouteRecord['status']) => {
        const meta = ROUTE_STATUS_META[value];
        return (
          <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
            <span className="booking-status__dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Vận hành tuyến đường</div>
        <div className="mgmt-hero__title">Năng lực khai thác theo từng tuyến trọng điểm</div>
        <div className="mgmt-hero__subtitle">
          Theo dõi tuyến có nhu cầu cao, tuyến giảm chuyến và sức kéo doanh thu của từng hành lang vận chuyển.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách tuyến</span>
          <span className="bm-toolbar__count">{filtered.length} tuyến</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm mã tuyến, tên tuyến, xe chủ lực..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ minWidth: 0, flex: '1 1 180px' }}
          />
          <Select className="bm-select" value={status} onChange={setStatus} options={routeStatusOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
        </div>
      </div>

      <SummaryStrip items={getRouteSummary(filtered)} />

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
        title={selected ? `${selected.id} · ${selected.route}` : ''}
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin tuyến</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Quãng đường</span>
                  <span className="mgmt-detail-list__value">{selected.distanceKm} km</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Thời lượng chuẩn</span>
                  <span className="mgmt-detail-list__value">{selected.standardDuration}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Xe chủ lực</span>
                  <span className="mgmt-detail-list__value">{selected.leadVehicle}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Nhu cầu</span>
                  <span className="mgmt-detail-list__value">{selected.demandLevel}</span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Hiệu suất khai thác</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Chuyến/ngày</div>
                    <div className="revenue-metric-card__value">{selected.tripsPerDay}</div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Lấp đầy TB</div>
                    <div className="revenue-metric-card__value">{selected.averageOccupancy}%</div>
                  </div>
                </div>
              </div>
              <div className="mgmt-note">{selected.note}</div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RoutesPage;
