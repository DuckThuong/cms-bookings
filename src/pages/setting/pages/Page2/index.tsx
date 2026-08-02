import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import './style.scss';

export const PaymentSettingPage = () => {
    const [form] = Form.useForm();

    const handleReset = () => {
        form.resetFields();
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            // Handle save logic here
        });
    };

    return (
        <div className="payment_setting_page mgmt-page">
            <div className="mgmt-hero">
                <div className="mgmt-hero__eyebrow">Quản lý cài đặt</div>
                <div className="mgmt-hero__title">Cài đặt hệ thống và thông tin chuyển khoản</div>
                <div className="mgmt-hero__subtitle">Quản lý các cài đặt liên quan đến hệ thống và thông tin chuyển khoản</div>
            </div>
            <div className="payment_setting_wrapper">
                <div className="setting_wrapper-main">
                    <div className="mgmt-main__content">
                        <Form form={form} onFinish={() => { }} className='payment__form' layout="vertical">
                            <Form.Item name="payosClientId" label="PayOs Client Id">
                                <Input.Password
                                    type="password"
                                    size="large"
                                    placeholder={"Mã khách hàng PayOs"}
                                />
                            </Form.Item>
                            <Form.Item name="payosChecksumKey" label="PayOs Checksum Key">
                                <Input.Password
                                    type="password"
                                    size="large"
                                    placeholder={"Mã kiểm tra PayOs"}
                                /></Form.Item>
                            <Form.Item name="payosApiKey" label="PayOs Api Key">
                                <Input.Password
                                    type="password"
                                    size="large"
                                    placeholder={"Mã API PayOs"}
                                />
                            </Form.Item>
                            <p className="sub-help">
                                Lưu ý: Thông tin chuyển khoản sẽ được sử dụng để xác thực các giao dịch thanh toán và đảm bảo tính bảo mật cho tài khoản của bạn. Vui lòng nhập thông tin chính xác và bảo mật.
                                <br /> Nếu còn bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi để được hỗ trợ thêm.
                                <br /> Hướng dẫn chi tiết về cách lấy thông tin PayOs Client Id, PayOs Checksum Key và PayOs Api Key có thể được tìm thấy trong <a href="https://docs.payos.vn/" target="_blank" rel="noopener noreferrer">tài liệu hướng dẫn của PayOs</a> hoặc liên hệ trực tiếp với bộ phận hỗ trợ của PayOs để được hướng dẫn cụ thể.
                            </p>
                            <div className="ps-actions">
                                <Button
                                    className="ps-actions__reset"
                                    icon={<ReloadOutlined />}
                                    onClick={handleReset}
                                >
                                    Đặt lại
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    className="ps-actions__save"
                                    onClick={handleSave}
                                >
                                    Lưu cài đặt
                                </Button>
                            </div>
                        </Form>

                    </div>
                </div>
            </div>
        </div>
    )
}