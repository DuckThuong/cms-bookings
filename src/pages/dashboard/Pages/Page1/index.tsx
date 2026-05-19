import React from 'react';
import { Row, Col } from 'antd';
import StatCards from '../../components/StatCards';
import RevenueChart from '../../components/RevenueChart';
import BookingStatusChart from '../../components/BookingStatusChart';
import WeeklyBookingChart from '../../components/WeeklyBookingChart';
import VehicleTypeChart from '../../components/VehicleTypeChart';
import TopProviders from '../../components/TopProviders';
import RecentActivity from '../../components/RecentActivity';
import BookingTable from '../../components/BookingTable';
import "./style.scss";
const DashboardPage = () => {
  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="dashboard-page">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="dashboard-page__header">
        <div className="page-title">Tổng quan hệ thống</div>
        <div className="page-subtitle">
          {today} · Dữ liệu cập nhật realtime
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────── */}
      <StatCards />

      {/* ── Revenue Line Chart + Booking Pie ────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} xl={16}>
          <RevenueChart />
        </Col>
        <Col xs={24} xl={8}>
          <BookingStatusChart />
        </Col>
      </Row>

      {/* ── Weekly Bar Chart + Vehicle Type ─────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <WeeklyBookingChart />
        </Col>
        <Col xs={24} lg={12}>
          <VehicleTypeChart />
        </Col>
      </Row>

      {/* ── Top Providers + Recent Activity ─────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={14}>
          <TopProviders />
        </Col>
        <Col xs={24} lg={10}>
          <RecentActivity />
        </Col>
      </Row>

      {/* ── Booking Table ────────────────────────────── */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <BookingTable />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;