import {
  createRoad,
  deleteRoad,
  getRoads,
  updateRoad,
} from "@/api/configs/route.config";
import type {
  CreateRoadPayloadDto,
  IRoad,
  UpdateRoadPayloadDto,
} from "@/api/dtos/route.dto";
import { ROAD_ENDPOINTS } from "@/api/endpoints/route.endpoint";
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
import { AddRouteModal } from "../../components/ManagementCreate";
import type { RouteFormValues } from "../../components/ManagementCreate/AddRouteModal";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import {
  ROUTE_STATUS_META,
  routeStatusOptions,
  type RouteStatusKey,
  type SummaryItem,
} from "../../share";
import "../Page2/style.scss";
import "../management.scss";

const normalizeSearchText = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const toDisplayText = (value: unknown, fallback = "-") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return toDisplayText(
      record.name ?? record.code ?? record.id ?? record.label,
      fallback,
    );
  }

  return fallback;
};

const toDisplayNumber = (value: unknown, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
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
    return toDisplayText(apiMessage[0], DEFAULT_MESSAGE);
  }

  if (apiMessage && typeof apiMessage === "object") {
    return toDisplayText(apiMessage, DEFAULT_MESSAGE);
  }

  return DEFAULT_MESSAGE;
};

const toCreatePayload = (values: RouteFormValues): CreateRoadPayloadDto => ({
  name: values.name,
  length: values.length,
  pickUpPoint: values.pickUpPoint,
  dropOffPoint: values.dropOffPoint,
  status: values.status,
  standardDuration: values.standardDuration,
  tripsPerDay: values.tripsPerDay,
  averageOccupancy: values.averageOccupancy,
  estimatedRevenue: values.estimatedRevenue,
  leadVehicle: values.leadVehicle || null,
  demandLevel: values.demandLevel || null,
  note: values.note || null,
});

const toUpdatePayload = (
  values: RouteFormValues,
  record: IRoad,
): UpdateRoadPayloadDto => ({
  id: record.id,
  ...toCreatePayload(values),
});

const getRoadSummary = (data: IRoad[]): SummaryItem[] => {
  const occupancy =
    data.length > 0
      ? Math.round(
          data.reduce(
            (sum, item) => sum + toDisplayNumber(item.averageOccupancy),
            0,
          ) /
            data.length,
        )
      : 0;

  return [
    {
      key: "routes",
      label: "Tổng tuyến",
      color: "#3b82f6",
      value: data.length,
    },
    {
      key: "peak",
      label: "Nhu cầu cao",
      color: "#f97316",
      value: data.filter((item) => item.status === "peak").length,
    },
    {
      key: "tripsPerDay",
      label: "Chuyến/ngày",
      color: "#22c55e",
      value: data.reduce(
        (sum, item) => sum + toDisplayNumber(item.tripsPerDay),
        0,
      ),
    },
    {
      key: "occupancy",
      label: "Lấp đầy TB",
      color: "#eab308",
      value: `${occupancy}%`,
    },
  ];
};

