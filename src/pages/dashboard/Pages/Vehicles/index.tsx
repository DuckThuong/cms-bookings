import { createVehical, deleteVehical, getVehicals, updateVehical } from "@/api/configs/vehical.config";

import type {

  CreateVehicalPayloadDto,

  IVerhicalItem,

  UpdateVehicalPayloadDto,

} from "@/api/dtos/vehical.dto";

import { VehicalEndPoints } from "@/api/endpoints/vehical.endpoint";

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

import {

  VEHICLE_STATUS_META,

  fleetStatusOptions,

  fleetTypeOptions,

  getVerhicalFleetSummary,

  routeOptions,

  type VehicleStatusKey,

} from "../../share";

import "../Page2/style.scss";

import "../management.scss";



const API_VEHICLE_STATUS_LABEL: Record<

  string,

  { label: string; color: string; bg: string }

> = {

  ACTIVE: {

    label: "Đang hoạt động",

    color: "#22c55e",

    bg: "rgba(34,197,94,0.12)",

  },

  INACTIVE: {

    label: "Ngừng hoạt động",

    color: "#64748b",

    bg: "rgba(100,116,139,0.12)",

  },

  MAINTENANCE: {

    label: "Bảo dưỡng",

    color: "#ef4444",

    bg: "rgba(239,68,68,0.12)",

  },

};



