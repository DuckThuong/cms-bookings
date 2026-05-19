import React, { useMemo, useState } from 'react';
import { Drawer, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SummaryStrip from '../../components/Page2/SummaryStrip';
import {
  fleetStatusOptions,
  fleetTypeOptions,
  fleetVehicles,
  getFleetSummary,
  routeOptions,
  VEHICLE_STATUS_META,
  type FleetVehicleRecord,
} from '../../share';
import '../Page2/style.scss';
import '../management.scss';

const FleetVehiclesPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [route, setRoute] = useState('all');
  const [selected, setSelected] = useState<FleetVehicleRecord | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return fleetVehicles.filter((vehicle) => {
      const matchKeyword =
        !keyword ||
        vehicle.plateNumber.toLowerCase().includes(keyword) ||
        vehicle.primaryDriver.toLowerCase().includes(keyword) ||
        vehicle.assignedRoute.toLowerCase().includes(keyword);
      const matchStatus = status === 'all' || vehicle.status === status;
      const matchType = type === 'all' || vehicle.type === type;
      const matchRoute = route === 'all' || vehicle.assignedRoute === route;
      return matchKeyword && matchStatus && matchType && matchRoute;
    });
  }, [search, status, type, route]);

  const columns: ColumnsType<FleetVehicleRecord> = [
    {
      title: 'Biển số',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      render: (value: string) => (
        <span style={{ color: '#f97316', fontFamily: 'monospace', fontWeight: 700 }}>{value}</span>
      ),
    },
    { title: 'Loại xe', dataIndex: 'type', key: 'type' },
    { title: 'Sức chứa', dataIndex: 'seats', key: 'seats', render: (value: number) => `${value} chỗ` },
    { title: 'Tuyến phụ trách', dataIndex: 'assignedRoute', key: 'assignedRoute' },
    { title: 'Tài xế chính', dataIndex: 'primaryDriver', key: 'primaryDriver' },
    {
      title: 'Sử dụng',
      dataIndex: 'utilizationRate',
      key: 'utilizationRate',
      render: (value: number) => <span className="amount-cell">{value}%</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: FleetVehicleRecord['status']) => {
        const meta = VEHICLE_STATUS_META[value];
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
        <div className="mgmt-hero__eyebrow">Vận hành phương tiện</div>
        <div className="mgmt-hero__title">Theo dõi đội xe và mức độ sẵn sàng khai thác</div>
        <div className="mgmt-hero__subtitle">
          Giám sát xe đang khai thác, xe chờ phân công và các lịch bảo dưỡng ảnh hưởng đến năng lực phục vụ.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách phương tiện</span>
          <span className="bm-toolbar__count">{filtered.length} xe</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm biển số, tài xế, tuyến..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ minWidth: 0, flex: '1 1 180px' }}
          />
          <Select className="bm-select" value={status} onChange={setStatus} options={fleetStatusOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Select className="bm-select" value={type} onChange={setType} options={fleetTypeOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Select className="bm-select" value={route} onChange={setRoute} options={routeOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
        </div>
      </div>

      <SummaryStrip items={getFleetSummary(filtered)} />

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
        title={selected ? `${selected.plateNumber} · ${selected.type}` : ''}
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Hồ sơ phương tiện</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Tuyến phụ trách</span>
                  <span className="mgmt-detail-list__value">{selected.assignedRoute}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Tài xế chính</span>
                  <span className="mgmt-detail-list__value">{selected.primaryDriver}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Sức chứa</span>
                  <span className="mgmt-detail-list__value">{selected.seats} chỗ</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Bảo dưỡng gần nhất</span>
                  <span className="mgmt-detail-list__value">{selected.lastMaintenance}</span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Tình trạng khai thác</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Sử dụng</div>
                    <div className="revenue-metric-card__value">{selected.utilizationRate}%</div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Bảo dưỡng kế tiếp</div>
                    <div className="report-type">{selected.nextMaintenance}</div>
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

export default FleetVehiclesPage;
