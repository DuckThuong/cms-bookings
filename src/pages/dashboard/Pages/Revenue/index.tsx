import React, { useMemo, useState } from "react";
import { Button, DatePicker, Select, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CarOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  RiseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import {
  REVENUE_STATUS_META,
  getRevenueSummary,
  revenueByRoute,
  revenueTransactions,
  revenueTrend,
  routeOptions,
  vehicleOptions,
  type RevenueRouteRecord,
  type RevenueTransactionRecord,
} from "../../share";
import {
  AddDriverModal,
  AddRouteModal,
  AddTripModal,
  AddVehicleModal,
} from "../../components/ManagementCreate";
import "../Page2/style.scss";
import "../management.scss";

const { RangePicker } = DatePicker;

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")}₫`;
const formatCompactMoney = (value: number) =>
  `${(value / 1000000).toFixed(1)}M₫`;

const RevenuePage = () => {
  const [route, setRoute] = useState("all");
  const [vehicle, setVehicle] = useState("all");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return revenueTransactions.filter((item) => {
      const matchRoute = route === "all" || item.route === route;
      const matchVehicle = vehicle === "all" || item.vehicle === vehicle;
      const matchDate =
        !dateRange[0] ||
        !dateRange[1] ||
        (item.createdAt >= `${dateRange[0]} 00:00` &&
          item.createdAt <= `${dateRange[1]} 23:59`);

      return matchRoute && matchVehicle && matchDate;
    });
  }, [dateRange, route, vehicle]);

  const filteredRoutes = useMemo(() => {
    return revenueByRoute.filter((item) => {
      const matchRoute = route === "all" || item.route === route;
      const matchVehicle = vehicle === "all" || item.vehicle === vehicle;
      return matchRoute && matchVehicle;
    });
  }, [route, vehicle]);

  const revenueOverview = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );
    const totalBookings = filteredTransactions.reduce(
      (sum, item) => sum + item.bookings,
      0,
    );
    const refundedRevenue = filteredTransactions
      .filter((item) => item.status === "refunded")
      .reduce((sum, item) => sum + item.revenue, 0);
    const strongestRoute = filteredRoutes.reduce<RevenueRouteRecord | null>(
      (top, item) => {
        if (!top || item.revenue > top.revenue) {
          return item;
        }
        return top;
      },
      null,
    );

    return {
      totalRevenue,
      totalBookings,
      refundedRevenue,
      strongestRoute,
      averageBookingValue: totalBookings
        ? Math.round(totalRevenue / totalBookings)
        : 0,
    };
  }, [filteredRoutes, filteredTransactions]);

  const routeColumns: ColumnsType<RevenueRouteRecord> = [
    { title: "Tuyến", dataIndex: "route", key: "route" },
    { title: "Phương tiện", dataIndex: "vehicle", key: "vehicle" },
    { title: "Booking", dataIndex: "bookings", key: "bookings" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => (
        <span className="amount-cell">{formatMoney(value)}</span>
      ),
    },
    {
      title: "Tăng trưởng",
      dataIndex: "growth",
      key: "growth",
      render: (value: number) => (
        <span style={{ color: "#86efac", fontWeight: 700 }}>+{value}%</span>
      ),
    },
  ];

  const transactionColumns: ColumnsType<RevenueTransactionRecord> = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      render: (value: string) => (
        <span
          style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}
        >
          {value}
        </span>
      ),
    },
    { title: "Tuyến", dataIndex: "route", key: "route" },
    { title: "Xe", dataIndex: "vehicle", key: "vehicle" },
    { title: "Booking", dataIndex: "bookings", key: "bookings" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => (
        <span className="amount-cell">{formatMoney(value)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: RevenueTransactionRecord["status"]) => {
        const meta = REVENUE_STATUS_META[value];
        return (
          <span
            className="booking-status"
            style={{
              background: `${meta.color}33`,
              color: meta.color,
              boxSizing: "border-box",
            }}
          >
            <span
              className="booking-status__dot"
              style={{ background: meta.color }}
            />
            {meta.label}
          </span>
        );
      },
    },
    { title: "Thời điểm", dataIndex: "createdAt", key: "createdAt" },
  ];

  const metricCards = [
    {
      key: "gross",
      label: "Doanh thu lọc",
      value: formatCompactMoney(revenueOverview.totalRevenue),
      note: "theo bộ lọc hiện tại",
      trend: "+18.3%",
      trendDir: "up",
      icon: <DollarCircleOutlined />,
      iconClass: "revenue-stat-card__icon--green",
    },
    {
      key: "bookings",
      label: "Booking",
      value: revenueOverview.totalBookings.toLocaleString("vi-VN"),
      note: "đã ghi nhận",
      trend: "+4.2%",
      trendDir: "up",
      icon: <CreditCardOutlined />,
      iconClass: "revenue-stat-card__icon--blue",
    },
    {
      key: "top-route",
      label: "Tuyến mạnh nhất",
      value:
        revenueOverview.strongestRoute?.route.split("→").pop()?.trim() ?? "N/A",
      note: revenueOverview.strongestRoute
        ? `${revenueOverview.strongestRoute.bookings} booking`
        : "chưa có dữ liệu",
      trend: revenueOverview.strongestRoute
        ? `+${revenueOverview.strongestRoute.growth}%`
        : "0%",
      trendDir: "up",
      icon: <CarOutlined />,
      iconClass: "revenue-stat-card__icon--orange",
    },
    {
      key: "refund",
      label: "Hoàn tiền",
      value: formatCompactMoney(revenueOverview.refundedRevenue),
      note: "cần đối soát",
      trend: revenueOverview.refundedRevenue > 0 ? "-1.1%" : "0%",
      trendDir: revenueOverview.refundedRevenue > 0 ? "down" : "up",
      icon: <UndoOutlined />,
      iconClass: "revenue-stat-card__icon--yellow",
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Quản lý doanh thu</div>
        <div className="mgmt-hero__title">
          Bức tranh doanh thu theo tuyến và phương tiện
        </div>
        <div className="mgmt-hero__subtitle">
          Tổng hợp doanh thu vận hành, đối soát và biến động theo từng tuyến
          trọng điểm.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Bộ lọc doanh thu</span>
          <span className="bm-toolbar__count">
            {filteredTransactions.length} giao dịch
          </span>
        </div>
        <div className="bm-toolbar__right">
          <RangePicker
            className="bm-date-picker"
            onChange={(dates) =>
              setDateRange(
                dates
                  ? [
                      dates[0].format("YYYY-MM-DD"),
                      dates[1].format("YYYY-MM-DD"),
                    ]
                  : ["", ""],
              )
            }
          />
          <Select
            className="bm-select"
            value={route}
            onChange={setRoute}
            options={routeOptions}
          />
          <Select
            className="bm-select"
            value={vehicle}
            onChange={setVehicle}
            options={vehicleOptions}
          />
          <Button
            className="btn-ghost"
            icon={<ReloadOutlined />}
            onClick={() => {
              setDateRange(["", ""]);
              setRoute("all");
              setVehicle("all");
            }}
          />
          <Button className="btn-ghost" icon={<DownloadOutlined />}>
            Xuất đối soát
          </Button>
        </div>
      </div>

      <SummaryStrip items={getRevenueSummary(filteredTransactions)} />

      <div className="bm-content">
        <div className="revenue-stat-grid">
          {metricCards.map((card) => (
            <div className="revenue-stat-card" key={card.key}>
              <div className={`revenue-stat-card__icon ${card.iconClass}`}>
                {card.icon}
              </div>
              <div className="revenue-stat-card__body">
                <div className="revenue-stat-card__label">{card.label}</div>
                <div className="revenue-stat-card__value">{card.value}</div>
                <div className="revenue-stat-card__footer">
                  <span
                    className={`revenue-stat-card__trend revenue-stat-card__trend--${card.trendDir}`}
                  >
                    {card.trendDir === "up" ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    {card.trend}
                  </span>
                  <span>{card.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mgmt-grid">
          <div className="mgmt-card revenue-chart-card">
            <div className="mgmt-card__header revenue-chart-card__header">
              <div>
                <div className="mgmt-card__title">Xu hướng doanh thu</div>
                <div className="mgmt-card__subtitle">6 kỳ gần nhất</div>
              </div>
              <span className="revenue-chart-card__badge">
                <RiseOutlined />
                18.3% MoM
              </span>
            </div>
            <div className="mgmt-card__body revenue-chart-card__body">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueTrend}
                  margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenuePageGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f97316"
                        stopOpacity={0.28}
                      />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="period"
                    stroke="#64748b"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip />
                  <Legend formatter={() => "Doanh thu (triệu ₫)"} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#revenuePageGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#f97316", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mgmt-card revenue-chart-card">
            <div className="mgmt-card__header revenue-chart-card__header">
              <div>
                <div className="mgmt-card__title">Booking theo kỳ</div>
                <div className="mgmt-card__subtitle">Đối chiếu sản lượng</div>
              </div>
            </div>
            <div className="mgmt-card__body revenue-chart-card__body">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueTrend}
                  margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="period"
                    stroke="#64748b"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="bookings"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mgmt-grid">
          <div className="bm-table-wrap bm-table bm-table-wrap--revenue">
            <Table
              rowKey="key"
              columns={routeColumns}
              dataSource={filteredRoutes}
              pagination={{ pageSize: 7, showSizeChanger: false }}
            />
          </div>
          <div className="bm-table-wrap bm-table bm-table-wrap--revenue">
            <Table
              rowKey="key"
              columns={transactionColumns}
              dataSource={filteredTransactions}
              pagination={{ pageSize: 4, showSizeChanger: false }}
            />
          </div>
        </div>
      </div>

      <AddTripModal
        open={tripModalOpen}
        onClose={() => setTripModalOpen(false)}
        onSubmit={(record) => message.success(`Đã tạo trip ${record.id}`)}
      />
      <AddRouteModal
        open={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        onSubmit={(record) => message.success(`Đã tạo route ${record.id}`)}
      />
      <AddVehicleModal
        open={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSubmit={(record) =>
          message.success(`Đã tạo vehicle ${record.plateNumber}`)
        }
      />
      <AddDriverModal
        open={driverModalOpen}
        onClose={() => setDriverModalOpen(false)}
        onSubmit={(record) => message.success(`Đã tạo driver ${record.id}`)}
      />
    </div>
  );
};

export default RevenuePage;
