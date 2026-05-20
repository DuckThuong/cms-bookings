import React, { useMemo, useState } from "react";
import { Button, Drawer, Input, Modal, Select, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import { AddRouteModal } from "../../components/ManagementCreate";
import {
  drivers,
  fleetVehicles,
  getRouteSummary,
  operationRoutes,
  ROUTE_STATUS_META,
  routeStatusOptions,
  trips,
  type RouteRecord,
} from "../../share";
import "../Page2/style.scss";
import "../management.scss";

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

const RoutesPage = () => {
  const [routeData, setRouteData] = useState(operationRoutes);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<RouteRecord | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RouteRecord | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return routeData.filter((routeItem) => {
      const matchKeyword =
        !keyword ||
        routeItem.id.toLowerCase().includes(keyword) ||
        routeItem.route.toLowerCase().includes(keyword) ||
        routeItem.leadVehicle.toLowerCase().includes(keyword);
      const matchStatus = status === "all" || routeItem.status === status;
      return matchKeyword && matchStatus;
    });
  }, [routeData, search, status]);

  const openEditModal = (record: RouteRecord) => {
    setEditingRecord(record);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingRecord(null);
  };

  const handleAddRoute = (record: RouteRecord) => {
    setRouteData((prev) => [record, ...prev]);
    message.success(`Đã thêm route ${record.id}`);
  };

  const handleEditRoute = (record: RouteRecord) => {
    setRouteData((prev) =>
      prev.map((item) => (item.key === record.key ? record : item)),
    );
    setSelected((prev) => (prev?.key === record.key ? record : prev));
    message.success(`Đã cập nhật route ${record.id}`);
    closeEditModal();
  };

  const getDeleteBlockReason = (record: RouteRecord) => {
    const activeTrip = trips.find((trip) => trip.route === record.route);
    if (activeTrip) {
      return `Không thể xóa tuyến ${record.id} vì đang được dùng bởi chuyến ${activeTrip.id}.`;
    }

    const assignedVehicle = fleetVehicles.find(
      (vehicle) => vehicle.assignedRoute === record.route,
    );
    if (assignedVehicle) {
      return `Không thể xóa tuyến ${record.id} vì đang được gán cho xe ${assignedVehicle.plateNumber}.`;
    }

    const assignedDriver = drivers.find(
      (driver) => driver.mainRoute === record.route,
    );
    if (assignedDriver) {
      return `Không thể xóa tuyến ${record.id} vì đang là tuyến chính của tài xế ${assignedDriver.id}.`;
    }

    return null;
  };

  const removeRoute = (record: RouteRecord) => {
    setRouteData((prev) => prev.filter((item) => item.key !== record.key));
    setSelected((prev) => (prev?.key === record.key ? null : prev));
    setEditingRecord((prev) => (prev?.key === record.key ? null : prev));
    setEditModalOpen((prev) =>
      editingRecord?.key === record.key ? false : prev,
    );
    message.success(`Đã xóa route ${record.id}`);
  };

  const handleDeleteRoute = (record: RouteRecord) => {
    const blockReason = getDeleteBlockReason(record);
    if (blockReason) {
      message.warning(blockReason);
      return;
    }

    Modal.confirm({
      className: "bm-modal",
      title: "Xóa tuyến đường",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn xóa tuyến ${record.id}?`,
      okText: "Xóa tuyến",
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
        removeRoute(record);
      },
    });
  };

  const columns: ColumnsType<RouteRecord> = [
    {
      title: "Mã tuyến",
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
    { title: "Tuyến đường", dataIndex: "route", key: "route" },
    {
      title: "Thông số",
      key: "specs",
      render: (_, record) => (
        <div>
          <div className="cust-cell__name">{record.distanceKm} km</div>
          <div className="cust-cell__phone">
            {record.standardDuration} tiêu chuẩn
          </div>
        </div>
      ),
    },
    {
      title: "Khai thác",
      key: "ops",
      render: (_, record) => (
        <div>
          <div className="cust-cell__name">
            {record.tripsPerDay} chuyến/ngày
          </div>
          <div className="cust-cell__phone">
            {record.averageOccupancy}% lấp đầy
          </div>
        </div>
      ),
    },
    {
      title: "Doanh thu ước tính",
      dataIndex: "estimatedRevenue",
      key: "estimatedRevenue",
      render: (value: number) => (
        <span className="amount-cell">{formatMoney(value)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: RouteRecord["status"]) => {
        const meta = ROUTE_STATUS_META[value];
        return (
          <span
            className="booking-status"
            style={{ background: meta.bg, color: meta.color }}
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
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <div className="row-actions">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelected(record);
            }}
          >
            <EyeOutlined />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openEditModal(record);
            }}
          >
            <EditOutlined />
          </button>
          <button
            type="button"
            className="danger"
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteRoute(record);
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Vận hành tuyến đường</div>
        <div className="mgmt-hero__title">
          Năng lực khai thác theo từng tuyến trọng điểm
        </div>
        <div className="mgmt-hero__subtitle">
          Theo dõi tuyến có nhu cầu cao, tuyến giảm chuyến và sức kéo doanh thu
          của từng hành lang vận chuyển.
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
          />
          <Select
            className="bm-select"
            value={status}
            onChange={setStatus}
            options={routeStatusOptions}
          />
          <Button
            className="btn-primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalOpen(true)}
          >
            Thêm tuyến đường
          </Button>
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
        title={selected ? `${selected.id} · ${selected.route}` : ""}
        
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin tuyến</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Quãng đường</span>
                  <span className="mgmt-detail-list__value">
                    {selected.distanceKm} km
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">
                    Thời lượng chuẩn
                  </span>
                  <span className="mgmt-detail-list__value">
                    {selected.standardDuration}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Xe chủ lực</span>
                  <span className="mgmt-detail-list__value">
                    {selected.leadVehicle}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Nhu cầu</span>
                  <span className="mgmt-detail-list__value">
                    {selected.demandLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">
                Hiệu suất khai thác
              </div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Chuyến/ngày</div>
                    <div className="revenue-metric-card__value">
                      {selected.tripsPerDay}
                    </div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Lấp đầy TB</div>
                    <div className="revenue-metric-card__value">
                      {selected.averageOccupancy}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="mgmt-note">{selected.note}</div>
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
                  onClick={() => handleDeleteRoute(selected)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <AddRouteModal
        mode="create"
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddRoute}
      />
      <AddRouteModal
        mode="edit"
        open={editModalOpen}
        onClose={closeEditModal}
        initialValues={editingRecord}
        onSubmit={handleEditRoute}
      />
    </div>
  );
};

export default RoutesPage;
