import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "@/api/configs/vehicle.config";
import { VehicleEndPoints } from "@/api/endpoints/vehicle.endpoint";
import { NOTI_SUCCESS } from "@/common/constants/constants";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Input, Modal, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import AddVehicleModal, {
  type VehicleFormValues,
} from "../../components/ManagementCreate/AddVehicleModal";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import { getVehicleFleetSummary } from "../../share";
import {
  VEHICLE_STATUS_META,
  VEHICLE_TYPE_LABEL,
  SEAT_TYPE_LABEL,
  vehicleStatusOptions,
  vehicleTypeOptions,
  getApiErrorMessage,
  toVehicleCreatePayload,
  toVehicleUpdatePayload,
} from "../../share";
import type { IVehicle } from "@/api/dtos/vehicle.dto";
import "../Page2/style.scss";
import "../management.scss";

export const renderVehicleStatus = (status: string) => {
  const meta = VEHICLE_STATUS_META[status];
  if (!meta) return status || "-";
  return (
    <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
      <span className="booking-status__dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
};

const FleetVehiclesPage = () => {
  const { showNotification } = useNotification();
  const { setLoading } = useLoading();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState<IVehicle | null>(null);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IVehicle | null>(null);

  const invalidateVehicles = () => {
    void queryClient.invalidateQueries({ queryKey: [VehicleEndPoints.GET_VEHICLES] });
  };

  const closeVehicleModal = () => {
    setVehicleModalOpen(false);
    setEditingRecord(null);
  };

  const createVehicleMutation = useMutation({
    mutationFn: (payload: Parameters<typeof createVehicle>[number] extends infer T ? T : never) => createVehicle(payload),
    onSuccess: () => {
      showNotification("Thêm phương tiện thành công", NOTI_SUCCESS);
      invalidateVehicles();
      closeVehicleModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), "error");
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateVehicle>[number] extends infer T ? T : never) => updateVehicle(payload),
    onSuccess: (data) => {
      showNotification("Cập nhật phương tiện thành công", NOTI_SUCCESS);
      invalidateVehicles();
      setSelected((prev) => (prev?.id === data.id ? data : prev));
      closeVehicleModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), "error");
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: (_data, id) => {
      showNotification("Xóa phương tiện thành công", NOTI_SUCCESS);
      invalidateVehicles();
      setSelected((prev) => (prev && String(prev.id) === id ? null : prev));
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), "error");
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const { data: vehicleData } = useQuery({
    queryKey: [VehicleEndPoints.GET_VEHICLES],
    queryFn: () => getVehicles(),
  });

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (vehicleData?.items ?? []).filter((vehicle) => {
      const matchKeyword =
        !keyword ||
        vehicle.name.toLowerCase().includes(keyword) ||
        vehicle.code.toLowerCase().includes(keyword) ||
        vehicle.type.toLowerCase().includes(keyword) ||
        vehicle.status.toLowerCase().includes(keyword) ||
        vehicle.seatType.toLowerCase().includes(keyword) ||
        (vehicle.schedule ?? "").toLowerCase().includes(keyword);
      const matchStatus = status === "all" || vehicle.status === status;
      const matchType = type === "all" || vehicle.type === type;
      return matchKeyword && matchStatus && matchType;
    });
  }, [search, status, type, vehicleData]);

  const openCreateModal = () => {
    setEditingRecord(null);
    setVehicleModalOpen(true);
  };

  const openEditModal = (record: IVehicle) => {
    setEditingRecord(record);
    setVehicleModalOpen(true);
  };

  const handleSubmitVehicle = (values: VehicleFormValues) => {
    if (editingRecord) {
      updateMutation.mutate(toVehicleUpdatePayload(values, editingRecord));
      return;
    }
    createVehicleMutation.mutate(toVehicleCreatePayload(values));
  };

  const handleDeleteVehicle = (record: IVehicle) => {
    Modal.confirm({
      className: "bm-modal",
      title: "Xóa phương tiện",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn xóa xe ${record.code}?`,
      okText: "Xóa phương tiện",
      cancelText: "Hủy",
      okButtonProps: { danger: true, style: { background: "#ef4444", borderColor: "#ef4444", borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk() {
        deleteMutation.mutate(String(record.id));
      },
    });
  };

  const columns: ColumnsType<IVehicle> = [
    { title: "Biển số", key: "code", render: (_, record) => (
      <span style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}>{record.code}</span>
    )},
    { title: "Tên xe", key: "name", render: (_, record) => record.name },
    { title: "Loại xe", key: "type", render: (_, record) => VEHICLE_TYPE_LABEL[record.type] ?? record.type },
    { title: "Loại ghế", key: "seatType", render: (_, record) => SEAT_TYPE_LABEL[record.seatType] ?? record.seatType },
    { title: "Sức chứa", key: "seatCount", render: (_, record) => `${record.seatCount} chỗ` },
    { title: "Trạng thái", key: "status", render: (_, record) => renderVehicleStatus(record.status) },
    { title: "", key: "actions", render: (_, record) => (
      <div className="row-actions">
        <Button type="primary" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); setSelected(record); }} />
        <Button type="primary" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); openEditModal(record); }} />
        <Button type="primary" danger icon={<DeleteOutlined />} className="danger" onClick={(e) => { e.stopPropagation(); handleDeleteVehicle(record); }} />
      </div>
    )},
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Vận hành phương tiện</div>
        <div className="mgmt-hero__title">Theo dõi đội xe và sức chứa khai thác</div>
        <div className="mgmt-hero__subtitle">Quản lý thông tin xe, trạng thái, loại ghế và số ghế đang sử dụng.</div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách phương tiện</span>
          <span className="bm-toolbar__count">{filtered.length} xe</span>
        </div>
        <div className="bm-toolbar__right">
          <Input className="bm-search" placeholder="Tìm biển số, tên xe, lịch trình..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select className="bm-select" value={status} onChange={setStatus} options={vehicleStatusOptions} />
          <Select className="bm-select" value={type} onChange={setType} options={vehicleTypeOptions} />
          <Button className="btn-primary" icon={<PlusOutlined />} onClick={openCreateModal}>Thêm phương tiện</Button>
        </div>
      </div>

      <SummaryStrip items={getVehicleFleetSummary(filtered)} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table rowKey={(record) => String(record.id)} columns={columns} dataSource={filtered} pagination={{ pageSize: 6, showSizeChanger: false }} onRow={(record) => ({ onClick: () => setSelected(record) })} />
        </div>
      </div>

      <Drawer className="booking-drawer" open={Boolean(selected)} onClose={() => setSelected(null)} width={420} title={selected ? `${selected.code} - ${selected.name}` : ""}>
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Hồ sơ phương tiện</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Loại xe</span><span className="mgmt-detail-list__value">{VEHICLE_TYPE_LABEL[selected.type] ?? selected.type}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Sức chứa</span><span className="mgmt-detail-list__value">{selected.seatCount} chỗ ({SEAT_TYPE_LABEL[selected.seatType] ?? selected.seatType})</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Lịch trình</span><span className="mgmt-detail-list__value">{selected.schedule || "-"}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Trạng thái</span><span className="mgmt-detail-list__value">{VEHICLE_STATUS_META[selected.status]?.label ?? selected.status}</span></div>
              </div>
            </div>
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Mô tả</div>
              <div className="mgmt-note">{selected.description || "-"}</div>
            </div>
            <div style={{ justifySelf: "center", marginTop: 24 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <Button className="btn-primary" icon={<EditOutlined />} onClick={() => openEditModal(selected)}>Sửa</Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteVehicle(selected)}>Xóa</Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <AddVehicleModal open={vehicleModalOpen} initialRecord={editingRecord} onClose={closeVehicleModal} onSubmit={handleSubmitVehicle} />
    </div>
  );
};

export default FleetVehiclesPage;
