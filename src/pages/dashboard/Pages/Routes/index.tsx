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

const formatMoney = (value?: number | null) =>
  `${(value ?? 0).toLocaleString("vi-VN")}d`;

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
  startPoint: values.startPoint,
  endPoint: values.endPoint,
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
      label: "Tong tuyen",
      color: "#3b82f6",
      value: data.length,
    },
    {
      key: "peak",
      label: "Nhu cau cao",
      color: "#f97316",
      value: data.filter((item) => item.status === "peak").length,
    },
    {
      key: "tripsPerDay",
      label: "Chuyen/ngay",
      color: "#22c55e",
      value: data.reduce(
        (sum, item) => sum + toDisplayNumber(item.tripsPerDay),
        0,
      ),
    },
    {
      key: "occupancy",
      label: "Lap day TB",
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
      showNotification("Them tuyen duong thanh cong", NOTI_SUCCESS);
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
      showNotification("Cap nhat tuyen duong thanh cong", NOTI_SUCCESS);
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
      showNotification("Xoa tuyen duong thanh cong", NOTI_SUCCESS);
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
      title: "Xoa tuyen duong",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Ban chac chan muon xoa tuyen ${toDisplayText(
        record.code,
        String(record.id),
      )}?`,
      okText: "Xoa tuyen",
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
        deleteRoadMutation.mutate(record.id);
      },
    });
  };

  const columns: ColumnsType<IRoad> = [
    {
      title: "Ma tuyen",
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
      title: "Tuyen duong",
      key: "name",
      render: (_, record) => toDisplayText(record.name),
    },
    {
      title: "Thong so",
      key: "specs",
      render: (_, record) => (
        <div>
          <div className="cust-cell__name">
            {toDisplayNumber(record.length)} km
          </div>
          <div className="cust-cell__phone">
            {toDisplayText(record.standardDuration)} tieu chuan
          </div>
        </div>
      ),
    },
    {
      title: "Khai thac",
      key: "ops",
      render: (_, record) => (
        <div>
          <div className="cust-cell__name">
            {toDisplayNumber(record.tripsPerDay)} chuyen/ngay
          </div>
          <div className="cust-cell__phone">
            {toDisplayNumber(record.averageOccupancy)}% lap day
          </div>
        </div>
      ),
    },
    {
      title: "Doanh thu uoc tinh",
      dataIndex: "estimatedRevenue",
      key: "estimatedRevenue",
      render: (value: number) => (
        <span className="amount-cell">{formatMoney(value)}</span>
      ),
    },
    {
      title: "Trang thai",
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
        <div className="mgmt-hero__eyebrow">Van hanh tuyen duong</div>
        <div className="mgmt-hero__title">
          Nang luc khai thac theo tung tuyen trong diem
        </div>
        <div className="mgmt-hero__subtitle">
          Theo doi tuyen co nhu cau cao, tuyen giam chuyen va suc keo doanh thu
          cua tung hanh lang van chuyen.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sach tuyen</span>
          <span className="bm-toolbar__count">{filtered.length} tuyen</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tim ma tuyen, ten tuyen, xe chu luc..."
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
            Them tuyen duong
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
              <div className="drawer-body__section-title">Thong tin tuyen</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Quang duong</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayNumber(selected.length)} km
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">
                    Thoi luong chuan
                  </span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.standardDuration)}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Diem dau/cuoi</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.startPoint)} -{" "}
                    {toDisplayText(selected.endPoint)}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Xe chu luc</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.leadVehicle)}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Nhu cau</span>
                  <span className="mgmt-detail-list__value">
                    {toDisplayText(selected.demandLevel)}
                  </span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">
                Hieu suat khai thac
              </div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Chuyen/ngay</div>
                    <div className="revenue-metric-card__value">
                      {toDisplayNumber(selected.tripsPerDay)}
                    </div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Lap day TB</div>
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
                  Sua
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteRoute(selected)}
                >
                  Xoa
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
