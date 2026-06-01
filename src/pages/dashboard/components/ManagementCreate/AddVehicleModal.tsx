import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import { numberFieldProps } from "@/common/contexts/format";
import type {
  IVehicle,
  VehicleLayoutConfig,
  VehicleLayoutPreset,
} from "@/api/dtos/vehicle.dto";
import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect } from "react";

export type VehicleFormValues = {
  vehicleName: string;
  vehicleCode: string;
  seatType: string;
  seatCount?: number;
  layoutPreset: VehicleLayoutPreset;
  layoutConfig: VehicleLayoutConfig;
  vehicleType: string;
  vehicleStatus: string;
  schedule?: string;
  description?: string;
};

type AddVehicleModalProps = {
  open: boolean;
  initialRecord?: IVehicle | null;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void;
};

const VEHICLE_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Dang hoat dong" },
  { value: "INACTIVE", label: "Ngung hoat dong" },
  { value: "MAINTENANCE", label: "Bao duong" },
];

const VEHICLE_TYPE_OPTIONS = [
  { value: "SLEEPER", label: "Xe giuong nam" },
  { value: "LIMOUSINE", label: "Xe Limousine" },
  { value: "COACH", label: "Xe Khach" },
];

const LAYOUT_PRESET_OPTIONS = [
  { value: "SLEEPER_38", label: "Giuong nam 38 cho" },
  { value: "LIMOUSINE", label: "Limousine" },
  { value: "COACH", label: "Xe khach" },
  { value: "CUSTOM_SIMPLE", label: "Tuy chinh don gian" },
] as const;

const SEAT_TYPE_OPTIONS = [
  { value: "BED", label: "Giuong nam" },
  { value: "SEAT", label: "Ghe ngoi" },
];

const DEFAULT_LAYOUTS: Record<VehicleLayoutPreset, VehicleLayoutConfig> = {
  SLEEPER_38: {
    preset: "SLEEPER_38",
    floorCount: 2,
    rowsPerFloor: 9,
    columns: 3,
    aisleColumns: [1],
    lastRowSeatCount: 3,
    seatType: "BED",
  },
  LIMOUSINE: {
    preset: "LIMOUSINE",
    floorCount: 1,
    rowsPerFloor: 5,
    columns: 3,
    aisleColumns: [1],
    lastRowSeatCount: 3,
    seatType: "SEAT",
  },
  COACH: {
    preset: "COACH",
    floorCount: 1,
    rowsPerFloor: 11,
    columns: 5,
    aisleColumns: [2],
    lastRowSeatCount: 5,
    seatType: "SEAT",
  },
  CUSTOM_SIMPLE: {
    preset: "CUSTOM_SIMPLE",
    floorCount: 1,
    rowsPerFloor: 5,
    columns: 3,
    aisleColumns: [1],
    lastRowSeatCount: 3,
    seatType: "SEAT",
  },
};

const cloneLayout = (preset: VehicleLayoutPreset): VehicleLayoutConfig => ({
  ...DEFAULT_LAYOUTS[preset],
  aisleColumns: [...DEFAULT_LAYOUTS[preset].aisleColumns],
});

const normalizeLayout = (
  layout: VehicleLayoutConfig | null | undefined,
  preset: VehicleLayoutPreset,
): VehicleLayoutConfig => ({
  ...cloneLayout(preset),
  ...(layout ?? {}),
  preset,
  aisleColumns: layout?.aisleColumns?.length
    ? [...layout.aisleColumns]
    : [...cloneLayout(preset).aisleColumns],
});

const presetToVehicleType = (preset: VehicleLayoutPreset) => {
  if (preset === "SLEEPER_38") return "SLEEPER";
  if (preset === "LIMOUSINE") return "LIMOUSINE";
  return "COACH";
};

