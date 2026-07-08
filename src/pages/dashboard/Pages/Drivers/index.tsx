import {
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
} from "@/api/configs/driver.config";
import { DriverEndPoints } from "@/api/endpoints/driver.endpoint";
import { NOTI_SUCCESS } from "@/common/constants/constants";
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
import { useMemo, useState } from "react";
import { AddDriverModal } from "../../components/ManagementCreate";
import type { DriverFormValues } from "../../components/ManagementCreate/AddDriverModal";
import SummaryStrip from "../../components/Page2/SummaryStrip";
import {
  DRIVER_STATUS_META_API,
  driverStatusOptions,
  normalizeSearchText,
  getApiErrorMessage,
  toDriverCreatePayload,
  toDriverUpdatePayload,
  type SummaryItem,
} from "../../share";
import type { DriverResponseDto } from "@/api/dtos/driver.dto";
import "../Page2/style.scss";
import "../management.scss";

const getDriverSummary = (data: DriverResponseDto[]): SummaryItem[] => [
  { key: "drivers", label: "Tổng tài xế", color: "#3b82f6", value: data.length },
  { key: "active", label: "Đang hoạt động", color: "#22c55e", value: data.filter((item) => item.status === "ACTIVE").length },
  { key: "maintenance", label: "Bảo dưỡng", color: "#ef4444", value: data.filter((item) => item.status === "MAINTENANCE").length },
  { key: "e-license", label: "Bằng E", color: "#a855f7", value: data.filter((item) => item.license === "E").length },
];

