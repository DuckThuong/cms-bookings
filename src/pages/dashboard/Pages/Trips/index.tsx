import React, { useMemo, useState } from 'react';
import { Drawer, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SummaryStrip from '../../components/Page2/SummaryStrip';
import {
  routeOptions,
  TRIP_STATUS_META,
  trips,
  tripStatusOptions,
  vehicleOptions,
  getTripSummary,
  type TripRecord,
} from '../../share';
import '../Page2/style.scss';
import '../management.scss';

const TripsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [route, setRoute] = useState('all');
  const [vehicle, setVehicle] = useState('all');
  const [selected, setSelected] = useState<TripRecord | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return trips.filter((trip) => {
      const matchKeyword =
        !keyword ||
        trip.id.toLowerCase().includes(keyword) ||
        trip.route.toLowerCase().includes(keyword) ||
        trip.driver.toLowerCase().includes(keyword);
      const matchStatus = status === 'all' || trip.status === status;
      const matchRoute = route === 'all' || trip.route === route;
      const matchVehicle = vehicle === 'all' || trip.vehicle === vehicle;
      return matchKeyword && matchStatus && matchRoute && matchVehicle;
    });
  }, [search, status, route, vehicle]);

  const columns: ColumnsType<TripRecord> = [
    {
      title: 'Mã chuyến',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => (
        <span style={{ color: '#f97316', fontFamily: 'monospace', fontWeight: 700 }}>{value}</span>
      ),
    },
    {
      title: 'Tuyến / giờ chạy',
      key: 'route',
      render: (_, record) => (
        <div className="route-cell">
          <div className="route-cell__line">{record.route}</div>
          <div className="route-cell__time">
            {record.departure} → {record.arrival}
          </div>
        </div>
      ),
    },
    { title: 'Xe', dataIndex: 'vehicle', key: 'vehicle' },
    { title: 'Tài xế', dataIndex: 'driver', key: 'driver' },
    {
      title: 'Tải ghế',
      key: 'load',
      render: (_, record) => (
        <div>
          <div className="amount-cell">
            {record.bookedSeats}/{record.capacity}
          </div>
          <div className="report-subtitle">{record.occupancyRate}% lấp đầy</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: TripRecord['status']) => {
        const meta = TRIP_STATUS_META[value];
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
        <div className="mgmt-hero__eyebrow">Vận hành chuyến xe</div>
        <div className="mgmt-hero__title">Theo dõi tải ghế và trạng thái từng chuyến</div>
        <div className="mgmt-hero__subtitle">
          Tập trung vào chuyến đang chạy, chuyến sắp đón khách và các điểm nghẽn ảnh hưởng đến khả năng khai thác.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách chuyến</span>
          <span className="bm-toolbar__count">{filtered.length} chuyến</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm mã chuyến, tuyến, tài xế..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ minWidth: 0, flex: '1 1 180px' }}
          />
          <Select className="bm-select" value={status} onChange={setStatus} options={tripStatusOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Select className="bm-select" value={route} onChange={setRoute} options={routeOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
          <Select className="bm-select" value={vehicle} onChange={setVehicle} options={vehicleOptions} style={{ minWidth: 0, flex: '1 1 140px' }} />
        </div>
      </div>

      <SummaryStrip items={getTripSummary(filtered)} />

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
              <div className="drawer-body__section-title">Thông tin khai thác</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Tài xế</span>
                  <span className="mgmt-detail-list__value">{selected.driver}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Xe</span>
                  <span className="mgmt-detail-list__value">{selected.vehicle}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Khởi hành</span>
                  <span className="mgmt-detail-list__value">{selected.departure}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Dự kiến đến</span>
                  <span className="mgmt-detail-list__value">{selected.arrival}</span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Chỉ số vận hành</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Tải ghế</div>
                    <div className="revenue-metric-card__value">
                      {selected.bookedSeats}/{selected.capacity}
                    </div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Lấp đầy</div>
                    <div className="revenue-metric-card__value">{selected.occupancyRate}%</div>
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

export default TripsPage;
