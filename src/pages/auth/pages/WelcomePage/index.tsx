import { Button } from "antd";
import { Banner } from "../../component/Banner";
import "./style.scss";
import { Logo } from "../../../../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../../../../routers/Route";

export const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(ROUTER_PATH.LOGIN);
  };

  const handleRegisterClick = () => {
    navigate(ROUTER_PATH.SIGNIN);
  };
  return (
    <div className="auth__welcome">
      <div className="welcome-banner">
        <div className="banner-overlay">
          <Banner />
        </div>

        <div className="banner-content">
          <p className="banner-eyebrow">🚖 Dịch vụ đặt xe thông minh</p>
          <h2 className="banner-headline">
            Mọi hành trình,
            <br />
            <em>một chạm tới nơi</em>
          </h2>
          <p className="banner-sub">
            Kết nối bạn với hàng nghìn tài xế chuyên nghiệp.
            <br />
            Nhanh chóng, an toàn, đúng giờ.
          </p>
          <div className="banner-badges">
            <span className="badge">Có mặt 24/7</span>
            <span className="badge">Toàn quốc</span>
            <span className="badge">Giá minh bạch</span>
          </div>
        </div>
      </div>

      <div className="welcome-form">
        <div className="welcome-form__logo">
          <Logo />
        </div>

        <h1 className="welcome-form__title">
          Chào mừng
          <br />
          trở lại! 👋
        </h1>
        <p className="welcome-form__description">
          Đặt xe nhanh chóng đến bất kỳ địa điểm nào bạn muốn. Hành trình của
          bạn bắt đầu từ đây.
        </p>

        <Button
          type="primary"
          className="welcome-form__button welcome-form__button--primary"
          block
          onClick={handleLoginClick}
        >
          Đăng nhập tài khoản →
        </Button>

        <div className="welcome-form__divider">
          <span />
          <p>Chưa có tài khoản?</p>
          <span />
        </div>

        <Button
          type="default"
          className="welcome-form__button welcome-form__button--secondary"
          block
          onClick={handleRegisterClick}
        >
          Đăng ký miễn phí
        </Button>

        <p className="welcome-form__footer">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <Link to={ROUTER_PATH.SUPPORT}>Điều khoản dịch vụ</Link> &amp;{" "}
          <Link to={ROUTER_PATH.SUPPORT}>Chính sách bảo mật</Link>.
        </p>
      </div>
    </div>
  );
};
