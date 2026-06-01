import { createTrip, getTripById, updateTrip } from "@/api/configs/trip.config";
import { getDrivers } from "@/api/configs/driver.config";
import { getRoads } from "@/api/configs/route.config";
import { getVehicles } from "@/api/configs/vehicle.config";
import type { CmsTripItem } from "@/api/dtos/trip.dto";
import { TripEndpoint } from "@/api/endpoints/trip.endpoint";
import { NOTI_ERROR, NOTI_SUCCESS } from "@/common/constants/constants";
import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import { numberFieldProps } from "@/common/contexts/format";
import { useNotification } from "@/providers/notificationProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import EllipsisSelect from "./EllipsisSelect";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useMemo } from "react";
import type { ManagementModalMode } from "../../share";

dayjs.extend(customParseFormat);

export type TripFormValues = {
  code?: string;
  name: string;
  roadId: number;
  vehicleId: number;
  driverId: number;
  status: string;
  departure?: Dayjs | null;
  arrival?: Dayjs | null;
  seatPrice: string;
  bookedSeats: number;
  description?: string;
};

type AddTripModalProps = {
  mode?: ManagementModalMode;
  open: boolean;
  tripId?: number | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const TRIP_ENTITY_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang khai thác" },
  { value: "INACTIVE", label: "Tạm dừng" },
];

const DATE_FORMATS = [
  "DD/MM/YYYY HH:mm",
  "YYYY-MM-DD HH:mm",
  "HH:mm",
  "YYYY-MM-DD",
];

const parseDateValue = (value?: string | null) => {
  if (!value?.trim()) return null;
  const parsed = dayjs(value, DATE_FORMATS, true);
  return parsed.isValid() ? parsed : null;
};

const formatDateValue = (value?: Dayjs | null) => {
  if (!value) return "";
  return value.format("DD/MM/YYYY HH:mm");
};

const parseDurationToMinutes = (value?: string | null) => {
  const rawValue = value?.trim().toLowerCase();
  if (!rawValue) return null;

  const normalized = rawValue
    .replace(/giờ|gio/g, "h")
    .replace(/phút|phut/g, "m")
    .replace(/\s+/g, "");

  const minuteOnlyMatch = normalized.match(/^(\d+)m$/);
  if (minuteOnlyMatch) {
    return Number(minuteOnlyMatch[1]);
  }

  const hourMinuteMatch = normalized.match(/^(\d+)(?:h|:)(?:(\d{1,2})m?)?$/);
  if (hourMinuteMatch) {
    const hours = Number(hourMinuteMatch[1]);
    const minutes = Number(hourMinuteMatch[2] ?? 0);
    if (minutes >= 60) return null;
    return hours * 60 + minutes;
  }

  return null;
};

const toFormValues = (trip: CmsTripItem): Partial<TripFormValues> => ({
  code: trip.code,
  name: trip.name,
  roadId: trip.roadId,
  vehicleId: trip.vehicleId > 0 ? trip.vehicleId : undefined,
  driverId: trip.driverId > 0 ? trip.driverId : undefined,
  status: trip.status || "ACTIVE",
  departure: parseDateValue(trip.departure),
  arrival: parseDateValue(trip.arrival),
  seatPrice: trip.seatPrice || "",
  bookedSeats: trip.bookedSeats ?? 0,
  description: trip.description ?? "",
});

const toPayload = (values: TripFormValues, tripId?: number) => {
  const base = {
    code: values.code?.trim() || "",
    name: values.name.trim(),
    roadId: values.roadId,
    vehicleId: values.vehicleId,
    driverId: values.driverId,
    status: values.status,
    description: values.description?.trim() || "",
    departure: formatDateValue(values.departure),
    arrival: formatDateValue(values.arrival),
    seatPrice: String(values.seatPrice).trim(),
    bookedSeats: values.bookedSeats ?? 0,
  };

  if (tripId) {
    return { id: tripId, ...base };
  }

  return base;
};