const calcSeatCount = (config?: VehicleLayoutConfig) => {
  if (!config) return 0;
  const normalSeats = Math.max(0, config.columns - config.aisleColumns.length);
  return (
    config.floorCount *
    ((config.rowsPerFloor - 1) * normalSeats + config.lastRowSeatCount)
  );
};

const toFormRecord = (record: IVehicle): VehicleFormValues => {
  const preset = record.layoutPreset ?? record.layoutConfig?.preset ?? "SLEEPER_38";
  const layout = normalizeLayout(record.layoutConfig, preset);

  return {
    vehicleName: record.name,
    vehicleCode: record.code,
    seatType: layout.seatType || record.seatType || "BED",
    seatCount: record.seatCount > 0 ? record.seatCount : calcSeatCount(layout),
    layoutPreset: preset,
    layoutConfig: layout,
    vehicleType: record.type,
    vehicleStatus: record.status,
    schedule: record.schedule ?? "",
    description: record.description ?? "",
  };
};

const AddVehicleModal = ({
  open,
  initialRecord,
  onClose,
  onSubmit,
}: AddVehicleModalProps) => {
  const [form] = Form.useForm<VehicleFormValues>();
  const isEdit = Boolean(initialRecord);
  const layoutPreset = Form.useWatch("layoutPreset", form) ?? "SLEEPER_38";
  const layoutConfig = Form.useWatch("layoutConfig", form);
  const isCustom = layoutPreset === "CUSTOM_SIMPLE";
  const computedSeatCount = calcSeatCount(layoutConfig);

  useEffect(() => {
    if (!open) return;

    if (initialRecord) {
      form.setFieldsValue(toFormRecord(initialRecord));
      return;
    }

    const layout = cloneLayout("SLEEPER_38");
    form.setFieldsValue({
      vehicleName: "",
      vehicleCode: "",
      seatType: layout.seatType,
      seatCount: calcSeatCount(layout),
      layoutPreset: layout.preset,
      layoutConfig: layout,
      vehicleType: "SLEEPER",
      vehicleStatus: "ACTIVE",
      schedule: "",
      description: "",
    });
  }, [form, initialRecord, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const layout = normalizeLayout(values.layoutConfig, values.layoutPreset);
    const seatCount = calcSeatCount(layout);

    onSubmit({
      ...values,
      seatType: layout.seatType,
      seatCount,
      layoutConfig: layout,
      schedule: values.schedule?.trim() || undefined,
      description: values.description?.trim() || undefined,
    });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const renderPreview = () => {
    const config = layoutConfig;
    if (!config) return null;
    const previewRows = Math.min(config.rowsPerFloor, 6);

    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
          Preview ({computedSeatCount} cho)
        </div>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 10,
            background: "#f9fafb",
            display: "inline-block",
          }}
        >
          {Array.from({ length: previewRows }, (_, rowIndex) => {
            const lastRow = rowIndex + 1 === config.rowsPerFloor;
            const seatSlots = lastRow
              ? new Set(
                  Array.from(
                    { length: Math.min(config.lastRowSeatCount, config.columns) },
                    (_, index) => index,
                  ),
                )
              : new Set(
                  Array.from({ length: config.columns }, (_, index) => index).filter(
                    (index) => !config.aisleColumns.includes(index),
                  ),
                );

            return (
              <div
                key={rowIndex}
                style={{ display: "flex", gap: 6, marginBottom: 6 }}
              >
                {Array.from({ length: config.columns }, (_, column) => {
                  const isSeat = seatSlots.has(column);
                  const isAisle = config.aisleColumns.includes(column);
                  return (
                    <span
                      key={column}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        border: "1px solid #d1d5db",
                        background: isSeat
                          ? "#dcfce7"
                          : isAisle
                            ? "#fef3c7"
                            : "#f3f4f6",
                        display: "inline-block",
                      }}
                      title={isSeat ? "Ghe" : isAisle ? "Loi di" : "Trong"}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? "Cap nhat phuong tien" : "Them phuong tien moi"}
      open={open}
      onCancel={handleClose}
      width={720}
      footer={renderModalFooter({
        cancelText: "Huy",
        submitText: isEdit ? "Luu thay doi" : "Them phuong tien",
        onCancel: handleClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<VehicleFormValues>
        form={form}
        layout="vertical"
        style={{ padding: "8px 0" }}
        onValuesChange={(changed) => {
          if (changed.layoutPreset) {
            const preset = changed.layoutPreset as VehicleLayoutPreset;
            const nextLayout = cloneLayout(preset);
            form.setFieldsValue({
              layoutConfig: nextLayout,
              seatType: nextLayout.seatType,
              seatCount: calcSeatCount(nextLayout),
              vehicleType: presetToVehicleType(preset),
            });
          }
        }}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleName"
              label={formLabel("Ten xe")}
              rules={[{ required: true, message: "Nhap ten xe" }]}
            >
              <Input placeholder="Xe giuong nam cao cap" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleCode"
              label={formLabel("Bien so")}
              rules={[{ required: true, message: "Nhap bien so" }]}
            >
              <Input
                placeholder="29B-2325"
                style={fieldStyle}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleType"
              label={formLabel("Loai xe")}
              rules={[{ required: true, message: "Chon loai xe" }]}
            >
              <Select className="bm-select" options={VEHICLE_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleStatus"
              label={formLabel("Trang thai")}
              rules={[{ required: true, message: "Chon trang thai" }]}
            >
              <Select className="bm-select" options={VEHICLE_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="layoutPreset"
              label={formLabel("Mau so do")}
              rules={[{ required: true, message: "Chon mau so do" }]}
            >
              <Select className="bm-select" options={LAYOUT_PRESET_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={formLabel("Tong ghe")}>
              <InputNumber
                value={computedSeatCount}
                readOnly
                controls={false}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="seatType"
              label={formLabel("Loai ghe")}
              rules={[{ required: true, message: "Chon loai ghe" }]}
            >
              <Select
                className="bm-select"
                options={SEAT_TYPE_OPTIONS}
                disabled={!isCustom}
                onChange={(value) =>
                  form.setFieldValue(["layoutConfig", "seatType"], value)
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name={["layoutConfig", "floorCount"]}
              label={formLabel("So tang")}
              rules={[{ required: true, message: "Nhap so tang" }]}
            >
              <InputNumber
                min={1}
                max={2}
                disabled={!isCustom}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={8}>
            <Form.Item
              name={["layoutConfig", "rowsPerFloor"]}
              label={formLabel("Hang/tang")}
              rules={[{ required: true, message: "Nhap so hang" }]}
            >
              <InputNumber
                min={1}
                max={30}
                disabled={!isCustom}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["layoutConfig", "columns"]}
              label={formLabel("So cot")}
              rules={[{ required: true, message: "Nhap so cot" }]}
            >
              <InputNumber
                min={1}
                max={8}
                disabled={!isCustom}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name={["layoutConfig", "lastRowSeatCount"]}
              label={formLabel("Ghe hang cuoi")}
              rules={[{ required: true, message: "Nhap ghe hang cuoi" }]}
            >
              <InputNumber
                min={1}
                max={8}
                disabled={!isCustom}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name={["layoutConfig", "aisleColumns"]}
          label={formLabel("Cot loi di")}
        >
          <Select
            mode="multiple"
            disabled={!isCustom}
            className="bm-select"
            options={Array.from(
              { length: Math.max(0, layoutConfig?.columns ?? 0) },
              (_, index) => ({
                value: index,
                label: `Cot ${index + 1}`,
              }),
            )}
          />
        </Form.Item>

        {renderPreview()}

        <Form.Item name="description" label={formLabel("Mo ta")}>
          <Input.TextArea
            rows={3}
            placeholder="Mo ta xe..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicleModal;
