export const Banner = () => {
  return (
    <svg
      className="banner-svg"
      viewBox="0 0 380 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="60%" stopColor="#0f1629" />
          <stop offset="100%" stopColor="#141d35" />
        </linearGradient>
        <linearGradient id="roadG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1f30" />
          <stop offset="100%" stopColor="#0d1020" />
        </linearGradient>
      </defs>

      <rect width="380" height="600" fill="url(#skyG)" />

      <rect x="0" y="200" width="55" height="400" fill="#111827" />
      <rect
        x="8"
        y="220"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.3"
        className="blink"
      />
      <rect x="8" y="240" width="10" height="8" fill="#f5a623" opacity="0.5" />
      <rect
        x="22"
        y="215"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.6"
        className="blink2"
      />
      <rect x="22" y="235" width="10" height="8" fill="#f5a623" opacity="0.2" />
      <rect
        x="38"
        y="225"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.4"
        className="blink"
      />
      <rect x="0" y="260" width="48" height="340" fill="#0d111e" />
      <rect x="6" y="270" width="10" height="8" fill="#fdc96a" opacity="0.3" />
      <rect
        x="6"
        y="285"
        width="10"
        height="8"
        fill="#fdc96a"
        opacity="0.5"
        className="blink"
      />
      <rect x="20" y="270" width="10" height="8" fill="#fdc96a" opacity="0.2" />
      <rect
        x="20"
        y="290"
        width="10"
        height="8"
        fill="#fdc96a"
        opacity="0.6"
        className="blink2"
      />
      <rect x="34" y="278" width="10" height="8" fill="#fdc96a" opacity="0.4" />

      <rect x="310" y="180" width="70" height="420" fill="#111827" />
      <rect
        x="318"
        y="195"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.4"
        className="blink2"
      />
      <rect
        x="318"
        y="215"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.3"
      />
      <rect
        x="332"
        y="200"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.6"
        className="blink"
      />
      <rect
        x="332"
        y="220"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.2"
      />
      <rect
        x="348"
        y="188"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.5"
      />
      <rect
        x="358"
        y="210"
        width="10"
        height="8"
        fill="#f5a623"
        opacity="0.3"
        className="blink"
      />
      <rect x="320" y="245" width="50" height="355" fill="#0d111e" />
      <rect
        x="326"
        y="255"
        width="10"
        height="8"
        fill="#fdc96a"
        opacity="0.5"
        className="blink2"
      />
      <rect
        x="342"
        y="260"
        width="10"
        height="8"
        fill="#fdc96a"
        opacity="0.6"
        className="blink"
      />

      <polygon points="100,200 280,200 380,600 0,600" fill="url(#roadG)" />
      <line
        x1="100"
        y1="200"
        x2="0"
        y2="600"
        stroke="#ffffff"
        strokeOpacity="0.06"
        strokeWidth="1"
      />
      <line
        x1="280"
        y1="200"
        x2="380"
        y2="600"
        stroke="#ffffff"
        strokeOpacity="0.06"
        strokeWidth="1"
      />
      <line
        x1="190"
        y1="210"
        x2="190"
        y2="600"
        stroke="#f5a623"
        strokeOpacity="0.7"
        strokeWidth="2"
        className="road-line"
      />
      <line
        x1="155"
        y1="210"
        x2="80"
        y2="600"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1"
        className="road-line"
      />
      <line
        x1="225"
        y1="210"
        x2="300"
        y2="600"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1"
        className="road-line"
      />

      <ellipse
        cx="190"
        cy="520"
        rx="120"
        ry="18"
        fill="#f5a623"
        opacity="0.12"
      />
      <ellipse
        cx="190"
        cy="560"
        rx="160"
        ry="14"
        fill="#f5a623"
        opacity="0.08"
      />

      <g className="car">
        <rect x="178" y="-50" width="24" height="38" rx="4" fill="#1e2a45" />
        <rect x="183" y="-50" width="14" height="16" rx="2" fill="#2a3a5e" />
        <circle cx="183" cy="-12" r="4" fill="#2a2a2a" />
        <circle cx="199" cy="-12" r="4" fill="#2a2a2a" />
        <rect
          x="175"
          y="-44"
          width="5"
          height="8"
          rx="1"
          fill="#fdc96a"
          opacity="0.9"
        />
        <rect
          x="202"
          y="-44"
          width="5"
          height="8"
          rx="1"
          fill="#fdc96a"
          opacity="0.9"
        />
        <ellipse
          cx="180"
          cy="-38"
          rx="8"
          ry="4"
          fill="#fdc96a"
          opacity="0.35"
        />
        <ellipse
          cx="202"
          cy="-38"
          rx="8"
          ry="4"
          fill="#fdc96a"
          opacity="0.35"
        />
      </g>

      <g className="car2">
        <rect x="140" y="-70" width="20" height="32" rx="3" fill="#162235" />
        <rect x="144" y="-70" width="12" height="14" rx="2" fill="#1e3050" />
        <circle cx="144" cy="-38" r="3.5" fill="#1a1a1a" />
        <circle cx="156" cy="-38" r="3.5" fill="#1a1a1a" />
        <rect
          x="137"
          y="-65"
          width="4"
          height="7"
          rx="1"
          fill="#f5a623"
          opacity="0.7"
        />
        <rect
          x="159"
          y="-65"
          width="4"
          height="7"
          rx="1"
          fill="#f5a623"
          opacity="0.7"
        />
      </g>

      <g className="car3">
        <rect x="220" y="-60" width="22" height="34" rx="3" fill="#1a1a28" />
        <rect x="224" y="-60" width="14" height="13" rx="2" fill="#22253a" />
        <circle cx="224" cy="-26" r="3.5" fill="#1a1a1a" />
        <circle cx="238" cy="-26" r="3.5" fill="#1a1a1a" />
        <rect
          x="218"
          y="-32"
          width="4"
          height="8"
          rx="1"
          fill="#ff4444"
          opacity="0.8"
        />
        <rect
          x="240"
          y="-32"
          width="4"
          height="8"
          rx="1"
          fill="#ff4444"
          opacity="0.8"
        />
      </g>

      <circle cx="60" cy="40" r="1" fill="white" opacity="0.6" />
      <circle cx="160" cy="25" r="1.2" fill="white" opacity="0.8" />
      <circle cx="260" cy="55" r="0.8" fill="white" opacity="0.5" />
      <circle cx="320" cy="30" r="1" fill="white" opacity="0.7" />

      <circle cx="310" cy="50" r="14" fill="#1f2a45" />
      <circle cx="305" cy="45" r="14" fill="#ffecc0" opacity="0.85" />

      <line
        x1="95"
        y1="200"
        x2="75"
        y2="340"
        stroke="#2a3550"
        strokeWidth="2"
      />
      <circle cx="93" cy="206" r="6" fill="#fdc96a" opacity="0.8" />
      <ellipse cx="93" cy="215" rx="18" ry="6" fill="#fdc96a" opacity="0.12" />
      <line
        x1="285"
        y1="200"
        x2="305"
        y2="340"
        stroke="#2a3550"
        strokeWidth="2"
      />
      <circle cx="287" cy="206" r="6" fill="#fdc96a" opacity="0.8" />
      <ellipse cx="287" cy="215" rx="18" ry="6" fill="#fdc96a" opacity="0.12" />
    </svg>
  );
};
