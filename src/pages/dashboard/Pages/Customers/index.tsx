import { getCmsCustomers } from "@/api/configs/customer.config";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import {
  CUSTOMER_STATUS_META,
  customerStatusOptions,
  customerTierOptions,
} from "../../share";
import type { CustomerRecord } from "../../share";
import { EyeOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer, Empty, Input, Select, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import "../Page2/style.scss";
import "../management.scss";

const formatMoney = (value: number) => value.toLocaleString("vi-VN");

const getTierLabel = (tier: CustomerRecord["tier"]) => {
  switch (tier) {
    case "vip": return "VIP";
    case "than-thiet": return "Thân thiết";
    default: return "Phổ thông";
  }
};

export const renderCustomerStatus = (value: CustomerRecord["status"]) => {
  const meta = CUSTOMER_STATUS_META[value];
  if (!meta) return value || "-";
  return (
    <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
      <span className="booking-status__dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
};

const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<CustomerRecord | null>(null);

  const listQuery = useQuery({
    queryKey: ["cmsCustomers", search, tier, status],
    queryFn: () =>
      getCmsCustomers({
        search: search.trim() || undefined,
        tier: tier as CustomerRecord["tier"] | "all",
        status: status as CustomerRecord["status"] | "all",
      }),
  });

  const customers = listQuery.data?.items ?? [];

  const summaryItems = useMemo(() => {
    const summary = listQuery.data?.summary;
    if (!summary) {
      return [
        { key: "customers", label: "Tổng khách", color: "#3b82f6", value: 0 },
        { key: "vip", label: "Khách VIP", color: "#f97316", value: 0 },
        { key: "active", label: "Đang hoạt động", color: "#22c55e", value: 0 },
        { key: "spent", label: "Tổng chi tiêu", color: "#eab308", value: 0 },
      ];
    }
    return [
      { key: "customers", label: "Tổng khách", color: "#3b82f6", value: summary.totalCustomers },
      { key: "vip", label: "Khách VIP", color: "#f97316", value: summary.vipCount },
      { key: "active", label: "Đang hoạt động", color: "#22c55e", value: summary.activeCount },
      { key: "spent", label: "Tổng chi tiêu", color: "#eab308", value: summary.totalSpent },
    ];
  }, [listQuery.data?.summary]);

  const columns: ColumnsType<CustomerRecord> = [
    { title: "Mã khách", dataIndex: "id", key: "id", render: (value: string) => (
      <span style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}>{value}</span>
    )},
    { title: "Khách hàng", key: "name", render: (_, record) => (
      <div className="cust-cell">
        <div className="cust-cell__avatar">{record.name.charAt(0)}</div>
        <div>
          <div className="cust-cell__name">{record.name}</div>
          <div className="cust-cell__phone">{record.phone}</div>
        </div>
      </div>
    )},
    { title: "Hạng", dataIndex: "tier", key: "tier", render: (value: CustomerRecord["tier"]) => (
      <span className="seat-badge">{getTierLabel(value)}</span>
    )},
    { title: "Tuyến ưa thích", dataIndex: "preferredRoute", key: "preferredRoute" },
    { title: "Số booking", dataIndex: "bookingCount", key: "bookingCount" },
    { title: "Tổng chi tiêu", dataIndex: "totalSpent", key: "totalSpent", render: (value: number) => (
      <span className="amount-cell">{formatMoney(value)}₫</span>
    )},
    { title: "Trạng thái", dataIndex: "status", key: "status", render: renderCustomerStatus },
    { title: "", key: "actions", render: (_, record) => (
      <div className="row-actions">
        <Button type="primary" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); setSelected(record); }} />
      </div>
    )},
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Quản lý khách hàng</div>
        <div className="mgmt-hero__title">Tệp khách hàng và mức độ gắn bó</div>
        <div className="mgmt-hero__subtitle">Theo dõi nhóm khách giá trị cao, khách suy giảm tần suất và lịch sử giao dịch gần đây.</div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách khách hàng</span>
          <span className="bm-toolbar__count">{listQuery.data?.total ?? 0} hồ sơ</span>
        </div>
        <div className="bm-toolbar__right">
          <Input className="bm-search" placeholder="Tìm tên, SĐT, mã khách..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select className="bm-select" value={tier} onChange={setTier} options={customerTierOptions} />
          <Select className="bm-select" value={status} onChange={setStatus} options={customerStatusOptions} />
          <Button className="btn-ghost" icon={<ReloadOutlined />} onClick={() => { setSearch(""); setTier("all"); setStatus("all"); void listQuery.refetch(); }} />
          <Button className="btn-primary" icon={<PlusOutlined />}>Tạo phân nhóm</Button>
        </div>
      </div>

      <SummaryStrip items={summaryItems} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Spin spinning={listQuery.isLoading}>
            <Table rowKey="key" columns={columns} dataSource={customers}
              locale={{ emptyText: listQuery.isError ? <Empty description="Không tải được danh sách khách hàng" /> : <Empty description="Chưa có khách hàng" /> }}
              pagination={{ pageSize: 6, showSizeChanger: false }} onRow={(record) => ({ onClick: () => setSelected(record) })} />
          </Spin>
        </div>
      </div>

      <Drawer className="booking-drawer" open={Boolean(selected)} onClose={() => setSelected(null)} width={420} title={selected ? `${selected.name} · ${selected.id}` : ""}>
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin chung</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Điện thoại</span><span className="mgmt-detail-list__value">{selected.phone}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Email</span><span className="mgmt-detail-list__value">{selected.email}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Hạng khách</span><span className="mgmt-detail-list__value">{getTierLabel(selected.tier)}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Booking gần nhất</span><span className="mgmt-detail-list__value">{selected.lastBooking}</span></div>
              </div>
              {selected.note && <div className="mgmt-note">{selected.note}</div>}
            </div>
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Chỉ số giao dịch</div>
              <div className="mgmt-grid">
                <div className="mgmt-card"><div className="mgmt-card__body"><div className="mgmt-card__subtitle">Tổng booking</div><div className="revenue-metric-card__value">{selected.bookingCount}</div></div></div>
                <div className="mgmt-card"><div className="mgmt-card__body"><div className="mgmt-card__subtitle">Tổng chi tiêu</div><div className="revenue-metric-card__value">{formatMoney(selected.totalSpent)}₫</div></div></div>
              </div>
            </div>
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Lịch sử gần đây</div>
              <div className="mgmt-activity">
                {selected.recentTrips.length > 0 ? (
                  selected.recentTrips.map((trip) => (
                    <div className="mgmt-activity__item" key={trip.id}>
                      <div className="mgmt-activity__code">{trip.id}</div>
                      <div className="mgmt-activity__main">
                        <div className="mgmt-activity__title">{trip.route}</div>
                        <div className="mgmt-activity__meta">{trip.date}</div>
                      </div>
                      <div className="mgmt-activity__amount">{formatMoney(trip.amount)}₫</div>
                    </div>
                  ))
                ) : (
                  <Empty description="Chưa có giao dịch" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CustomersPage;
