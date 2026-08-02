import { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Input, Modal, Select, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import { ProviderModal } from "../../components/ManagementCreate";
import {
  PROVIDER_STATUS_META,
  getProviderSummary,
  providerStatusOptions,
  type ProviderRecord,
  type ProviderStatusKey,
} from "../../share";
import "../Page2/style.scss";
import "../management.scss";
import { useQuery } from "@tanstack/react-query";
import { getAllCompanies } from "@/api/configs/customer.config";

type ProviderFormValues = Omit<ProviderRecord, "key" | "id">;

const makeProviderId = (nextIndex: number) => `NX-${String(1000 + nextIndex).padStart(4, "0")}`;

const ProvidersPage = () => {
  const [providerData, setProviderData] = useState<ProviderRecord[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProviderStatusKey | "all">("all");
  const [selected, setSelected] = useState<ProviderRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProviderRecord | null>(null);

  const listQuery = useQuery({
    queryKey: ["cmsProviders", search, status],
    queryFn: () =>
      getAllCompanies({
        search: search.trim() || undefined,
        status: status === "all" ? undefined : status,
      }),
  });

  useEffect(() => {
    if (listQuery.data?.items) {
      setProviderData(listQuery.data.items);
    }
  }, [listQuery.data?.items]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return providerData.filter((provider) => {
      const matchKeyword =
        !keyword ||
        provider.id.toLowerCase().includes(keyword) ||
        provider.name.toLowerCase().includes(keyword) ||
        provider.hotline.toLowerCase().includes(keyword) ||
        provider.email.toLowerCase().includes(keyword);
      const matchStatus = status === "all" || provider.status === status;
      return matchKeyword && matchStatus;
    });
  }, [providerData, search, status]);

  const summaryItems = useMemo(() => {
    if (listQuery.data?.summary) {
      return [
        {
          key: "providers",
          label: "Tổng nhà xe",
          color: "#3b82f6",
          value: listQuery.data.summary.totalProviders,
        },
        {
          key: "active",
          label: "Đang hoạt động",
          color: "#22c55e",
          value: listQuery.data.summary.activeCount,
        },
        {
          key: "routes",
          label: "Tổng tuyến",
          color: "#f97316",
          value: listQuery.data.summary.totalRoutes,
        },
        {
          key: "vehicles",
          label: "Tổng xe",
          color: "#a855f7",
          value: listQuery.data.summary.totalVehicles,
        },
      ];
    }

    return getProviderSummary(filtered);
  }, [filtered, listQuery.data?.summary]);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const openEditModal = (record: ProviderRecord) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmitProvider = (values: ProviderFormValues) => {
    if (editingRecord) {
      const updatedRecord: ProviderRecord = { ...editingRecord, ...values };
      setProviderData((prev) =>
        prev.map((item) => (item.key === editingRecord.key ? updatedRecord : item)),
      );
      setSelected((prev) => (prev?.key === editingRecord.key ? updatedRecord : prev));
      message.success(`Đã cập nhật nhà xe ${updatedRecord.name}`);
      closeModal();
      return;
    }

    const nextIndex = providerData.length + 1;
    const nextRecord: ProviderRecord = {
      ...values,
      key: `provider-${String(nextIndex).padStart(2, "0")}`,
      id: makeProviderId(nextIndex),
    };
    setProviderData((prev) => [nextRecord, ...prev]);
    message.success(`Đã thêm nhà xe ${nextRecord.name}`);
    closeModal();
  };

  const removeProvider = (record: ProviderRecord) => {
    setProviderData((prev) => prev.filter((item) => item.key !== record.key));
    setSelected((prev) => (prev?.key === record.key ? null : prev));
    setEditingRecord((prev) => (prev?.key === record.key ? null : prev));
    message.success(`Đã xóa nhà xe ${record.name}`);
  };

  const handleDeleteProvider = (record: ProviderRecord) => {
    Modal.confirm({
      className: "bm-modal",
      title: "Xóa nhà xe",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn xóa nhà xe ${record.name}?`,
      okText: "Xóa nhà xe",
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
        style: {
          background: "#ef4444",
          borderColor: "#ef4444",
          borderRadius: 8,
        },
      },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk() {
        removeProvider(record);
      },
    });
  };

  const columns: ColumnsType<ProviderRecord> = [
    {
      title: "Mã nhà xe",
      dataIndex: "id",
      key: "id",
      render: (value: string) => (
        <span style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}>
          {value}
        </span>
      ),
    },
    {
      title: "Nhà xe",
      key: "name",
      render: (_, record) => (
        <div className="cust-cell">
          <div className="cust-cell__avatar">{record.name.charAt(0)}</div>
          <div>
            <div className="cust-cell__name">{record.name}</div>
            <div className="cust-cell__phone">{record.hotline}</div>
          </div>
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Số tuyến",
      dataIndex: "routeCount",
      key: "routeCount",
      render: (value: number) => <span className="amount-cell">{value}</span>,
    },
    {
      title: "Số xe",
      dataIndex: "vehicleCount",
      key: "vehicleCount",
      render: (value: number) => <span className="amount-cell">{value}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: ProviderRecord["status"]) => {
        const meta = PROVIDER_STATUS_META[value];
        return (
          <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
            <span className="booking-status__dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
        );
      },
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <div className="row-actions">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              setSelected(record);
            }}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              openEditModal(record);
            }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            className="danger"
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteProvider(record);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Quản lý nhà xe</div>
        <div className="mgmt-hero__title">Danh mục đối tác vận tải</div>
        <div className="mgmt-hero__subtitle">
          Theo dõi hồ sơ nhà xe, trạng thái hợp tác và quy mô khai thác theo tuyến, phương tiện.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách nhà xe</span>
          <span className="bm-toolbar__count">{filtered.length} nhà xe</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm mã, tên, hotline, email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            className="bm-select"
            value={status}
            onChange={setStatus}
            options={providerStatusOptions}
          />
          <Button className="btn-ghost" icon={<ReloadOutlined />} onClick={resetFilters} />
          <Button className="btn-primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Thêm nhà xe
          </Button>
        </div>
      </div>

      <SummaryStrip items={summaryItems} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table
            rowKey="key"
            columns={columns}
            dataSource={filtered}
            loading={listQuery.isLoading}
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
        title={selected ? `${selected.name} · ${selected.id}` : ""}
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin nhà xe</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Hotline</span>
                  <span className="mgmt-detail-list__value">{selected.hotline}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Email</span>
                  <span className="mgmt-detail-list__value">{selected.email}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Ngày tham gia</span>
                  <span className="mgmt-detail-list__value">{selected.joinedAt}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Trạng thái</span>
                  <span className="mgmt-detail-list__value">{PROVIDER_STATUS_META[selected.status].label}</span>
                </div>
              </div>
              {selected.note && <div className="mgmt-note">{selected.note}</div>}
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Quy mô khai thác</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Số tuyến</div>
                    <div className="revenue-metric-card__value">{selected.routeCount}</div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Số xe</div>
                    <div className="revenue-metric-card__value">{selected.vehicleCount}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ justifySelf: "center", marginTop: 24 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  className="btn-primary"
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(selected)}
                >
                  Sửa
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteProvider(selected)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <ProviderModal
        open={modalOpen}
        initialRecord={editingRecord}
        onClose={closeModal}
        onSubmit={handleSubmitProvider}
      />
    </div>
  );
};

export default ProvidersPage;
