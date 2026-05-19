// src/components/dashboard/BookingStatusChart.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { bookingStatusData } from '@/pages/dashboard/share';

interface CustomTooltipProps {
  active: boolean;
  payload: any[];
}
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: data } = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__row">
        <span className="legend-dot" style={{ background: data.color }} />
        <span>{name}</span>
        <span style={{ marginLeft: 'auto', paddingLeft: 12 }}>{value}%</span>
      </div>
    </div>
  );
};

const BookingStatusChart = () => {
  const total = bookingStatusData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="chart-panel" style={{ minHeight: 320 }}>
      <div className="chart-panel__header">
        <div>
          <div className="chart-panel__title">Trạng thái đặt vé</div>
          <div className="chart-panel__subtitle">Phân bổ theo trạng thái</div>
        </div>
      </div>

      <div style={{ position: 'relative', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={bookingStatusData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {bookingStatusData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip active={true} payload={[]} /> as any} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}
          >
            {total}%
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
            Tổng
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px 16px',
          marginTop: 16,
        }}
      >
        {bookingStatusData.map((item) => (
          <div
            key={item.name}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span
              className="legend-dot"
              style={{ background: item.color, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>
              {item.name}
            </span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}
            >
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStatusChart;