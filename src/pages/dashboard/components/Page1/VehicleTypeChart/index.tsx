// src/components/dashboard/VehicleTypeChart.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { vehicleTypeData } from '@/pages/dashboard/share';

interface CustomTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
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

const VehicleTypeChart = () => (
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
        data={vehicleTypeData}
        margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="type"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip
          content={(<CustomTooltip active={true} payload={[]} label="" />) as any}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {vehicleTypeData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default VehicleTypeChart;