const API_VEHICLE_TYPE_LABEL: Record<string, string> = {

  SLEEPER: "Xe giường nằm",

  LIMOUSINE: "Xe limousine",

  COACH: "Xe khách",

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



const toCreatePayload = (values: VehicleFormValues): CreateVehicalPayloadDto => ({

  vehicalName: values.vehicalName,

  vehicalCode: values.vehicalCode,

  seatType: values.seatType,

  seatCount: values.seatCount,

  vehicalType: values.vehicalType,

  vehicalStatus: values.vehicalStatus,

  schedule: values.schedule,

  description: values.description,

  timeStart: values.timeStart,

  timeEnd: values.timeEnd,

  pricePerSeat: values.pricePerSeat,

});



const toUpdatePayload = (

  values: VehicleFormValues,

  record: IVerhicalItem,

): UpdateVehicalPayloadDto => ({

  id: record.verhical.id,

  vehicalName: values.vehicalName,

  vehicalCode: values.vehicalCode,

  seatType: values.seatType,

  seatCount: values.seatCount,

  vehicalType: values.vehicalType,

  vehicalStatus: values.vehicalStatus,

  tripId: record.tripId ?? "",

  driverId: record.driverId ?? "",

  schedule: values.schedule,

  description: values.description,

  timeStart: values.timeStart,

  timeEnd: values.timeEnd,

  pricePerSeat: values.pricePerSeat,

  companyTripId: record.companyTrip?.id ?? 0,

});



const FleetVehiclesPage = () => {

  const { showNotification } = useNotification();

  const { setLoading } = useLoading();

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [type, setType] = useState("all");

  const [route, setRoute] = useState("all");

  const [selected, setSelected] = useState<IVerhicalItem | null>(null);

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);

  const [editingRecord, setEditingRecord] = useState<IVerhicalItem | null>(null);



  const invalidateVehicles = () => {

    queryClient.invalidateQueries({ queryKey: [VehicalEndPoints.GET_VEHICALS] });

  };



  const closeVehicleModal = () => {

    setVehicleModalOpen(false);

    setEditingRecord(null);

  };



  const createVehicalMutation = useMutation({

    mutationFn: (payload: CreateVehicalPayloadDto) => createVehical(payload),

    onSuccess: () => {

      showNotification("Thêm phương tiện thành công", NOTI_SUCCESS);

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

    mutationFn: (payload: UpdateVehicalPayloadDto) => updateVehical(payload),

    onSuccess: () => {

      showNotification("Cập nhật phương tiện thành công", NOTI_SUCCESS);

      invalidateVehicles();

      closeVehicleModal();

    },

    onError: (error) => {

      showNotification(getApiErrorMessage(error), NOTI_ERROR);

    },

    onSettled: () => setLoading(false),

    onMutate: () => setLoading(true),

  });



  const deleteMutation = useMutation({

    mutationFn: (id: string) => deleteVehical(id),

    onSuccess: (_data, id) => {

      showNotification("Xóa phương tiện thành công", NOTI_SUCCESS);

      invalidateVehicles();

      setSelected((prev) =>

        prev && String(prev.verhical.id) === id ? null : prev,

      );

    },

    onError: (error) => {

      showNotification(getApiErrorMessage(error), NOTI_ERROR);

    },

    onSettled: () => setLoading(false),

    onMutate: () => setLoading(true),

  });



  const { data: vehicleData } = useQuery({

    queryKey: [VehicalEndPoints.GET_VEHICALS],

    queryFn: () => getVehicals(),

  });



  const filtered = useMemo(() => {

    const keyword = search.trim().toLowerCase();

    return vehicleData?.items.filter((vehicle) => {

      const matchKeyword =

        !keyword ||

        vehicle.verhical.name.toLowerCase().includes(keyword) ||

        vehicle.verhical.code.toLowerCase().includes(keyword) ||

        vehicle.seatType.toLowerCase().includes(keyword) ||

        vehicle.verhical.type.toLowerCase().includes(keyword) ||

        vehicle.verhical.status.toLowerCase().includes(keyword);

      const matchStatus =

        status === "all" || vehicle.verhical.status === status;

      const matchType = type === "all" || vehicle.verhical.type === type;

      const matchRoute =

        route === "all" ||

        vehicle.verhical.schedule.toLowerCase().includes(route.toLowerCase());

      return matchKeyword && matchStatus && matchType && matchRoute;

    });

  }, [search, status, type, route, vehicleData]);



  const openCreateModal = () => {

    setEditingRecord(null);

    setVehicleModalOpen(true);

  };



  const openEditModal = (record: IVerhicalItem) => {

    setEditingRecord(record);

    setVehicleModalOpen(true);

  };



  const handleSubmitVehicle = (values: VehicleFormValues) => {

    if (editingRecord) {

      updateMutation.mutate(toUpdatePayload(values, editingRecord));

      return;

    }

    createVehicalMutation.mutate(toCreatePayload(values));

  };



  const handleDeleteVehicle = (record: IVerhicalItem) => {

    Modal.confirm({

      className: "bm-modal",

      title: "Xóa phương tiện",

      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,

      content: `Bạn chắc chắn muốn xóa xe ${record.verhical.code}?`,

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

        deleteMutation.mutate(String(record.verhical.id));

      },

    });

  };



  const columns: ColumnsType<IVerhicalItem> = [

    {

      title: "Biển số",

      key: "code",

      render: (_, record) => (

        <span

          style={{ color: "#f97316", fontFamily: "monospace", fontWeight: 700 }}

        >

          {record.verhical.code}

        </span>

      ),

    },

    {

      title: "Loại xe",

      key: "type",

      render: (_, record) =>

        record.verhical.name ||

        API_VEHICLE_TYPE_LABEL[record.verhical.type] ||

        record.verhical.type,

    },

    {

      title: "Sức chứa",

      key: "seatCount",

      render: (_, record) => `${record.seatCount} chỗ`,

    },

    {

      title: "Tuyến phụ trách",

      key: "route",

      render: (_, record) =>

        record.companyTrip?.name ?? record.verhical.schedule ?? "—",

    },

    {

      title: "Tài xế chính",

      key: "driver",

      render: (_, record) => record.driver?.name ?? "—",

    },

    {

      title: "Khung giờ",

      key: "schedule",

      render: (_, record) =>

        record.timeStart && record.timeEnd

          ? `${record.timeStart} – ${record.timeEnd}`

          : "—",

    },

    {

      title: "Trạng thái",

      key: "status",

      render: (_, record) => {

        const vehicleStatus = record.verhical.status;

        const meta =

          API_VEHICLE_STATUS_LABEL[vehicleStatus] ??

          VEHICLE_STATUS_META[vehicleStatus as VehicleStatusKey];

        if (!meta) {

          return vehicleStatus;

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

          <span className="bm-toolbar__count">{filtered?.length ?? 0} xe</span>

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

            options={[

              { value: "all", label: "Tất cả trạng thái" },

              { value: "ACTIVE", label: "Đang hoạt động" },

              { value: "INACTIVE", label: "Ngừng hoạt động" },

              { value: "MAINTENANCE", label: "Bảo dưỡng" },

            ]}

          />

          <Select

            className="bm-select"

            value={type}

            onChange={setType}

            options={[

              { value: "all", label: "Tất cả loại xe" },

              { value: "SLEEPER", label: "Xe giường nằm" },

              { value: "LIMOUSINE", label: "Xe limousine" },

              { value: "COACH", label: "Xe khách" },

            ]}

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

            onClick={openCreateModal}

          >

            Thêm phương tiện

          </Button>

        </div>

      </div>



      <SummaryStrip items={getVerhicalFleetSummary(filtered ?? [])} />



      <div className="bm-content">

        <div className="bm-table-wrap bm-table">

          <Table

            rowKey={(record) => String(record.verhical.id)}

            columns={columns}

            dataSource={filtered ?? []}

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

        title={

          selected

            ? `${selected.verhical.code} · ${selected.verhical.name}`

            : ""

        }

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

                    {selected.companyTrip?.name ??

                      selected.verhical.schedule ??

                      "—"}

                  </span>

                </div>

                <div className="mgmt-detail-list__item">

                  <span className="mgmt-detail-list__label">Tài xế chính</span>

                  <span className="mgmt-detail-list__value">

                    {selected.driver?.name ?? "—"}

                  </span>

                </div>

                <div className="mgmt-detail-list__item">

                  <span className="mgmt-detail-list__label">Sức chứa</span>

                  <span className="mgmt-detail-list__value">

                    {selected.seatCount} chỗ ({selected.seatType})

                  </span>

                </div>

                <div className="mgmt-detail-list__item">

                  <span className="mgmt-detail-list__label">Khung giờ</span>

                  <span className="mgmt-detail-list__value">

                    {selected.timeStart} – {selected.timeEnd}

                  </span>

                </div>

              </div>

            </div>



            <div className="drawer-body__section">

              <div className="drawer-body__section-title">Mô tả</div>

              <div className="mgmt-note">

                {selected.verhical.description || "—"}

              </div>

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

        open={vehicleModalOpen}

        initialRecord={editingRecord}

        onClose={closeVehicleModal}

        onSubmit={handleSubmitVehicle}

      />

    </div>

  );

};



export default FleetVehiclesPage;

