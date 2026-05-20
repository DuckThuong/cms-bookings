import React from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { vehicles } from '../../../share/bookingManagement';
import { numberFieldProps } from '../../ManagementCreate/shared';

const { Option } = Select;

const ROUTES = [
  'HCM → Đà Lạt',
  'HCM → Nha Trang',
  'HCM → Hà Nội',
  'HCM → Vũng Tàu',
  'HCM → Cần Thơ',
  'HCM → Đà Nẵng',
  'HCM → Phan Thiết',
  'HCM → Mũi Né',
];

interface AddBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  defaultVehicle: string;
}

const fieldStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#f1f5f9',
};

const AddBookingModal = ({ open, onClose, onSubmit, defaultVehicle }: AddBookingModalProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      className="bm-modal"
      title="Thêm đặt vé mới"
      open={open}
      onCancel={onClose}
      width={560}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button className="btn-ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button className="btn-primary" onClick={handleOk}>
            Tạo đặt vé
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ vehicleId: defaultVehicle !== 'all' ? defaultVehicle : undefined }}
        style={{ padding: '8px 0' }}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="customer"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Tên khách hàng</span>}
              rules={[{ required: true, message: 'Nhập tên khách' }]}
            >
              <Input placeholder="Nguyễn Văn A" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Số điện thoại</span>}
              rules={[{ required: true, message: 'Nhập SĐT' }]}
            >
              <Input placeholder="09xxxxxxxx" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleId"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Xe</span>}
              rules={[{ required: true, message: 'Chọn xe' }]}
            >
              <Select className="bm-select" placeholder="Chọn xe">
                {vehicles
                  .filter((vehicle) => vehicle.id !== 'all')
                  .map((vehicle) => (
                    <Option
                      key={vehicle.id}
                      value={vehicle.id}
                      disabled={vehicle.status === 'maintenance'}
                    >
                      {vehicle.icon} {vehicle.label}{' '}
                      {vehicle.status === 'maintenance' ? '(Bảo dưỡng)' : ''}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="route"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Tuyến đường</span>}
              rules={[{ required: true, message: 'Chọn tuyến' }]}
            >
              <Select className="bm-select" placeholder="Chọn tuyến">
                {ROUTES.map((route) => (
                  <Option key={route} value={route}>
                    {route}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="departure"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Giờ khởi hành</span>}
              rules={[{ required: true, message: 'Chọn giờ' }]}
            >
              <DatePicker
                className="bm-date-picker"
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                placeholder="Chọn ngày giờ"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="seatCount"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Số ghế</span>}
              rules={[{ required: true, message: 'Nhập số ghế' }]}
            >
              <InputNumber min={1} max={45} placeholder="2" style={{ ...fieldStyle, width: '100%' }} {...numberFieldProps} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="pickup"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Điểm đón</span>}
            >
              <Input placeholder="Bến xe Miền Đông" style={fieldStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="dropoff"
              label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Điểm trả</span>}
            >
              <Input placeholder="Bến xe Đà Lạt" style={fieldStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="note"
          label={<span style={{ color: '#94a3b8', fontSize: 12 }}>Ghi chú</span>}
        >
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú thêm..."
            style={{ ...fieldStyle, resize: 'none' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBookingModal;
