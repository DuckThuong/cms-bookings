import type { CmsDashboardWeeklyPoint } from "@/api/dtos/dashboard.dto";
import { STATUS_COLORS } from "@/pages/dashboard/share";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number; fill: string }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__label">{label}</div>
      {payload.map((entry) => (
        <div className="custom-tooltip__row" key={entry.dataKey}>
          <span className="legend-dot" style={{ background: entry.fill }} />
          <span style={{ color: "#94a3b8", fontSize: 11 }}>
            {entry.dataKey === "completed" ? "Hoàn thành" : "Đã hủy"}:
          </span>
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

type WeeklyBookingChartProps = {
  data: CmsDashboardWeeklyPoint[];
};

const WeeklyBookingChart = ({ data }: WeeklyBookingChartProps) => (
  <div className="chart-panel" style={{ minHeight: 300 }}>
    <div className="chart-panel__header">
      <div>
        <div className="chart-panel__title">Đặt vé theo ngày trong tuần</div>
        <div className="chart-panel__subtitle">Tuần hiện tại</div>
      </div>
    </div>

    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
        barGap={4}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: 10 }}
          formatter={(value) =>
            value === "completed" ? "Hoàn thành" : "Đã hủy"
          }
        />
        <Bar
          dataKey="completed"
          fill={STATUS_COLORS.completed}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="cancelled"
          fill={STATUS_COLORS.cancelled}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default WeeklyBookingChart;
