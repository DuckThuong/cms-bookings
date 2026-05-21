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
import { AddVehicleModal } from "../../components/ManagementCreate";
import {
  drivers,
  fleetStatusOptions,
  fleetTypeOptions,
  fleetVehicles,
  getFleetSummary,
  operationRoutes,
  routeOptions,
  trips,
  VEHICLE_STATUS_META,
  type FleetVehicleRecord,
} from "../../share";
import "../Page2/style.scss";
import "../management.scss";

const FleetVehiclesPage = () => {
  const [vehicleData, setVehicleData] = useState(fleetVehicles);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [route, setRoute] = useState("all");
  const [selected, setSelected] = useState<FleetVehicleRecord | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FleetVehicleRecord | null>(
    null,
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return vehicleData.filter((vehicle) => {
      const matchKeyword =
        !keyword ||
        vehicle.plateNumber.toLowerCase().includes(keyword) ||
        vehicle.primaryDriver.toLowerCase().includes(keyword) ||
        vehicle.assignedRoute.toLowerCase().includes(keyword);
      const matchStatus = status === "all" || vehicle.status === status;
      const matchType = type === "all" || vehicle.type === type;
      const matchRoute = route === "all" || vehicle.assignedRoute === route;
      return matchKeyword && matchStatus && matchType && matchRoute;
    });
  }, [route, search, status, type, vehicleData]);

  const openEditModal = (record: FleetVehicleRecord) => {
    setEditingRecord(record);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingRecord(null);
  };

  const handleAddVehicle = (record: FleetVehicleRecord) => {
    setVehicleData((prev) => [record, ...prev]);
    message.success(`Đã thêm vehicle ${record.plateNumber}`);
  };

  const handleEditVehicle = (record: FleetVehicleRecord) => {
    setVehicleData((prev) =>
      prev.map((item) => (item.key === record.key ? record : item)),
    );
    setSelected((prev) => (prev?.key === record.key ? record : prev));
    message.success(`Đã cập nhật vehicle ${record.plateNumber}`);
    closeEditModal();
  };

  const getDeleteBlockReason = (record: FleetVehicleRecord) => {
    const activeTrip = trips.find(
      (trip) => trip.vehicle === record.plateNumber,
    );
    if (activeTrip) {
      return `Không thể xóa xe ${record.plateNumber} vì đang được gán cho chuyến ${activeTrip.id}.`;
    }

    const leadRoute = operationRoutes.find(
      (routeItem) => routeItem.leadVehicle === record.plateNumber,
    );
    if (leadRoute) {
      return `Không thể xóa xe ${record.plateNumber} vì đang là xe chủ lực của tuyến ${leadRoute.id}.`;
    }

    const assignedDriver = drivers.find(
      (driver) => driver.assignedVehicle === record.plateNumber,
    );
    if (assignedDriver) {
      return `Không thể xóa xe ${record.plateNumber} vì đang được phân cho tài xế ${assignedDriver.id}.`;
    }

    return null;
  };

  const removeVehicle = (record: FleetVehicleRecord) => {
    setVehicleData((prev) => prev.filter((item) => item.key !== record.key));
    setSelected((prev) => (prev?.key === record.key ? null : prev));
    setEditingRecord((prev) => (prev?.key === record.key ? null : prev));
    setEditModalOpen((prev) =>
      editingRecord?.key === record.key ? false : prev,
    );
    message.success(`Đã xóa vehicle ${record.plateNumber}`);
  };

  const handleDeleteVehicle = (record: FleetVehicleRecord) => {
    const blockReason = getDeleteBlockReason(record);
    if (blockReason) {
      message.warning(blockReason);
      return;
    }

    Modal.confirm({
      className: "bm-modal",
      title: "Xóa phương tiện",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn xóa xe ${record.plateNumber}?`,
      okText: "Xóa phương tiện",
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
        removeVehicle(record);
      },
    });
  };

  const columns: ColumnsType<FleetVehicleRecord> = [
    {
      title: "Biển số",
      dataIndex: "plateNumber",
      key: "plateNumber",
      render: (value: string) => (
        <span
          style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}
        >
          {value}
        </span>
      ),
    },
    { title: "Loại xe", dataIndex: "type", key: "type" },
    {
      title: "Sức chứa",
      dataIndex: "seats",
      key: "seats",
      render: (value: number) => `${value} chỗ`,
    },
    {
      title: "Tuyến phụ trách",
      dataIndex: "assignedRoute",
      key: "assignedRoute",
    },
    { title: "Tài xế chính", dataIndex: "primaryDriver", key: "primaryDriver" },
    {
      title: "Sử dụng",
      dataIndex: "utilizationRate",
      key: "utilizationRate",
      render: (value: number) => <span className="amount-cell">{value}%</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: FleetVehicleRecord["status"]) => {
        const meta = VEHICLE_STATUS_META[value];
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
              handleDeleteVehicle(record);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Vận hành phương tiện</div>
        <div className="mgmt-hero__title">
          Theo dõi đội xe và mức độ sẵn sàng khai thác
        </div>
        <div className="mgmt-hero__subtitle">
          Giám sát xe đang khai thác, xe chờ phân công và các lịch bảo dưỡng ảnh
          hưởng đến năng lực phục vụ.
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
          />
          <Select
            className="bm-select"
            value={status}
            onChange={setStatus}
            options={fleetStatusOptions}
          />
          <Select
            className="bm-select"
            value={type}
            onChange={setType}
            options={fleetTypeOptions}
          />
          <Select
            className="bm-select"
            value={route}
            onChange={setRoute}
            options={routeOptions}
          />
          <Button
            className="btn-primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalOpen(true)}
          >
            Thêm phương tiện
          </Button>
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
        title={selected ? `${selected.plateNumber} · ${selected.type}` : ""}
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">
                Hồ sơ phương tiện
              </div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">
                    Tuyến phụ trách
                  </span>
                  <span className="mgmt-detail-list__value">
                    {selected.assignedRoute}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Tài xế chính</span>
                  <span className="mgmt-detail-list__value">
                    {selected.primaryDriver}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Sức chứa</span>
                  <span className="mgmt-detail-list__value">
                    {selected.seats} chỗ
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">
                    Bảo dưỡng gần nhất
                  </span>
                  <span className="mgmt-detail-list__value">
                    {selected.lastMaintenance}
                  </span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">
                Tình trạng khai thác
              </div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Sử dụng</div>
                    <div className="revenue-metric-card__value">
                      {selected.utilizationRate}%
                    </div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Bảo dưỡng kế tiếp</div>
                    <div className="report-type">
                      {selected.nextMaintenance}
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
                  onClick={() => handleDeleteVehicle(selected)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <AddVehicleModal
        mode="create"
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddVehicle}
      />
      <AddVehicleModal
        mode="edit"
        open={editModalOpen}
        onClose={closeEditModal}
        initialValues={editingRecord}
        onSubmit={handleEditVehicle}
      />
    </div>
  );
};

export default FleetVehiclesPage;
