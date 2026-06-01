import { getCmsDashboardOverview } from "@/api/configs/dashboard.config";
import type { DashboardPeriod } from "@/api/dtos/dashboard.dto";
import { useQuery } from "@tanstack/react-query";
import { Alert, Col, Row, Spin } from "antd";
import { useState } from "react";
import BookingStatusChart from "../../components/Page1/BookingStatusChart";
import BookingTable from "../../components/Page1/BookingTable";
import RecentActivity from "../../components/Page1/RecentActivity";
import RevenueChart from "../../components/Page1/RevenueChart";
import StatCards from "../../components/Page1/StatCards";
import TopProviders from "../../components/Page1/TopProviders";
import VehicleTypeChart from "../../components/Page1/VehicleTypeChart";
import WeeklyBookingChart from "../../components/Page1/WeeklyBookingChart";
import "./style.scss";

const DashboardPage = () => {
  const [period, setPeriod] = useState<DashboardPeriod>("1N");

  const today = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const overviewQuery = useQuery({
    queryKey: ["cmsDashboardOverview", period],
    queryFn: () => getCmsDashboardOverview({ period }),
  });

  const data = overviewQuery.data;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="page-title">Tổng quan hệ thống</div>
        <div className="page-subtitle">{today} · Dữ liệu cập nhật realtime</div>
      </div>

      {overviewQuery.isError ? (
        <Alert
          type="error"
          showIcon
          message="Không tải được dữ liệu dashboard"
          description="Vui lòng thử tải lại trang hoặc kiểm tra kết nối API."
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Spin spinning={overviewQuery.isLoading} tip="Đang tải dữ liệu...">
        <StatCards items={data?.statCards ?? []} />

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} xl={16}>
            <RevenueChart
              period={period}
              onPeriodChange={setPeriod}
              revenueSeries={data?.revenueSeries ?? []}
              revenueMomPercent={data?.revenueMomPercent ?? 0}
            />
          </Col>
          <Col xs={24} xl={8}>
            <BookingStatusChart
              data={data?.bookingStatusDistribution ?? []}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} lg={12}>
            <WeeklyBookingChart data={data?.weeklyBookings ?? []} />
          </Col>
          <Col xs={24} lg={12}>
            <VehicleTypeChart data={data?.vehicleTypes ?? []} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} lg={14}>
            <TopProviders
              items={data?.topProviders ?? []}
              scope={data?.scope ?? "platform"}
            />
          </Col>
          <Col xs={24} lg={10}>
            <RecentActivity items={data?.recentActivities ?? []} />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <BookingTable items={data?.recentBookings ?? []} />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default DashboardPage;
