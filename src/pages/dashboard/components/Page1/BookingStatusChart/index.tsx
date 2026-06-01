import type { CmsDashboardStatusSlice } from "@/api/dtos/dashboard.dto";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: data } = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__row">
        <span className="legend-dot" style={{ background: data.color }} />
        <span>{name}</span>
        <span style={{ marginLeft: "auto", paddingLeft: 12 }}>{value}%</span>
      </div>
    </div>
  );
};

type BookingStatusChartProps = {
  data: CmsDashboardStatusSlice[];
};

const BookingStatusChart = ({ data }: BookingStatusChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-panel" style={{ minHeight: 320 }}>
      <div className="chart-panel__header">
        <div>
          <div className="chart-panel__title">Trạng thái đặt vé</div>
          <div className="chart-panel__subtitle">Phân bổ theo trạng thái</div>
        </div>
      </div>

      <div style={{ position: "relative", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`${entry.status}-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1,
            }}
          >
            {total}%
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>
            Tổng
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
          marginTop: 16,
        }}
      >
        {data.map((item) => (
          <div
            key={item.status}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              className="legend-dot"
              style={{ background: item.color, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>
              {item.name}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStatusChart;
