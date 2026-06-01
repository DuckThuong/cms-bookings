import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "@/api/configs/vehicle.config";
import type {
  CreateVehiclePayloadDto,
  IVehicle,
  UpdateVehiclePayloadDto,
} from "@/api/dtos/vehicle.dto";
import { VehicleEndPoints } from "@/api/endpoints/vehicle.endpoint";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
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
import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import AddVehicleModal, {
  type VehicleFormValues,
} from "../../components/ManagementCreate/AddVehicleModal";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import { getVehicleFleetSummary } from "../../share";
import "../Page2/style.scss";
import "../management.scss";

const API_VEHICLE_STATUS_LABEL: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: {
    label: "Dang hoat dong",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  INACTIVE: {
    label: "Ngung hoat dong",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
  },
  MAINTENANCE: {
    label: "Bao duong",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

const API_VEHICLE_TYPE_LABEL: Record<string, string> = {
  SLEEPER: "Xe gường nằm",
  LIMOUSINE: "Xe Limousine",
  COACH: "Xe Khách",
};

const SEAT_TYPE_LABEL: Record<string, string> = {
  BED: "Giường nằm",
  SEAT: "Ghế ngồi",
  STANDARD: "Tiêu chuẩn",
};

const getApiErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) {
    return DEFAULT_MESSAGE;
  }

  const apiMessage = error.response?.data?.message;

  if (typeof apiMessage === "string") {
    return apiMessage;
  }

  if (Array.isArray(apiMessage) && apiMessage[0]) {
    return apiMessage[0];
  }

  return DEFAULT_MESSAGE;
};

const toCreatePayload = (
  values: VehicleFormValues,
): CreateVehiclePayloadDto => ({
  name: values.vehicleName,
  code: values.vehicleCode,
  seatType: values.seatType,
  seatCount: values.seatCount,
  type: values.vehicleType,
  status: values.vehicleStatus,
  schedule: values.schedule,
  description: values.description,
});

const toUpdatePayload = (
  values: VehicleFormValues,
  record: IVehicle,
): UpdateVehiclePayloadDto => ({
  id: record.id,
  ...toCreatePayload(values),
});

const renderStatus = (status: string) => {
  const meta = API_VEHICLE_STATUS_LABEL[status];

  if (!meta) {
    return status || "-";
  }

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
    queryClient.invalidateQueries({
      queryKey: [VehicleEndPoints.GET_VEHICLES],
    });
  };

  const closeVehicleModal = () => {
    setVehicleModalOpen(false);
    setEditingRecord(null);
  };

  const createVehicleMutation = useMutation({
    mutationFn: (payload: CreateVehiclePayloadDto) => createVehicle(payload),
    onSuccess: () => {
      showNotification("Them phuong tien thanh cong", NOTI_SUCCESS);
      invalidateVehicles();
      closeVehicleModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateVehiclePayloadDto) => updateVehicle(payload),
    onSuccess: (data) => {
      showNotification("Cap nhat phuong tien thanh cong", NOTI_SUCCESS);
      invalidateVehicles();
      setSelected((prev) => (prev?.id === data.id ? data : prev));
      closeVehicleModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: (_data, id) => {
      showNotification("Xoa phuong tien thanh cong", NOTI_SUCCESS);
      invalidateVehicles();
      setSelected((prev) => (prev && String(prev.id) === id ? null : prev));
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
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
      updateMutation.mutate(toUpdatePayload(values, editingRecord));
      return;
    }

    createVehicleMutation.mutate(toCreatePayload(values));
  };

  const handleDeleteVehicle = (record: IVehicle) => {
    Modal.confirm({
      className: "bm-modal",
      title: "Xoa phuong tien",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Ban chac chan muon xoa xe ${record.code}?`,
      okText: "Xoa phuong tien",
      cancelText: "Huy",
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
        deleteMutation.mutate(String(record.id));
      },
    });
  };

  const columns: ColumnsType<IVehicle> = [
    {
      title: "Bien so",
      key: "code",
      render: (_, record) => (
        <span
          style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}
        >
          {record.code}
        </span>
      ),
    },
    {
      title: "Ten xe",
      key: "name",
      render: (_, record) => record.name,
    },
    {
      title: "Loai xe",
      key: "type",
      render: (_, record) => API_VEHICLE_TYPE_LABEL[record.type] ?? record.type,
    },
    {
      title: "Suc chua",
      key: "seatCount",
      render: (_, record) =>
        `${record.seatCount} cho (${SEAT_TYPE_LABEL[record.seatType] ?? record.seatType})`,
    },
    {
      title: "Lich trinh",
      key: "schedule",
      render: (_, record) => record.schedule || "-",
    },
    {
      title: "Trang thai",
      key: "status",
      render: (_, record) => renderStatus(record.status),
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
        <div className="mgmt-hero__eyebrow">Van hanh phuong tien</div>
        <div className="mgmt-hero__title">
          Theo doi doi xe va suc chua khai thac
        </div>
        <div className="mgmt-hero__subtitle">
          Quan ly thong tin xe, trang thai, loai ghe va so ghe dang su dung.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sach phuong tien</span>
          <span className="bm-toolbar__count">{filtered.length} xe</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tim bien so, ten xe, lich trinh..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            className="bm-select"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "Tat ca trang thai" },
              { value: "ACTIVE", label: "Dang hoat dong" },
              { value: "INACTIVE", label: "Ngung hoat dong" },
              { value: "MAINTENANCE", label: "Bao duong" },
            ]}
          />
          <Select
            className="bm-select"
            value={type}
            onChange={setType}
            options={[
              { value: "all", label: "Tat ca loai xe" },
              { value: "SLEEPER", label: "Xe giuong nam" },
              { value: "LIMOUSINE", label: "Xe limousine" },
              { value: "COACH", label: "Xe khach" },
            ]}
          />
          <Button
            className="btn-primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Them phuong tien
          </Button>
        </div>
      </div>

      <SummaryStrip items={getVehicleFleetSummary(filtered)} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table
            rowKey={(record) => String(record.id)}
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 6, showSizeChanger: false }}
            onRow={(record) => ({
              onClick: () => setSelected(record),
            })}
          />
        </div>
      </div>

      <Drawer
        className="booking-drawer"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={420}
        title={selected ? `${selected.code} - ${selected.name}` : ""}
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">
                Ho so phuong tien
              </div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Loai xe</span>
                  <span className="mgmt-detail-list__value">
                    {API_VEHICLE_TYPE_LABEL[selected.type] ?? selected.type}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Suc chua</span>
                  <span className="mgmt-detail-list__value">
                    {selected.seatCount} cho (
                    {SEAT_TYPE_LABEL[selected.seatType] ?? selected.seatType})
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Lich trinh</span>
                  <span className="mgmt-detail-list__value">
                    {selected.schedule || "-"}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Trang thai</span>
                  <span className="mgmt-detail-list__value">
                    {API_VEHICLE_STATUS_LABEL[selected.status]?.label ??
                      selected.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Mo ta</div>
              <div className="mgmt-note">{selected.description || "-"}</div>
            </div>

            <div style={{ justifySelf: "center", marginTop: 24 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  className="btn-primary"
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(selected)}
                >
                  Sua
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteVehicle(selected)}
                >
                  Xoa
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <AddVehicleModal
        open={vehicleModalOpen}
        initialRecord={editingRecord}
        onClose={closeVehicleModal}
        onSubmit={handleSubmitVehicle}
      />
    </div>
  );
};

export default FleetVehiclesPage;
