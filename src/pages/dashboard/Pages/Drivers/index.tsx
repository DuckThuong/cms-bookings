import {
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
} from "@/api/configs/driver.config";
import type {
  CreateDriverPayloadDto,
  DriverResponseDto,
  UpdateDriverPayloadDto,
} from "@/api/dtos/driver.dto";
import { DriverEndPoints } from "@/api/endpoints/driver.endpoint";
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
  ReloadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Input, Modal, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { isAxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { AddDriverModal } from "../../components/ManagementCreate";
import type { DriverFormValues } from "../../components/ManagementCreate/AddDriverModal";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import { driverLicenseOptions } from "../../share";
import type { SummaryItem } from "../../share";
import "../Page2/style.scss";
import "../management.scss";

const DRIVER_STATUS_META: Record<
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

const DRIVER_STATUS_OPTIONS = [
  { value: "all", label: "Tat ca trang thai" },
  { value: "ACTIVE", label: "Dang hoat dong" },
  { value: "INACTIVE", label: "Ngung hoat dong" },
  { value: "MAINTENANCE", label: "Bao duong" },
];

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

const normalizeSearchText = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const toCreatePayload = (values: DriverFormValues): CreateDriverPayloadDto => ({
  name: values.name,
  license: values.license,
  licenseNum: values.licenseNum,
  phone: values.phone,
  email: values.email,
  status: values.status,
  description: values.description,
});

const toUpdatePayload = (
  values: DriverFormValues,
  record: DriverResponseDto,
): UpdateDriverPayloadDto => ({
  id: Number(record.id),
  name: values.name,
  licenseNum: values.licenseNum,
  license: values.license,
  phone: values.phone,
  email: values.email,
  status: values.status,
  description: values.description,
});

const getDriverSummary = (data: DriverResponseDto[]): SummaryItem[] => [
  {
    key: "drivers",
    label: "Tong tai xe",
    color: "#3b82f6",
    value: data.length,
  },
  {
    key: "active",
    label: "Dang hoat dong",
    color: "#22c55e",
    value: data.filter((item) => item.status === "ACTIVE").length,
  },
  {
    key: "maintenance",
    label: "Bao duong",
    color: "#ef4444",
    value: data.filter((item) => item.status === "MAINTENANCE").length,
  },
  {
    key: "e-license",
    label: "Bang E",
    color: "#a855f7",
    value: data.filter((item) => item.license === "E").length,
  },
];

const renderStatus = (status: string) => {
  const meta = DRIVER_STATUS_META[status];

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

const DriversPage = () => {
  const { showNotification } = useNotification();
  const { setLoading } = useLoading();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [license, setLicense] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<DriverResponseDto | null>(null);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DriverResponseDto | null>(
    null,
  );

  const invalidateDrivers = () => {
    queryClient.invalidateQueries({
      queryKey: [DriverEndPoints.GET_DRIVERS],
    });
  };

  const closeDriverModal = () => {
    setDriverModalOpen(false);
    setEditingRecord(null);
  };

  const createDriverMutation = useMutation({
    mutationFn: (payload: CreateDriverPayloadDto) => createDriver(payload),
    onSuccess: () => {
      showNotification("Them tai xe thanh cong", NOTI_SUCCESS);
      invalidateDrivers();
      closeDriverModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const updateDriverMutation = useMutation({
    mutationFn: (payload: UpdateDriverPayloadDto) => updateDriver(payload),
    onSuccess: () => {
      showNotification("Cap nhat tai xe thanh cong", NOTI_SUCCESS);
      invalidateDrivers();
      closeDriverModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const deleteDriverMutation = useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: (_data, id) => {
      showNotification("Xoa tai xe thanh cong", NOTI_SUCCESS);
      invalidateDrivers();
      setSelected((prev) => (prev?.id === id ? null : prev));
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), NOTI_ERROR);
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const { data: driverData } = useQuery({
    queryKey: [DriverEndPoints.GET_DRIVERS],
    queryFn: () => getDrivers(),
  });

  const filtered = useMemo(() => {
    const keyword = normalizeSearchText(search.trim());
    const data = driverData ?? [];

    return data.filter((driver) => {
      const searchableText = [
        driver.name,
        driver.phone,
        driver.email,
        driver.id,
        driver.code,
        driver.license,
        driver.licenseNum,
      ]
        .map(normalizeSearchText)
        .join(" ");
      const matchKeyword = !keyword || searchableText.includes(keyword);
      const matchLicense = license === "all" || driver.license === license;
      const matchStatus = status === "all" || driver.status === status;

      return matchKeyword && matchLicense && matchStatus;
    });
  }, [driverData, license, search, status]);

  const openCreateModal = () => {
    setEditingRecord(null);
    setDriverModalOpen(true);
  };

  const openEditModal = (record: DriverResponseDto) => {
    setEditingRecord(record);
    setDriverModalOpen(true);
  };

  const handleSubmitDriver = (values: DriverFormValues) => {
    if (editingRecord) {
      updateDriverMutation.mutate(toUpdatePayload(values, editingRecord));
      return;
    }

    createDriverMutation.mutate(toCreatePayload(values));
  };

  const handleDeleteDriver = (record: DriverResponseDto) => {
    Modal.confirm({
      className: "bm-modal",
      title: "Xoa tai xe",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Ban chac chan muon xoa tai xe ${record.code ?? record.id}?`,
      okText: "Xoa tai xe",
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
        deleteDriverMutation.mutate(record.id);
      },
    });
  };

  const columns: ColumnsType<DriverResponseDto> = [
    {
      title: "Ma tai xe",
      key: "code",
      render: (_, record) => (
        <span
          style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}
        >
          {record.code ?? record.id}
        </span>
      ),
    },
    {
      title: "Tai xe",
      key: "name",
      render: (_, record) => (
        <div className="cust-cell">
          <div className="cust-cell__avatar">{record?.name?.charAt(0)}</div>
          <div>
            <div className="cust-cell__name">{record?.name}</div>
            <div className="cust-cell__phone">{record?.phone}</div>
          </div>
        </div>
      ),
    },
    { title: "Bang lai", dataIndex: "license", key: "license" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "So chuyen",
      dataIndex: "totalTurn",
      key: "totalTurn",
      render: (value: number) => value ?? 0,
    },
    {
      title: "Danh gia",
      dataIndex: "rate",
      key: "rate",
      render: (value: number) => (
        <span className="amount-cell">{(value ?? 0).toFixed(1)}*</span>
      ),
    },
    {
      title: "Trang thai",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
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
              handleDeleteDriver(record);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Quan ly tai xe</div>
        <div className="mgmt-hero__title">
          Theo doi ho so va trang thai tai xe
        </div>
        <div className="mgmt-hero__subtitle">
          Giam sat thong tin lien he, bang lai, danh gia va trang thai van hanh
          cua doi ngu tai xe.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sach tai xe</span>
          <span className="bm-toolbar__count">{filtered.length} ho so</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tim ten, SDT, email, ma tai xe..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            className="bm-select"
            value={license}
            onChange={setLicense}
            options={driverLicenseOptions}
          />
          <Select
            className="bm-select"
            value={status}
            onChange={setStatus}
            options={DRIVER_STATUS_OPTIONS}
          />
          <Button
            className="btn-ghost"
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearch("");
              setLicense("all");
              setStatus("all");
            }}
          />
          <Button
            className="btn-primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Them tai xe
          </Button>
        </div>
      </div>

      <SummaryStrip items={getDriverSummary(filtered)} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table
            rowKey={(record) => record.id}
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
          selected ? `${selected.name} · ${selected.code ?? selected.id}` : ""
        }
      >
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thong tin ho so</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Dien thoai</span>
                  <span className="mgmt-detail-list__value">
                    {selected.phone}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Email</span>
                  <span className="mgmt-detail-list__value">
                    {selected.email}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Bang lai</span>
                  <span className="mgmt-detail-list__value">
                    {selected.license}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Trang thai</span>
                  <span className="mgmt-detail-list__value">
                    {DRIVER_STATUS_META[selected.status]?.label ??
                      selected.status}
                  </span>
                </div>
              </div>
              <div className="mgmt-note">
                {selected.description || "Chưa có mô tả"}
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Hieu suat</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Tong chuyen</div>
                    <div className="revenue-metric-card__value">
                      {selected.totalTurn ?? 0}
                    </div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Danh gia</div>
                    <div className="revenue-metric-card__value">
                      {(selected.rate ?? 0).toFixed(1)}*
                    </div>
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
                  Sua
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteDriver(selected)}
                >
                  Xoa
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <AddDriverModal
        open={driverModalOpen}
        initialRecord={editingRecord}
        onClose={closeDriverModal}
        onSubmit={handleSubmitDriver}
      />
    </div>
  );
};

export default DriversPage;
