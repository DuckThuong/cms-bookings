import React, { useEffect } from 'react';
import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import {
  driverLicenseOptions,
  driverShiftOptions,
  driverStatusOptions,
  routeOptions,
  type AddDriverFormValues,
  type DriverRecord,
  type ManagementModalMode,
  vehicleOptions,
} from '../../share';
import { fieldStyle, formLabel, numberFieldProps, renderModalFooter } from './shared';

type AddDriverModalProps = {
  mode?: ManagementModalMode;
  open: boolean;
  onClose: () => void;
  initialValues?: DriverRecord | null;
  onSubmit: (record: DriverRecord) => void;
};

const defaultValues: AddDriverFormValues = {
  id: '',
  name: '',
  phone: '',
  license: 'B2',
  assignedVehicle: '',
  mainRoute: '',
  shift: 'Ca sáng',
  tripCount: 0,
  status: 'available',
  note: '',
};

const AddDriverModal = ({
  mode = 'create',
  open,
  onClose,
  initialValues,
  onSubmit,
}: AddDriverModalProps) => {
  const [form] = Form.useForm<AddDriverFormValues>();
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (open) {
      if (isEdit && initialValues) {
        form.setFieldsValue({
          id: initialValues.id,
          name: initialValues.name,
          phone: initialValues.phone,
          license: initialValues.license,
          assignedVehicle: initialValues.assignedVehicle,
          mainRoute: initialValues.mainRoute,
          shift: initialValues.shift,
          tripCount: initialValues.tripCount,
          status: initialValues.status,
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
      key: initialValues?.key ?? `driver-${Date.now()}`,
      id: values.id,
      name: values.name,
      phone: values.phone,
      license: values.license as DriverRecord['license'],
      assignedVehicle: values.assignedVehicle,
      mainRoute: values.mainRoute,
      tripCount: values.tripCount,
      rating: 0,
      status: values.status as DriverRecord['status'],
      shift: values.shift,
      note: values.note?.trim() ?? '',
    });

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      className="bm-modal mgmt-modal"
      title={isEdit ? 'Cập nhật tài xế' : 'Thêm tài xế mới'}
      open={open}
      onCancel={onClose}
      width={620}
      footer={renderModalFooter({
        cancelText: 'Hủy',
        submitText: isEdit ? 'Lưu thay đổi' : 'Thêm tài xế',
        onCancel: onClose,
        onSubmit: handleSubmit,
      })}
    >
      <Form<AddDriverFormValues>
        form={form}
        layout="vertical"
        style={{ padding: '8px 0' }}
        initialValues={defaultValues}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="id"
              label={formLabel('Mã tài xế')}
              rules={[{ required: true, message: 'Nhập mã tài xế' }]}
            >
              <Input placeholder="DRV-399" style={fieldStyle} disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={formLabel('Số điện thoại')}
              rules={[{ required: true, message: 'Nhập số điện thoại' }]}
            >
              <Input placeholder="0903000999" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="name"
          label={formLabel('Họ tên')}
          rules={[{ required: true, message: 'Nhập họ tên' }]}
        >
          <Input placeholder="Nguyễn Văn A" style={fieldStyle} />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="license"
              label={formLabel('Bằng lái')}
              rules={[{ required: true, message: 'Chọn bằng lái' }]}
            >
              <Select
                className="bm-select"
                options={driverLicenseOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={formLabel('Trạng thái')}
              rules={[{ required: true, message: 'Chọn trạng thái' }]}
            >
              <Select
                className="bm-select"
                options={driverStatusOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="assignedVehicle"
              label={formLabel('Xe phụ trách')}
              rules={[{ required: true, message: 'Chọn xe phụ trách' }]}
            >
              <Select
                className="bm-select"
                options={vehicleOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="mainRoute"
              label={formLabel('Tuyến chính')}
              rules={[{ required: true, message: 'Chọn tuyến chính' }]}
            >
              <Select
                className="bm-select"
                options={routeOptions.filter((item) => item.value !== 'all')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="shift"
              label={formLabel('Ca làm')}
              rules={[{ required: true, message: 'Chọn ca làm' }]}
            >
              <Select className="bm-select" options={driverShiftOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="tripCount"
              label={formLabel('Số chuyến')}
              rules={[{ required: true, message: 'Nhập số chuyến' }]}
            >
              <InputNumber min={0} style={{ ...fieldStyle, width: '100%' }} {...numberFieldProps} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="note" label={formLabel('Ghi chú')}>
          <Input.TextArea rows={3} placeholder="Ghi chú tài xế..." style={{ ...fieldStyle, resize: 'none' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDriverModal;
