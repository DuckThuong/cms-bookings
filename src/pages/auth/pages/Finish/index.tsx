import { useEffect, useRef } from "react";
import { Button } from "antd";
import { Logo } from "@/components/Logo";
import "./style.scss";
import { ROUTER_PATH } from "@/routers/Route";

export const Finish = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }[] = [];

    const colors = [
      "#f5a623",
      "#fbbf24",
      "#0a0e1a",
      "#fff8ec",
      "#ffffff",
      "#fde68a",
    ];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.45 + Math.random() * 60 - 30,
        vx: (Math.random() - 0.5) * 5,
        vy: -(Math.random() * 5 + 3),
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.006,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
        p.alpha -= p.decay;
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (Math.random() > 0.5) {
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        } else {
          ctx.fillRect(p.x, p.y, p.size, p.size * 0.5);
        }
        ctx.fill();
        ctx.restore();
      });
      if (particles.some((p) => p.alpha > 0)) {
        frame = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="auth__finish">
      <canvas ref={canvasRef} className="finish__confetti" />

      <div className="auth__logo finish__logo-fade">
        <Logo />
      </div>

      <div className="finish__card">
        {/* Success icon */}
        <div className="finish__icon-wrap">
          <div className="finish__icon-ring" />
          <div className="finish__icon">
            <svg viewBox="0 0 36 36" fill="none">
              <path
                d="M8 18.5l6.5 6.5 13.5-14"
                stroke="#f5a623"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="finish__check-path"
              />
            </svg>
          </div>
          <div className="finish__icon-badge">✦</div>
        </div>

        <p className="finish__eyebrow">Xác thực thành công</p>
        <h1 className="finish__title">
          Chào mừng
          <br />
          trở lại!
        </h1>
        <p className="finish__sub">
          <strong>TRỊNH ĐỨC THƯỞNG</strong>
          <br />
          Xác minh thành công số điện thoại <strong>098 765 4321</strong> .
          <br />
          <strong>GORIDE</strong> <span>đã sẵn sàng để sử dụng</span>
        </p>

        {/* Info pills */}
        <div className="finish__pills">
          <div className="finish__pill">
            <span className="finish__pill-dot finish__pill-dot--green" />
            Tài khoản đã kích hoạt
          </div>
          <div className="finish__pill">
            <span className="finish__pill-dot finish__pill-dot--amber" />
            Phiên đăng nhập an toàn
          </div>
        </div>
      </div>

      {/* Action area */}
      <div className="finish__action">
        <Button
          type="primary"
          block
          className="finish__btn"
          href={ROUTER_PATH.HOME}
        >
          Bắt đầu ngay
        </Button>

        <p className="finish__hint">
          <svg viewBox="0 0 14 14" fill="none" className="finish__hint-icon">
            <path
              d="M7 1L2 3v4c0 3 2.3 5.3 5 6 2.7-.7 5-3 5-6V3L7 1z"
              stroke="#9ca3af"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M4.5 7l2 2 3-3"
              stroke="#9ca3af"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Phiên đăng nhập được bảo mật bằng mã hoá SSL 256-bit
        </p>
      </div>
    </div>
  );
};