const AddTripModal = ({
  mode = "create",
  open,
  tripId,
  onClose,
  onSuccess,
}: AddTripModalProps) => {
  const [form] = Form.useForm<TripFormValues>();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const roadsQuery = useQuery({
    queryKey: ["cmsRoads", "trip-modal"],
    queryFn: () => getRoads(),
    enabled: open,
  });

  const vehiclesQuery = useQuery({
    queryKey: ["cmsVehicles", "trip-modal"],
    queryFn: async () => {
      const response = await getVehicles();
      return response.items ?? [];
    },
    enabled: open,
  });

  const driversQuery = useQuery({
    queryKey: ["cmsDrivers", "trip-modal"],
    queryFn: () => getDrivers(),
    enabled: open,
  });

  const tripDetailQuery = useQuery({
    queryKey: ["cmsTripDetail", tripId],
    queryFn: () => getTripById(tripId!),
    enabled: open && isEdit && Boolean(tripId),
  });

  const roadOptions = useMemo(
    () =>
      (roadsQuery.data ?? []).map((road) => ({
        value: road.id,
        label: road.name || `${road.startPoint} — ${road.endPoint}`,
      })),
    [roadsQuery.data],
  );

  const vehicleOptions = useMemo(
    () =>
      (vehiclesQuery.data ?? []).map((vehicle) => ({
        value: vehicle.id,
        label: `${vehicle.code} · ${vehicle.name} (${vehicle.seatCount} chỗ)`,
      })),
    [vehiclesQuery.data],
  );

  const driverOptions = useMemo(
    () =>
      (driversQuery.data ?? []).map((driver) => ({
        value: Number(driver.id),
        label: `${driver.name} · ${driver.license}`,
      })),
    [driversQuery.data],
  );

  const selectedVehicleId = Form.useWatch("vehicleId", form);
  const selectedRoadId = Form.useWatch("roadId", form);
  const departureValue = Form.useWatch("departure", form);
  const selectedRoad = useMemo(
    () => (roadsQuery.data ?? []).find((road) => road.id === selectedRoadId),
    [roadsQuery.data, selectedRoadId],
  );
  const selectedRoadDurationMinutes = useMemo(
    () => parseDurationToMinutes(selectedRoad?.standardDuration),
    [selectedRoad?.standardDuration],
  );
  const selectedVehicle = useMemo(
    () =>
      (vehiclesQuery.data ?? []).find(
        (vehicle) => vehicle.id === selectedVehicleId,
      ),
    [selectedVehicleId, vehiclesQuery.data],
  );
  const selectedRoadDurationLabel =
    selectedRoad?.standardDuration?.trim() || "Vui lòng chọn tuyến";

  const saveMutation = useMutation({
    mutationFn: async (values: TripFormValues) => {
      const payload = toPayload(
        values,
        isEdit ? (tripId ?? undefined) : undefined,
      );
      if (isEdit && tripId) {
        return updateTrip(payload as Parameters<typeof updateTrip>[0]);
      }
      return createTrip(payload as Parameters<typeof createTrip>[0]);
    },
    onSuccess: () => {
      showNotification(
        isEdit ? "Cập nhật chuyến xe thành công" : "Thêm chuyến xe thành công",
        NOTI_SUCCESS,
      );
      void queryClient.invalidateQueries({
        queryKey: [TripEndpoint.GET_ALL_TRIPS],
      });
      form.resetFields();
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      const serverMessage =
        error.response?.data?.message ||
        (isEdit ? "Cập nhật chuyến xe thất bại" : "Thêm chuyến xe thất bại");
      showNotification(
        serverMessage,
        NOTI_ERROR,
      );
    },
  });

  const optionsLoading =
    roadsQuery.isLoading ||
    vehiclesQuery.isLoading ||
    driversQuery.isLoading ||
    (isEdit && tripDetailQuery.isLoading);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEdit && tripDetailQuery.data) {
      form.setFieldsValue(toFormValues(tripDetailQuery.data));
      return;
    }

    if (!isEdit) {
      form.setFieldsValue({
        code: "",
        name: "",
        roadId: undefined,
        vehicleId: undefined,
        driverId: undefined,
        status: "ACTIVE",
        departure: null,
        arrival: null,
        seatPrice: "",
        bookedSeats: 0,
        description: "",
      });
    }
  }, [form, isEdit, open, tripDetailQuery.data]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!selectedRoadId || !departureValue) {
      form.setFieldsValue({ arrival: null });
      return;
    }

    if (roadsQuery.isLoading) {
      return;
    }

    if (selectedRoadDurationMinutes === null) {
      form.setFieldsValue({ arrival: null });
      return;
    }

    form.setFieldsValue({
      arrival: departureValue.add(selectedRoadDurationMinutes, "minute"),
    });
  }, [
    departureValue,
    form,
    open,
    roadsQuery.isLoading,
    selectedRoadDurationMinutes,
    selectedRoadId,
  ]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await saveMutation.mutateAsync(values);
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? "Cập nhật chuyến xe" : "Thêm chuyến xe mới"}
      open={open}
      onCancel={handleClose}
      width={620}
      destroyOnClose
      footer={renderModalFooter({
        cancelText: "Hủy",
        submitText: isEdit ? "Lưu thay đổi" : "Thêm chuyến xe",
        onCancel: handleClose,
        onSubmit: handleSubmit,
      })}
    >
      <Spin spinning={optionsLoading}>
        <Form form={form} layout="vertical" style={{ padding: "8px 0" }}>
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item name="code" label={formLabel("Mã chuyến")}>
                <Input
                  placeholder="Để trống để tự sinh mã"
                  style={fieldStyle}
                  disabled={isEdit}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label={formLabel("Tên chuyến")}
                rules={[{ required: true, message: "Nhập tên chuyến" }]}
              >
                <Input placeholder="HCM → ĐL Tối" style={fieldStyle} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label={formLabel("Trạng thái")}
                rules={[{ required: true, message: "Chọn trạng thái" }]}
              >
                <Select
                  className="bm-select"
                  options={TRIP_ENTITY_STATUS_OPTIONS}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="seatPrice"
                label={formLabel("Giá vé / ghế (VNĐ)")}
                rules={[{ required: true, message: "Nhập giá vé" }]}
              >
                <Input placeholder="350000" style={fieldStyle} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="roadId"
                label={formLabel("Tuyến")}
                rules={[
                  { required: true, message: "Chọn tuyến" },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }

                      const road = (roadsQuery.data ?? []).find(
                        (item) => item.id === value,
                      );

                      if (!road) {
                        return Promise.reject(
                          new Error("Không tìm thấy tuyến đã chọn"),
                        );
                      }

                      if (parseDurationToMinutes(road.standardDuration) === null) {
                        return Promise.reject(
                          new Error(
                            "Tuyến chưa có thời gian di chuyển hợp lệ",
                          ),
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <EllipsisSelect
                  placeholder="Chọn tuyến đường"
                  options={roadOptions}
                  loading={roadsQuery.isLoading}
                  showSearch
                  optionFilterProp="label"
                  notFoundContent={
                    roadsQuery.isError ? "Không tải được tuyến" : undefined
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="vehicleId"
                label={formLabel("Xe")}
                rules={[{ required: true, message: "Chọn xe" }]}
              >
                <EllipsisSelect
                  placeholder="Chọn phương tiện"
                  options={vehicleOptions}
                  loading={vehiclesQuery.isLoading}
                  showSearch
                  optionFilterProp="label"
                  notFoundContent={
                    vehiclesQuery.isError ? "Không tải được xe" : undefined
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="driverId"
            label={formLabel("Tài xế")}
            rules={[{ required: true, message: "Chọn tài xế" }]}
          >
            <EllipsisSelect
              placeholder="Chọn tài xế"
              options={driverOptions}
              loading={driversQuery.isLoading}
              showSearch
              optionFilterProp="label"
              notFoundContent={
                driversQuery.isError ? "Không tải được tài xế" : undefined
              }
            />
          </Form.Item>

          <Form.Item label={formLabel("Thời gian di chuyển")}>
            <Input
              value={selectedRoadDurationLabel}
              disabled
              status={
                selectedRoadId && selectedRoadDurationMinutes === null
                  ? "error"
                  : undefined
              }
              style={fieldStyle}
            />
          </Form.Item>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="departure"
                label={formLabel("Giờ khởi hành")}
                rules={[{ required: true, message: "Chọn giờ khởi hành" }]}
              >
                <DatePicker
                  className="bm-date-picker"
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="arrival"
                label={formLabel("Giờ đến( dự kiến )")}
                getValueProps={(value?: Dayjs | null) => ({
                  value: value
                    ? ` ${formatDateValue(value)}`
                    : "Vui lòng chọn tuyến và giờ khởi hành ",
                })}
                rules={[
                  { required: true, message: "Giờ đến sẽ được tự tính" },
                ]}
              >
                <Input disabled style={fieldStyle} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item label={formLabel("Sức chứa")}>
                <Input
                  value={
                    selectedVehicle
                      ? `${selectedVehicle.seatCount} chỗ`
                      : "Vui lòng chọn xe "
                  }
                  disabled
                  style={fieldStyle}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="bookedSeats"
                label={formLabel("Số ghế đã đặt")}
                dependencies={["vehicleId"]}
                rules={[
                  { required: true, message: "Nhập số ghế đã đặt" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const vehicleId = getFieldValue("vehicleId");
                      const vehicle = (vehiclesQuery.data ?? []).find(
                        (item) => item.id === vehicleId,
                      );
                      const capacity = vehicle?.seatCount ?? 60;
                      if (typeof value !== "number" || value <= capacity) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Số ghế đã đặt không được vượt quá sức chứa"),
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={0}
                  max={selectedVehicle?.seatCount ?? 60}
                  style={{ ...fieldStyle, width: "100%" }}
                  {...numberFieldProps}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label={formLabel("Ghi chú")}>
            <Input.TextArea
              rows={3}
              placeholder="Ghi chú vận hành..."
              style={{ ...fieldStyle, resize: "none" }}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddTripModal;
