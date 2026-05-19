import "./style.scss";

export const Logo = () => {
  return (
    <div className="logo">
      <div className="logo-icon">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M3 14l2-5h10l2 5H3z" fill="#f5a623" />
          <rect x="5" y="14" width="3" height="3" rx="1.5" fill="#f5a623" />
          <rect x="12" y="14" width="3" height="3" rx="1.5" fill="#f5a623" />
          <path
            d="M7 9l1-3h4l1 3"
            stroke="#fff"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      <span className="logo-name">
        GO<span>RIDE</span>
      </span>
    </div>
  );
};
