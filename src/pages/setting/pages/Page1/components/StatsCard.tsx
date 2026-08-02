import "./StatsCard.scss";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}

export const StatsCard = ({
  icon,
  label,
  value,
  sub,
  color,
}: StatsCardProps) => (
  <div className="ps-stat">
    <div className="ps-stat__icon" style={{ background: `${color}15` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="ps-stat__label">{label}</div>
    <div className="ps-stat__value">{value}</div>
    <div className="ps-stat__sub">{sub}</div>
  </div>
);
