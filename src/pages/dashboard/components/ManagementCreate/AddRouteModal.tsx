import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import {
  demandLevelOptions,
  routeStatusOptions,
  vehicleOptions,
  type AddRouteFormValues,
  type ManagementModalMode,
  type RouteRecord,
} from "../../share";
import {
  fieldStyle,
  formLabel,
  renderModalFooter,
} from "@/common/contexts/UserContext";
import { numberFieldProps } from "@/common/contexts/format";

type AddRouteModalProps = {
  mode?: ManagementModalMode;
  open: boolean;
  onClose: () => void;
  initialValues?: RouteRecord | null;
  onSubmit: (record: RouteRecord) => void;
};

const defaultValues: AddRouteFormValues = {
  id: "",
  route: "",
  distanceKm: 1,
  standardDuration: "",
  tripsPerDay: 1,
  averageOccupancy: 50,
  estimatedRevenue: 1,
  status: "active",
  leadVehicle: "",
  demandLevel: "",
  note: "",
};

const AddRouteModal = ({
  mode = "create",
  open,
  onClose,
  initialValues,
  onSubmit,
}: AddRouteModalProps) => {
  const [form] = Form.useForm<AddRouteFormValues>();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) {
      if (isEdit && initialValues) {
        form.setFieldsValue({
          id: initialValues.id,
          route: initialValues.route,
          distanceKm: initialValues.distanceKm,
          standardDuration: initialValues.standardDuration,
          tripsPerDay: initialValues.tripsPerDay,
          averageOccupancy: initialValues.averageOccupancy,
          estimatedRevenue: initialValues.estimatedRevenue,
          status: initialValues.status,
          leadVehicle: initialValues.leadVehicle,
          demandLevel: initialValues.demandLevel,
          note: initialValues.note,
        });
        return;
      }

      form.resetFields();
      form.setFieldsValue(defaultValues);
      return;
    }

    form.resetFields();
  }, [form, initialValues, isEdit, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    onSubmit({
      key: initialValues?.key ?? `route-${Date.now()}`,
      id: values.id,
      route: values.route,
      distanceKm: values.distanceKm,
      standardDuration: values.standardDuration,
      tripsPerDay: values.tripsPerDay,
      averageOccupancy: values.averageOccupancy,
      estimatedRevenue: values.estimatedRevenue,
      status: values.status as RouteRecord["status"],
      leadVehicle: values.leadVehicle,
      demandLevel: values.demandLevel,
      note: values.note?.trim() ?? "",
    });

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? "Cập nhật tuyến đường" : "Thêm tuyến đường mới"}
      open={open}
      onCancel={onClose}
      width={620}
      footer={renderModalFooter({
        cancelText: "Hủy",
        submitText: isEdit ? "Lưu thay đổi" : "Thêm tuyến đường",
        onCancel: onClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<AddRouteFormValues>
        form={form}
        layout="vertical"
        style={{ padding: "8px 0" }}
        initialValues={defaultValues}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="id"
              label={formLabel("Mã tuyến")}
              rules={[{ required: true, message: "Nhập mã tuyến" }]}
            >
              <Input
                placeholder="RT-201"
                style={fieldStyle}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={formLabel("Trạng thái")}
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select
                className="bm-select"
                options={routeStatusOptions.filter(
                  (item) => item.value !== "all",
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="route"
          label={formLabel("Tên tuyến")}
          rules={[{ required: true, message: "Nhập tên tuyến" }]}
        >
          <Input placeholder="HCM → Đà Lạt" style={fieldStyle} />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="distanceKm"
              label={formLabel("Quãng đường (km)")}
              rules={[{ required: true, message: "Nhập quãng đường" }]}
            >
              <InputNumber
                min={1}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="standardDuration"
              label={formLabel("Thời lượng chuẩn")}
              rules={[{ required: true, message: "Nhập thời lượng chuẩn" }]}
            >
              <Input placeholder="7h30" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="tripsPerDay"
              label={formLabel("Số chuyến/ngày")}
              rules={[{ required: true, message: "Nhập số chuyến/ngày" }]}
            >
              <InputNumber
                min={1}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="averageOccupancy"
              label={formLabel("Tỷ lệ lấp đầy TB")}
              rules={[{ required: true, message: "Nhập tỷ lệ lấp đầy" }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ ...fieldStyle, width: "100%" }}
                {...numberFieldProps}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="leadVehicle"
              label={formLabel("Xe chủ lực")}
              rules={[{ required: true, message: "Chọn xe chủ lực" }]}
            >
              <Select
                className="bm-select"
                options={vehicleOptions.filter((item) => item.value !== "all")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="demandLevel"
              label={formLabel("Mức nhu cầu")}
              rules={[{ required: true, message: "Chọn mức nhu cầu" }]}
            >
              <Select className="bm-select" options={demandLevelOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="estimatedRevenue"
          label={formLabel("Doanh thu ước tính")}
          rules={[{ required: true, message: "Nhập doanh thu ước tính" }]}
        >
          <InputNumber
            min={1}
            style={{ ...fieldStyle, width: "100%" }}
            {...numberFieldProps}
          />
        </Form.Item>

        <Form.Item name="note" label={formLabel("Ghi chú")}>
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú tuyến..."
            style={{ ...fieldStyle, resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRouteModal;