export const renderDriverStatus = (status: string) => {
  const meta = DRIVER_STATUS_META_API[status];
  if (!meta) return status || "-";
  return (
    <span className="booking-status" style={{ background: meta.bg, color: meta.color }}>
      <span className="booking-status__dot" style={{ background: meta.color }} />
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
  const [editingRecord, setEditingRecord] = useState<DriverResponseDto | null>(null);

  const invalidateDrivers = () => {
    void queryClient.invalidateQueries({ queryKey: [DriverEndPoints.GET_DRIVERS] });
  };

  const closeDriverModal = () => {
    setDriverModalOpen(false);
    setEditingRecord(null);
  };

  const createDriverMutation = useMutation({
    mutationFn: (payload: Parameters<typeof createDriver>[number] extends infer T ? T : never) => createDriver(payload),
    onSuccess: () => {
      showNotification("Thêm tài xế thành công", NOTI_SUCCESS);
      invalidateDrivers();
      closeDriverModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), "error");
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const updateDriverMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateDriver>[number] extends infer T ? T : never) => updateDriver(payload),
    onSuccess: () => {
      showNotification("Cập nhật tài xế thành công", NOTI_SUCCESS);
      invalidateDrivers();
      closeDriverModal();
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), "error");
    },
    onSettled: () => setLoading(false),
    onMutate: () => setLoading(true),
  });

  const deleteDriverMutation = useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: (_data, id) => {
      showNotification("Xóa tài xế thành công", NOTI_SUCCESS);
      invalidateDrivers();
      setSelected((prev) => (prev?.id === id ? null : prev));
    },
    onError: (error) => {
      showNotification(getApiErrorMessage(error), "error");
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
        driver.name, driver.phone, driver.email, driver.id, driver.code, driver.license, driver.licenseNum,
      ].map(normalizeSearchText).join(" ");
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
      updateDriverMutation.mutate(toDriverUpdatePayload(values, editingRecord));
      return;
    }
    createDriverMutation.mutate(toDriverCreatePayload(values));
  };

  const handleDeleteDriver = (record: DriverResponseDto) => {
    Modal.confirm({
      className: "bm-modal",
      title: "Xóa tài xế",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn xóa tài xế ${record.code ?? record.id}?`,
      okText: "Xóa tài xế",
      cancelText: "Hủy",
      okButtonProps: { danger: true, style: { background: "#ef4444", borderColor: "#ef4444", borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk() {
        deleteDriverMutation.mutate(record.id);
      },
    });
  };

  const columns: ColumnsType<DriverResponseDto> = [
    { title: "Mã tài xế", key: "code", render: (_, record) => (
      <span style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}>{record.code ?? record.id}</span>
    )},
    { title: "Tài xế", key: "name", render: (_, record) => (
      <div className="cust-cell">
        <div className="cust-cell__avatar">{record?.name?.charAt(0)}</div>
        <div>
          <div className="cust-cell__name">{record?.name}</div>
          <div className="cust-cell__phone">{record?.phone}</div>
        </div>
      </div>
    )},
    { title: "Bằng lái", dataIndex: "license", key: "license" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số chuyến", dataIndex: "totalTurn", key: "totalTurn", render: (value: number) => value ?? 0 },
    { title: "Đánh giá", dataIndex: "rate", key: "rate", render: (value: number) => (
      <span className="amount-cell">{(value ?? 0).toFixed(1)}*</span>
    )},
    { title: "Trạng thái", dataIndex: "status", key: "status", render: renderDriverStatus },
    { title: "", key: "actions", render: (_, record) => (
      <div className="row-actions">
        <Button type="primary" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); setSelected(record); }} />
        <Button type="primary" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); openEditModal(record); }} />
        <Button type="primary" danger icon={<DeleteOutlined />} className="danger" onClick={(e) => { e.stopPropagation(); handleDeleteDriver(record); }} />
      </div>
    )},
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Quản lý tài xế</div>
        <div className="mgmt-hero__title">Theo dõi hồ sơ và trạng thái tài xế</div>
        <div className="mgmt-hero__subtitle">Giám sát thông tin liên hệ, bằng lái, đánh giá và trạng thái vận hành của đội ngũ tài xế.</div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách tài xế</span>
          <span className="bm-toolbar__count">{filtered.length} hồ sơ</span>
        </div>
        <div className="bm-toolbar__right">
          <Input className="bm-search" placeholder="Tìm tên, SĐT, email, mã tài xế..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select className="bm-select" value={license} onChange={setLicense} options={driverLicenseOptions} />
          <Select className="bm-select" value={status} onChange={setStatus} options={driverStatusOptions} />
          <Button className="btn-ghost" icon={<ReloadOutlined />} onClick={() => { setSearch(""); setLicense("all"); setStatus("all"); }} />
          <Button className="btn-primary" icon={<PlusOutlined />} onClick={openCreateModal}>Thêm tài xế</Button>
        </div>
      </div>

      <SummaryStrip items={getDriverSummary(filtered)} />

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table rowKey={(record) => record.id} columns={columns} dataSource={filtered} pagination={{ pageSize: 6, showSizeChanger: false }} onRow={(record) => ({ onClick: () => setSelected(record) })} />
        </div>
      </div>

      <Drawer className="booking-drawer" open={Boolean(selected)} onClose={() => setSelected(null)} width={420} title={selected ? `${selected.name} · ${selected.code ?? selected.id}` : ""}>
        {selected && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin hồ sơ</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Điện thoại</span><span className="mgmt-detail-list__value">{selected.phone}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Email</span><span className="mgmt-detail-list__value">{selected.email}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Bằng lái</span><span className="mgmt-detail-list__value">{selected.license}</span></div>
                <div className="mgmt-detail-list__item"><span className="mgmt-detail-list__label">Trạng thái</span><span className="mgmt-detail-list__value">{DRIVER_STATUS_META_API[selected.status]?.label ?? selected.status}</span></div>
              </div>
              <div className="mgmt-note">{selected.description || "Chưa có mô tả"}</div>
            </div>
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Hiệu suất</div>
              <div className="mgmt-grid">
                <div className="mgmt-card"><div className="mgmt-card__body"><div className="mgmt-card__subtitle">Tổng chuyến</div><div className="revenue-metric-card__value">{selected.totalTurn ?? 0}</div></div></div>
                <div className="mgmt-card"><div className="mgmt-card__body"><div className="mgmt-card__subtitle">Đánh giá</div><div className="revenue-metric-card__value">{(selected.rate ?? 0).toFixed(1)}*</div></div></div>
              </div>
            </div>
            <div style={{ justifySelf: "center", marginTop: 24 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <Button className="btn-primary" icon={<EditOutlined />} onClick={() => openEditModal(selected)}>Sửa</Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteDriver(selected)}>Xóa</Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <AddDriverModal open={driverModalOpen} initialRecord={editingRecord} onClose={closeDriverModal} onSubmit={handleSubmitDriver} />
    </div>
  );
};

export default DriversPage;
