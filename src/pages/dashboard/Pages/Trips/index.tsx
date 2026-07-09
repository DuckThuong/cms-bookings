import { deleteTrip, getAllTrips } from "@/api/configs/trip.config";
import { TripEndpoint } from "@/api/endpoints/trip.endpoint";
import { NOTI_ERROR, NOTI_SUCCESS } from "@/common/constants/constants";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Input, Modal, Select, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { AddTripModal } from "../../components/ManagementCreate";
import { TripOperationStatusModal } from "../../components/Page2/TripOperationStatusModal";
import { useRoutes, useVehicles } from "@/common/hooks/useMasterData";
import {
  OPERATION_STATUS_META,
  TRIP_STATUS_META,
  tripStatusOptions,
  type TripRecord,
  type OperationStatusKey,
} from "../../share";
import { mapCmsTripsToRecords } from "./mapTripRecord";
import "../Page2/style.scss";
import "../management.scss";
import type { CmsTripItem } from "@/api/dtos/trip.dto";

const TripsPage = () => {
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [route, setRoute] = useState("all");
  const [vehicle, setVehicle] = useState("all");
  const [selected, setSelected] = useState<TripRecord | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [operationStatusModalOpen, setOperationStatusModalOpen] = useState(false);
  const [operationStatusTrip, setOperationStatusTrip] = useState<CmsTripItem | null>(null);

  const { routeOptions, loading: routesLoading } = useRoutes();
  const { vehicleOptions, loading: vehiclesLoading } = useVehicles();

  // Raw trip data query
  const { data: tripListQuery, isLoading: tripListLoading } = useQuery({
    queryKey: [TripEndpoint.GET_ALL_TRIPS],
    queryFn: () => getAllTrips(),
  });

  // Mapped trip records for table display
  const tripRecords = tripListQuery ? mapCmsTripsToRecords(tripListQuery) : [];

  const deleteTripMutation = useMutation({
    mutationFn: (id: number | string) => deleteTrip(id),
    onSuccess: () => {
      showNotification("Xóa chuyến xe thành công", NOTI_SUCCESS);
      void queryClient.invalidateQueries({
        queryKey: [TripEndpoint.GET_ALL_TRIPS],
      });
      setSelected(null);
    },
    onError: () => {
      showNotification("Xóa chuyến xe thất bại", NOTI_ERROR);
    },
    onSettled: () => {
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return tripRecords.filter((trip) => {
      const matchKeyword =
        !keyword ||
        trip.id.toLowerCase().includes(keyword) ||
        trip.route.toLowerCase().includes(keyword) ||
        trip.driver.toLowerCase().includes(keyword);
      const matchStatus = status === "all" || trip.status === status;
      const matchRoute = route === "all" || trip.route === route;
      const matchVehicle = vehicle === "all" || trip.vehicle === vehicle;
      return matchKeyword && matchStatus && matchRoute && matchVehicle;
    });
  }, [route, search, status, tripRecords, vehicle]);

  useEffect(() => {
    setLoading(tripListLoading);
  }, [setLoading, tripListLoading]);

  const openEditModal = (record: TripRecord) => {
    setEditingTripId(Number(record.key));
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingTripId(null);
  };

  const handleDeleteTrip = (record: TripRecord) => {
    Modal.confirm({
      className: "bm-modal",
      title: "Xóa chuyến xe",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Bạn chắc chắn muốn xóa chuyến ${record.id}?`,
      okText: "Xóa chuyến",
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
        deleteTripMutation.mutate(record.key);
      },
    });
  };

  const columns: ColumnsType<TripRecord> = [
    {
      title: "Mã chuyến",
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
    {
      title: "Tuyến / giờ chạy",
      key: "route",
      render: (_, record) => (
        <div className="route-cell">
          <div className="route-cell__line">{record.route}</div>
          <div className="route-cell__time">
            {record.departure !== "—" || record.arrival !== "—"
              ? `${record.departure} → ${record.arrival}`
              : "Chưa cập nhật giờ chạy"}
          </div>
        </div>
      ),
    },
    { title: "Xe", dataIndex: "vehicle", key: "vehicle" },
    { title: "Tài xế", dataIndex: "driver", key: "driver" },
    {
      title: "Tải ghế",
      key: "load",
      render: (_, record) => (
        <div>
          <div className="amount-cell">
            {record.bookedSeats}/{record.capacity}
          </div>
          <div className="report-subtitle">{record.occupancyRate}% lấp đầy</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: TripRecord["status"]) => {
        const meta = TRIP_STATUS_META[value];
        return (
          <span
            className="booking-status"
            style={{ background: meta?.bg, color: meta?.color }}
          >
            <span
              className="booking-status__dot"
              style={{ background: meta?.color }}
            />
            {meta?.label}
          </span>
        );
      },
    },
    {
      title: "Trạng thái vận hành",
      key: "operationStatus",
      width: 180,
      render: (_, record) => {
        if (!record.operationStatus) {
          return (
            <span style={{ color: "#94a3b8", fontSize: 12 }}>
              Chưa cập nhật
            </span>
          );
        }
        const meta = OPERATION_STATUS_META[record.operationStatus as OperationStatusKey];
        return (
          <span
            className="booking-status"
            style={{ background: meta?.bg, color: meta?.color }}
          >
            <span
              className="booking-status__dot"
              style={{ background: meta?.color }}
            />
            {meta?.label}
          </span>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="row-actions">
          <button
            type="button"
            title="Cập nhật trạng thái vận hành"
            onClick={(event) => {
              event.stopPropagation();
              const tripItem = tripList.find((t) => String(t.id) === record.key);
              if (tripItem) {
                setOperationStatusTrip(tripItem);
                setOperationStatusModalOpen(true);
              }
            }}
          >
            <SyncOutlined />
          </button>
          <button
            type="button"
            title="Xem chi tiết"
            onClick={(event) => {
              event.stopPropagation();
              setSelected(record);
            }}
          >
            <EyeOutlined />
          </button>
          <button
            type="button"
            title="Sửa"
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
            title="Xóa"
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteTrip(record);
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  // Raw trip data for operation status modal
  const tripList = tripListQuery ?? [];

  return (
    <div className="mgmt-page">
      <div className="mgmt-hero">
        <div className="mgmt-hero__eyebrow">Vận hành chuyến xe</div>
        <div className="mgmt-hero__title">
          Theo dõi tải ghế và trạng thái từng chuyến
        </div>
        <div className="mgmt-hero__subtitle">
          Tập trung vào chuyến đang chạy, chuyến sắp đón khách và các điểm nghẽn
          ảnh hưởng đến khả năng khai thác.
        </div>
      </div>

      <div className="bm-toolbar">
        <div className="bm-toolbar__left">
          <span className="bm-toolbar__title">Danh sách chuyến</span>
          <span className="bm-toolbar__count">{filtered?.length} chuyến</span>
        </div>
        <div className="bm-toolbar__right">
          <Input
            className="bm-search"
            placeholder="Tìm mã chuyến, tuyến, tài xế..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            className="bm-select"
            value={status}
            onChange={setStatus}
            options={tripStatusOptions}
          />
          <Select
            className="bm-select"
            value={route}
            onChange={setRoute}
            options={routeOptions}
          />
          <Select
            className="bm-select"
            value={vehicle}
            onChange={setVehicle}
            options={vehicleOptions}
          />
          <Button
            className="btn-primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalOpen(true)}
          >
            Thêm chuyến xe
          </Button>
        </div>
      </div>

      {/* <SummaryStrip items={getTripSummary(filtered as TripRecord[])} /> */}

      <div className="bm-content">
        <div className="bm-table-wrap bm-table">
          <Spin spinning={tripListLoading}>
            <Table
              rowKey="key"
              columns={columns}
              dataSource={filtered}
              pagination={{ pageSize: 6, showSizeChanger: false }}
              onRow={(record) => ({ onClick: () => setSelected(record) })}
            />
          </Spin>
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
              <div className="drawer-body__section-title">
                Thông tin khai thác
              </div>
              <div className="mgmt-detail-list">
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Tài xế</span>
                  <span className="mgmt-detail-list__value">
                    {selected.driver}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Xe</span>
                  <span className="mgmt-detail-list__value">
                    {selected.vehicle}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Khởi hành</span>
                  <span className="mgmt-detail-list__value">
                    {selected.departure}
                  </span>
                </div>
                <div className="mgmt-detail-list__item">
                  <span className="mgmt-detail-list__label">Dự kiến đến</span>
                  <span className="mgmt-detail-list__value">
                    {selected.arrival}
                  </span>
                </div>
              </div>
            </div>

            <div className="drawer-body__section">
              <div className="drawer-body__section-title">Chỉ số vận hành</div>
              <div className="mgmt-grid">
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Tải ghế</div>
                    <div className="revenue-metric-card__value">
                      {selected.bookedSeats}/{selected.capacity}
                    </div>
                  </div>
                </div>
                <div className="mgmt-card">
                  <div className="mgmt-card__body">
                    <div className="mgmt-card__subtitle">Lấp đầy</div>
                    <div className="revenue-metric-card__value">
                      {selected.occupancyRate}%
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
                  onClick={() => handleDeleteTrip(selected)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <AddTripModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <AddTripModal
        mode="edit"
        open={editModalOpen}
        tripId={editingTripId}
        onClose={closeEditModal}
      />
      <TripOperationStatusModal
        open={operationStatusModalOpen}
        trip={operationStatusTrip}
        onClose={() => {
          setOperationStatusModalOpen(false);
          setOperationStatusTrip(null);
        }}
      />
    </div>
  );
};

export default TripsPage;
