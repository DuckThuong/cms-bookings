import type {
  CmsDashboardRevenuePoint,
  DashboardPeriod,
} from "@/api/dtos/dashboard.dto";
import { CHART_COLORS } from "@/pages/dashboard/share";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string; name: string }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__label">Tháng {label}</div>
      {payload.map((entry) => (
        <div className="custom-tooltip__row" key={entry.dataKey}>
          <span className="legend-dot" style={{ background: entry.color }} />
          <span style={{ color: "#94a3b8", fontSize: 11 }}>{entry.name}:</span>
          <span>
            {entry.dataKey === "revenue"
              ? `${entry.value.toLocaleString()}tr ₫`
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const PERIODS: DashboardPeriod[] = ["7N", "1T", "3T", "1N"];

type RevenueChartProps = {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  revenueSeries: CmsDashboardRevenuePoint[];
  revenueMomPercent: number;
};

const RevenueChart = ({
  period,
  onPeriodChange,
  revenueSeries,
  revenueMomPercent,
}: RevenueChartProps) => {
  const momLabel =
    revenueMomPercent >= 0
      ? `↑ ${revenueMomPercent}% MoM`
      : `↓ ${Math.abs(revenueMomPercent)}% MoM`;

  return (
    <div className="chart-panel" style={{ minHeight: 320 }}>
      <div className="chart-panel__header">
        <div>
          <div className="chart-panel__title">Doanh thu & Lượt đặt vé</div>
          <div className="chart-panel__subtitle">Xu hướng theo tháng</div>
        </div>
        <div className="chart-panel__actions">
          <span className="chart-panel__badge">{momLabel}</span>
          <div className="period-selector">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                className={period === p ? "active" : ""}
                onClick={() => onPeriodChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={revenueSeries}
          margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={CHART_COLORS.accent}
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor={CHART_COLORS.accent}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.info} stopOpacity={0.2} />
              <stop offset="95%" stopColor={CHART_COLORS.info} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />

          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="revenue"
            orientation="left"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <YAxis
            yAxisId="bookings"
            orientation="right"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: 12 }}
            formatter={(value: string) =>
              value === "revenue" ? "Doanh thu (tr ₫)" : "Lượt đặt"
            }
          />

          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.accent}
            strokeWidth={2}
            fill="url(#gradRevenue)"
            dot={false}
            activeDot={{ r: 5, fill: CHART_COLORS.accent, strokeWidth: 0 }}
          />
          <Area
            yAxisId="bookings"
            type="monotone"
            dataKey="bookings"
            stroke={CHART_COLORS.info}
            strokeWidth={2}
            fill="url(#gradBookings)"
            dot={false}
            activeDot={{ r: 5, fill: CHART_COLORS.info, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