const renderStatus = (status: string) => {
  const meta = ROUTE_STATUS_META[status as RouteStatusKey];

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

const RoutesPage = () => {
  const { showNotification } = useNotification();
  const { setLoading } = useLoading();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<IRoad | null>(null);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IRoad | null>(null);

  const invalidateRoads = () => {
    queryClient.invalidateQueries({
      queryKey: [ROAD_ENDPOINTS.list.path],
    });
  };

  const closeRouteModal = () => {
    setRouteModalOpen(false);
    setEditingRecord(null);
  };

  const createRoadMutation = useMutation({
    mutationFn: (payload: CreateRoadPayloadDto) => createRoad(payload),
    onSuccess: () => {
      showNotification("Thêm tuyến đường thành công", NOTI_SUCCESS);
      invalidateRoads();
      closeRouteModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const updateRoadMutation = useMutation({
    mutationFn: (payload: UpdateRoadPayloadDto) => updateRoad(payload),
    onSuccess: (data) => {
      showNotification("Cập nhật tuyến đường thành công", NOTI_SUCCESS);
      invalidateRoads();
      setSelected((prev) => (prev?.id === data.id ? data : prev));
      closeRouteModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const deleteRoadMutation = useMutation({
    mutationFn: (id: number) => deleteRoad(id),
    onSuccess: (_data, id) => {
      showNotification("Xóa tuyến đường thành công", NOTI_SUCCESS);
      invalidateRoads();
      setSelected((prev) => (prev?.id === id ? null : prev));
      setEditingRecord((prev) => (prev?.id === id ? null : prev));
      setRouteModalOpen((prev) => (editingRecord?.id === id ? false : prev));
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const { data: roadData } = useQuery({
    queryKey: [ROAD_ENDPOINTS.list.path],
    queryFn: () => getRoads(),
  });

  const filtered = useMemo(() => {
    const keyword = normalizeSearchText(search.trim());
    const data = roadData ?? [];

    return data.filter((road) => {
      const searchableText = [
        road.code,
        road.name,
        road.startPoint,
        road.endPoint,
        road.leadVehicle,
        road.demandLevel,
      ]
        .map(normalizeSearchText)
        .join(" ");
      const matchKeyword = !keyword || searchableText.includes(keyword);
      const matchStatus = status === "all" || road.status === status;

      return matchKeyword && matchStatus;
    });
  }, [roadData, search, status]);

  const openCreateModal = () => {
    setEditingRecord(null);
    setRouteModalOpen(true);
  };

  const openEditModal = (record: IRoad) => {
    setEditingRecord(record);
    setRouteModalOpen(true);
  };

  const handleSubmitRoute = (values: RouteFormValues) => {
    if (editingRecord) {
      updateRoadMutation.mutate(toUpdatePayload(values, editingRecord));
      return;
    }

    createRoadMutation.mutate(toCreatePayload(values));
  };

  const handleDeleteRoute = (record: IRoad) => {
    Modal.confirm({
      className: "bm-modal",
      title: "Xóa tuyến đường",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn xóa tuyến ${toDisplayText(
        record.code,
        String(record.id),
      )}?`,
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
        deleteRoadMutation.mutate(record.id);
      },
    });
  };

  const columns: ColumnsType<IRoad> = [
    {
      title: "Mã tuyến đường",
      key: "code",
      render: (_, record) => (
        <span
          style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}
        >
          {toDisplayText(record.code, String(record.id))}
        </span>
      ),
    },
    {
      title: "Tên tuyến đường",
      key: "name",
      render: (_, record) => toDisplayText(record.name),
    },
    {
      title: "Điểm đón khách",
      key: "pickUpPoint",
      render: (_, record) => toDisplayText(record.pickUpPoint),
    },
    {
      title: "Điểm trả khách",
      key: "dropOffPoint",
      render: (_, record) => toDisplayText(record.dropOffPoint),
    },
    {
      title: "Thông số",
      key: "specs",
      render: (_, record) => (
        <div>
          <div className="cust-cell__name">
            {toDisplayNumber(record.length)} km
          </div>
          <div className="cust-cell__phone">
            {toDisplayText(record.standardDuration)} tiêu chuẩn
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: string) => renderStatus(toDisplayText(value, "")),
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
              handleDeleteRoute(record);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Vận hành tuyến đường</div>
        <div className="mgmt-hero__title">
          Năng lực khai thác theo từng tuyến trong điểm
        </div>
        <div className="mgmt-hero__subtitle">
          Theo dõi tuyến có nhu cầu cao, tuyến giảm chuyến và sức kéo doanh thu
          cua tung hanh lang van chuyen.
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
            onClick={openCreateModal}
          >
            Thêm tuyến đường
          </Button>
        </div>
      </div>

      <SummaryStrip items={getRoadSummary(filtered)} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table
            rowKey={(record) => String(record.id)}
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
        title={
          selected
            ? `${toDisplayText(selected.code, String(selected.id))} - ${toDisplayText(selected.name)}`
            : ""
        }
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin tuyến</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Quãng đường</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayNumber(selected.length)} km
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">
                    Thời gian chuẩn
                  </span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.standardDuration)}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Điểm đầu/cuối</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.startPoint)} -{" "}
                    {toDisplayText(selected.endPoint)}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Xe chủ lực</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.leadVehicle)}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Nhu cầu</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.demandLevel)}
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
                      {toDisplayNumber(selected.tripsPerDay)}
                    </div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Lấp đầy TB</div>
                    <div className="revenue-metric-card__value">
                      {toDisplayNumber(selected.averageOccupancy)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="mgmt-note">{toDisplayText(selected.note)}</div>
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
        mode={editingRecord ? "edit" : "create"}
        open={routeModalOpen}
        onClose={closeRouteModal}
        initialValues={editingRecord}
        onSubmit={handleSubmitRoute}
      />
    </div>
  );
};

export default RoutesPage;
