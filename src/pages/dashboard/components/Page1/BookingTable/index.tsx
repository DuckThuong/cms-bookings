import type {
  CmsDashboardRecentBooking,
  DashboardBookingUiStatus,
} from "@/api/dtos/dashboard.dto";
import { CHART_COLORS } from "@/pages/dashboard/share";
import {
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useMemo, useState } from "react";

const STATUS_MAP: Record<
  DashboardBookingUiStatus,
  { label: string; cls: string }
> = {
  completed: { label: "Hoàn thành", cls: "status-badge--success" },
  moving: { label: "Đang di chuyển", cls: "status-badge--info" },
  pending: { label: "Chờ xác nhận", cls: "status-badge--warning" },
  cancelled: { label: "Đã hủy", cls: "status-badge--error" },
};

type BookingTableProps = {
  items: CmsDashboardRecentBooking[];
};

const BookingTable = ({ items }: BookingTableProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      items.filter(
        (booking) =>
          booking.customer.toLowerCase().includes(search.toLowerCase()) ||
          booking.id.toLowerCase().includes(search.toLowerCase()) ||
          booking.route.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const columns = [
    {
      title: "Mã đặt vé",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <span
          style={{
            color: CHART_COLORS.accent,
            fontWeight: 600,
            fontFamily: "monospace",
            fontSize: 13,
          }}
        >
          {id}
        </span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (name: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(249,115,22,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#f97316",
              flexShrink: 0,
            }}
          >
            {name.charAt(0)}
          </div>
          <span style={{ color: "#f1f5f9", fontWeight: 500 }}>{name}</span>
        </div>
      ),
    },
    {
      title: "Tuyến đường",
      dataIndex: "route",
      key: "route",
      render: (route: string) => (
        <span style={{ color: "#94a3b8" }}>{route}</span>
      ),
    },
    {
      title: "Nhà xe",
      dataIndex: "provider",
      key: "provider",
      render: (provider: string) => (
        <span style={{ color: "#94a3b8" }}>{provider}</span>
      ),
    },
    {
      title: "Ngày đi",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <span style={{ color: "#64748b", fontSize: 12 }}>{date}</span>
      ),
    },
    {
      title: "Ghế",
      dataIndex: "seats",
      key: "seats",
      align: "center" as const,
      render: (seats: number) => (
        <span style={{ color: "#94a3b8" }}>{seats}</span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <span style={{ color: "#22c55e", fontWeight: 600 }}>{amount}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: DashboardBookingUiStatus) => {
        const meta = STATUS_MAP[status] ?? STATUS_MAP.pending;
        return (
          <span className={`status-badge ${meta.cls}`}>{meta.label}</span>
        );
      },
    },
  ];

  return (
    <div className="table-section">
      <div className="table-section__header">
        <div>
          <div className="table-section__title">Danh sách đặt vé gần đây</div>
        </div>
        <Space size={8} wrap>
          <Input
            prefix={<SearchOutlined style={{ color: "#64748b" }} />}
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #0f172a",
              borderRadius: 8,
              color: "#f1f5f9",
              minWidth: 0,
              width: "100%",
              fontSize: 13,
            }}
          />
          <Button
            icon={<FilterOutlined />}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #0f172a",
              color: "#94a3b8",
              borderRadius: 8,
            }}
          >
            Lọc
          </Button>
          <Button
            icon={<DownloadOutlined />}
            style={{
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.3)",
              color: "#f97316",
              borderRadius: 8,
            }}
          >
            Xuất Excel
          </Button>
        </Space>
      </div>

      <Table
        rowKey="key"
        columns={columns}
        dataSource={filtered}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total: number) => (
            <span style={{ color: "#64748b", fontSize: 12 }}>
              Tổng {total} bản ghi
            </span>
          ),
        }}
      />
    </div>
  );
};

export default BookingTable;
