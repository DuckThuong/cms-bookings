import {
  fetchCompanyRegistrations,
  updateCompanyRegistrationStatus,
} from "@/api/configs/company-registration.config";
import { RegistrationStatus, type CompanyRegistrationResponseDto } from "@/api/dtos/company-registration.dto";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Input, message, Modal, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import "./style.scss";

type CompanyRegistrationRecord = CompanyRegistrationResponseDto & {
  key: string;
};

const STATUS_META: Record<RegistrationStatus, { label: string; color: string; bg: string }> = {
  PENDING: {
    label: "Chờ phê duyệt",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  APPROVED: {
    label: "Đã phê duyệt",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  REJECTED: {
    label: "Đã từ chối",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

const CompanyRegistrationsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RegistrationStatus | "all">("all");
  const [selectedRecord, setSelectedRecord] = useState<CompanyRegistrationRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: registrations = [], isLoading, refetch } = useQuery({
    queryKey: ["company-registrations", status],
    queryFn: () => fetchCompanyRegistrations(status === "all" ? undefined : status),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { status: RegistrationStatus; rejectionReason?: string } }) =>
      updateCompanyRegistrationStatus(id, payload),
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công");
      setRejectModalOpen(false);
      setRejectReason("");
      setDrawerOpen(false);
      queryClient.invalidateQueries({ queryKey: ["company-registrations"] });
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const dataWithKeys = useMemo(
    () =>
      registrations.map((item) => ({
        ...item,
        key: `registration-${item.id}`,
      })),
    [registrations],
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return dataWithKeys.filter((record) => {
      const matchKeyword =
        !keyword ||
        record.companyName.toLowerCase().includes(keyword) ||
        record.userName.toLowerCase().includes(keyword) ||
        record.userPhone.toLowerCase().includes(keyword) ||
        record.userEmail.toLowerCase().includes(keyword);
      const matchStatus = status === "all" || record.status === status;
      return matchKeyword && matchStatus;
    });
  }, [dataWithKeys, search, status]);

  const handleViewDetail = (record: CompanyRegistrationRecord) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleApprove = (record: CompanyRegistrationRecord) => {
    Modal.confirm({
      title: "Phê duyệt đăng ký",
      content: `Bạn có chắc chắn phê duyệt đăng ký của nhà xe "${record.companyName}"?`,
      okText: "Phê duyệt",
      cancelText: "Hủy",
      onOk: () => {
        updateStatusMutation.mutate({
          id: record.id,
          payload: { status: RegistrationStatus.APPROVED },
        });
      },
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }
    if (!selectedRecord) return;
    updateStatusMutation.mutate({
      id: selectedRecord.id,
      payload: { status: RegistrationStatus.REJECTED, rejectionReason: rejectReason },
    });
  };

  const columns: ColumnsType<CompanyRegistrationRecord> = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (value: number) => (
        <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{value}</span>
      ),
    },
    {
      title: "Tên nhà xe",
      dataIndex: "companyName",
      key: "companyName",
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: "Người đăng ký",
      key: "user",
      render: (_, record) => (
        <div>
          <div>{record.userName}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{record.userPhone}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: RegistrationStatus) => {
        const meta = STATUS_META[value];
        return (
          <Tag style={{ background: meta.bg, color: meta.color, border: "none" }}>
            {meta.label}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (value: string) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div className="row-actions">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              handleViewDetail(record);
            }}
          />
          {record.status === RegistrationStatus.PENDING && (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{ background: "#22c55e", borderColor: "#22c55e" }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleApprove(record);
                }}
              />
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedRecord(record);
                  setRejectReason("");
                  setRejectModalOpen(true);
                }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Quản lý</div>
        <div className="mgmt-hero__title">Đăng ký nhà xe</div>
        <div className="mgmt-hero__subtitle">
          Xem xét và phê duyệt yêu cầu đăng ký trở thành nhà xe của người dùng.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách yêu cầu</span>
          <span className="bm-toolbar__count">{filtered.length} yêu cầu</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm tên nhà xe, người đăng ký..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            className="bm-select"
            value={status}
            onChange={setStatus}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "PENDING", label: "Chờ phê duyệt" },
              { value: "APPROVED", label: "Đã phê duyệt" },
              { value: "REJECTED", label: "Đã từ chối" },
            ]}
          />
          <Button className="btn-ghost" icon={<ReloadOutlined />} onClick={() => refetch()} />
        </div>
      </div>

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Table
            rowKey="key"
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            loading={isLoading}
            onRow={(record) => ({
              onClick: () => handleViewDetail(record),
            })}
          />
        </div>
      </div>

      <Drawer
        className="booking-drawer"
        open={Boolean(selectedRecord && drawerOpen)}
        onClose={() => setDrawerOpen(false)}
        width={520}
        title={selectedRecord ? `Yêu cầu #${selectedRecord.id}` : ""}
      >
        {selectedRecord && (
          <div className="drawer-body">
            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Thông tin đăng ký</div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Tên nhà xe</span>
                  <span className="mgmt-detail-list__value">{selectedRecord.companyName}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Người đăng ký</span>
                  <span className="mgmt-detail-list__value">{selectedRecord.userName}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Số điện thoại</span>
                  <span className="mgmt-detail-list__value">{selectedRecord.userPhone}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Email</span>
                  <span className="mgmt-detail-list__value">{selectedRecord.userEmail}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Địa chỉ</span>
                  <span className="mgmt-detail-list__value">{selectedRecord.address || "Chưa cập nhật"}</span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Người đại diện</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.representativeName || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Chức vụ</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.representativePosition || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Số điện thoại ĐD</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.representativePhone || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Mã số thuế</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.taxCode || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Địa chỉ GPKD</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.businessAddress || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Ngày cấp GPKD</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.businessLicenseDate
                      ? new Date(selectedRecord.businessLicenseDate).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Giấy phép KD</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.businessLicenseUrl ? (
                      <a href={selectedRecord.businessLicenseUrl} target="_blank" rel="noreferrer">
                        Xem file
                      </a>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">CMND/CCCD</span>
                  <span className="mgmt-detail-list__value">
                    {selectedRecord.idCardUrl ? (
                      <a href={selectedRecord.idCardUrl} target="_blank" rel="noreferrer">
                        Xem file
                      </a>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Trạng thái</span>
                  <span className="mgmt-detail-list__value">
                    <Tag style={{ background: STATUS_META[selectedRecord.status].bg, color: STATUS_META[selectedRecord.status].color, border: "none" }}>
                      {STATUS_META[selectedRecord.status].label}
                    </Tag>
                  </span>
                </div>
                {selectedRecord.rejectionReason && (
                  <div className="mgmt-detail-list__item">
                    <span className="mgmt-detail-list__label">Lý do từ chối</span>
                    <span className="mgmt-detail-list__value" style={{ color: "#ef4444" }}>
                      {selectedRecord.rejectionReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {selectedRecord.description && (
              <div className="drawer-body__section">
                <div className="drawer-body__section-title">Mô tả</div>
                <p style={{ color: "#cbd5e1" }}>{selectedRecord.description}</p>
              </div>
            )}

            {selectedRecord.status === RegistrationStatus.PENDING && (
              <div style={{ justifySelf: "center", marginTop: 24 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    className="btn-primary"
                    icon={<EditOutlined />}
                    style={{ background: "#22c55e", borderColor: "#22c55e" }}
                    onClick={() => handleApprove(selectedRecord)}
                  >
                    Phê duyệt
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setRejectReason("");
                      setRejectModalOpen(true);
                    }}
                  >
                    Từ chối
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        title="Từ chối đăng ký"
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleReject}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginTop: 16 }}>
          <p>Vui lòng nhập lý do từ chối để thông báo cho người dùng:</p>
          <Input.TextArea
            rows={4}
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="Nhập lý do từ chối..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default CompanyRegistrationsPage;
