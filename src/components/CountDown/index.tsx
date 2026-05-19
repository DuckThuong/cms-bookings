import "./style.scss";

interface CountDownProps {
  isUrgent?: boolean;
  seconds: number;
  CIRCUMFERENCE: number;
  strokeOffset: number;
}
export const CountDown = (props: CountDownProps) => {
  return (
    <div className="otp-countdown">
      <div className="otp-countdown__ring">
        <svg width="54" height="54" viewBox="0 0 54 54">
          <circle
            cx="27"
            cy="27"
            r="22"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <circle
            cx="27"
            cy="27"
            r="22"
            fill="none"
            stroke={props.isUrgent ? "#ef4444" : "#f5a623"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={props.CIRCUMFERENCE}
            strokeDashoffset={props.strokeOffset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dashoffset .9s linear, stroke .3s",
            }}
          />
        </svg>
        <span
          className={`otp-countdown__num${props.isUrgent ? " otp-countdown__num--urgent" : ""}`}
        >
          {props.seconds}
        </span>
      </div>
      <span className="otp-countdown__label">Mã hết hạn sau</span>
    </div>
  );
};
