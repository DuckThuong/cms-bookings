import type { CmsDashboardVehicleType } from "@/api/dtos/dashboard.dto";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { fill: string; value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__label">{label}</div>
      <div className="custom-tooltip__row">
        <span
          className="legend-dot"
          style={{ background: payload[0].fill }}
        />
        <span>Số xe:</span>
        <span>{payload[0].value}</span>
      </div>
    </div>
  );
};

type VehicleTypeChartProps = {
  data: CmsDashboardVehicleType[];
};

const VehicleTypeChart = ({ data }: VehicleTypeChartProps) => (
  <div className="chart-panel" style={{ minHeight: 300 }}>
    <div className="chart-panel__header">
      <div>
        <div className="chart-panel__title">Phân loại xe</div>
        <div className="chart-panel__subtitle">Theo loại phương tiện</div>
      </div>
    </div>

    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="type"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`${entry.type}-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default VehicleTypeChart;
