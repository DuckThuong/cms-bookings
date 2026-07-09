import { getCmsRevenuePage } from "@/api/configs/revenue.config";
import type { CmsRevenueTransaction } from "@/api/dtos/revenue.dto";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CarOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
  RiseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { downloadCsv } from "@/common/utils/exportCsv";
import {
  Alert,
  Button,
  DatePicker,
  message,
  Select,
  Spin,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
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
import { useRevenueStatuses } from "@/common/hooks/useMasterData";
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

  const { revenueStatusMeta } = useRevenueStatuses();

  const revenueQuery = useQuery({
    queryKey: ["cmsRevenue", route, vehicle, dateRange],
    queryFn: () =>
      getCmsRevenuePage({
        dateFrom: dateRange[0] || undefined,
        dateTo: dateRange[1] || undefined,
        route: route === "all" ? undefined : route,
        vehicle: vehicle === "all" ? undefined : vehicle,
      }),
  });

  const data = revenueQuery.data;
  const overview = data?.overview;
  const transactions = data?.transactions ?? [];
  const byRoute = data?.byRoute ?? [];
  const trend = data?.trend ?? [];

  const summaryItems = useMemo(() => {
    return (data?.summary ?? []).map((item) => {
      if (item.key === "revenue") {
        return { ...item, value: formatMoney(Number(item.value)) };
      }
      return item;
    });
  }, [data?.summary]);

  const routeColumns: ColumnsType<(typeof byRoute)[number]> = [
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
        <span style={{ color: value >= 0 ? "#86efac" : "#fca5a5", fontWeight: 700 }}>
          {value >= 0 ? "+" : ""}
          {value}%
        </span>
      ),
    },
  ];

  const transactionColumns: ColumnsType<CmsRevenueTransaction> = [
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
      render: (value: CmsRevenueTransaction["status"]) => {
        const meta = revenueStatusMeta[value];
        return (
          <span
            className="booking-status"
            style={{
              background: `${meta?.color ?? '#64748b'}33`,
              color: meta?.color ?? '#64748b',
              boxSizing: "border-box",
            }}
          >
            <span
              className="booking-status__dot"
              style={{ background: meta?.color ?? '#64748b' }}
            />
            {meta?.label ?? value}
          </span>
        );
      },
    },
    { title: "Thời điểm", dataIndex: "createdAt", key: "createdAt" },
  ];

  const momLabel =
    overview && overview.revenueMomPercent >= 0
      ? `↑ ${overview.revenueMomPercent}% MoM`
      : overview
        ? `↓ ${Math.abs(overview.revenueMomPercent)}% MoM`
        : "—";

  const metricCards = [
    {
      key: "gross",
      label: "Doanh thu lọc",
      value: formatCompactMoney(overview?.totalRevenue ?? 0),
      note: "theo bộ lọc hiện tại",
      trend: overview
        ? `${overview.revenueMomPercent >= 0 ? "+" : ""}${overview.revenueMomPercent}%`
        : "0%",
      trendDir: (overview?.revenueMomPercent ?? 0) >= 0 ? "up" : "down",
      icon: <DollarCircleOutlined />,
      iconClass: "revenue-stat-card__icon--green",
    },
    {
      key: "bookings",
      label: "Booking",
      value: (overview?.totalBookings ?? 0).toLocaleString("vi-VN"),
      note: "đã ghi nhận",
      trend: "+0%",
      trendDir: "up" as const,
      icon: <CreditCardOutlined />,
      iconClass: "revenue-stat-card__icon--blue",
    },
    {
      key: "top-route",
      label: "Tuyến mạnh nhất",
      value:
        overview?.strongestRoute?.split("→").pop()?.trim() ??
        overview?.strongestRoute ??
        "N/A",
      note: overview?.strongestRouteBookings
        ? `${overview.strongestRouteBookings} booking`
        : "chưa có dữ liệu",
      trend: overview?.strongestRouteGrowth
        ? `+${overview.strongestRouteGrowth}%`
        : "0%",
      trendDir: "up" as const,
      icon: <CarOutlined />,
      iconClass: "revenue-stat-card__icon--orange",
    },
    {
      key: "refund",
      label: "Hoàn tiền",
      value: formatCompactMoney(overview?.refundedRevenue ?? 0),
      note: "cần đối soát",
      trend: (overview?.refundedRevenue ?? 0) > 0 ? "-1.1%" : "0%",
      trendDir: (overview?.refundedRevenue ?? 0) > 0 ? "down" : "up",
      icon: <UndoOutlined />,
      iconClass: "revenue-stat-card__icon--yellow",
    },
  ];

  const resetFilters = () => {
    setDateRange(["", ""]);
    setRoute("all");
    setVehicle("all");
  };

  const handleExportReconciliation = () => {
    if (revenueQuery.isLoading) {
      return;
    }
    if (transactions.length === 0) {
      message.warning("Không có giao dịch để xuất đối soát");
      return;
    }

    const periodLabel =
      dateRange[0] && dateRange[1]
        ? `${dateRange[0]} → ${dateRange[1]}`
        : "Tất cả";
    const routeLabel =
      route === "all"
        ? "Tất cả tuyến"
        : (data?.routeOptions.find((item) => item.value === route)?.label ??
          route);
    const vehicleLabel =
      vehicle === "all"
        ? "Tất cả phương tiện"
        : (data?.vehicleOptions.find((item) => item.value === vehicle)?.label ??
          vehicle);

    const rows: (string | number)[][] = [
      ["Báo cáo đối soát doanh thu"],
      ["Khoảng thời gian", periodLabel],
      ["Tuyến", routeLabel],
      ["Phương tiện", vehicleLabel],
      ["Doanh thu lọc", overview?.totalRevenue ?? 0],
      ["Booking", overview?.totalBookings ?? 0],
      ["Hoàn tiền", overview?.refundedRevenue ?? 0],
      [],
      [
        "Mã giao dịch",
        "Tuyến",
        "Xe",
        "Booking",
        "Doanh thu (VND)",
        "Trạng thái",
        "Thời điểm",
      ],
      ...transactions.map((item) => [
        item.id,
        item.route,
        item.vehicle,
        item.bookings,
        item.revenue,
        REVENUE_STATUS_META[item.status]?.label ?? item.status,
        item.createdAt,
      ]),
    ];

    if (byRoute.length > 0) {
      rows.push(
        [],
        ["Tổng hợp theo tuyến"],
        ["Tuyến", "Phương tiện", "Booking", "Doanh thu (VND)", "Tăng trưởng (%)"],
        ...byRoute.map((item) => [
          item.route,
          item.vehicle,
          item.bookings,
          item.revenue,
          item.growth,
        ]),
      );
    }

    const stamp = new Date()
      .toISOString()
      .slice(0, 16)
      .replace(/[-:T]/g, "");
    downloadCsv(`doi-soat-doanh-thu-${stamp}.csv`, rows);
    message.success("Đã xuất file đối soát");
  };

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

      {revenueQuery.isError ? (
        <Alert
          type="error"
          showIcon
          message="Không tải được dữ liệu doanh thu"
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Bộ lọc doanh thu</span>
          <span className="bm-toolbar__count">
            {transactions.length} giao dịch
          </span>
        </div>
        <div className="bm-toolbar__right">
          <RangePicker
            className="bm-date-picker"
            onChange={(dates) =>
              setDateRange(
                dates
                  ? [
                    dates[0]!.format("YYYY-MM-DD"),
                    dates[1]!.format("YYYY-MM-DD"),
                  ]
                  : ["", ""],
              )
            }
          />
          <Select
            className="bm-select"
            value={route}
            onChange={setRoute}
            options={data?.routeOptions ?? [{ value: "all", label: "Tất cả tuyến" }]}
          />
          <Select
            className="bm-select"
            value={vehicle}
            onChange={setVehicle}
            options={
              data?.vehicleOptions ?? [
                { value: "all", label: "Tất cả phương tiện" },
              ]
            }
          />
          <Button
            className="btn-ghost"
            icon={<ReloadOutlined />}
            onClick={resetFilters}
          />
          <Button
            className="btn-ghost"
            icon={<DownloadOutlined />}
            onClick={handleExportReconciliation}
            disabled={revenueQuery.isLoading || transactions.length === 0}
          >
            Xuất đối soát
          </Button>
        </div>
      </div>

      <Spin spinning={revenueQuery.isLoading}>
        <SummaryStrip items={summaryItems} />

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
                  {momLabel}
                </span>
              </div>
              <div className="mgmt-card__body revenue-chart-card__body">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trend}
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
                    data={trend}
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
                dataSource={byRoute}
                pagination={{ pageSize: 7, showSizeChanger: false }}
              />
            </div>
            <div className="bm-table-wrap bm-table bm-table-wrap--revenue">
              <Table
                rowKey="key"
                columns={transactionColumns}
                dataSource={transactions}
                pagination={{ pageSize: 4, showSizeChanger: false }}
              />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default RevenuePage;
