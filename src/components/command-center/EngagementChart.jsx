import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: 'Mon', engagement: 4200, reach: 12000, impressions: 28000 },
  { day: 'Tue', engagement: 3800, reach: 11200, impressions: 25000 },
  { day: 'Wed', engagement: 5100, reach: 14500, impressions: 32000 },
  { day: 'Thu', engagement: 4700, reach: 13800, impressions: 30000 },
  { day: 'Fri', engagement: 6200, reach: 18000, impressions: 41000 },
  { day: 'Sat', engagement: 7800, reach: 22000, impressions: 52000 },
  { day: 'Sun', engagement: 5400, reach: 16000, impressions: 36000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-panel rounded-lg p-3 border border-border">
      <p className="text-xs font-medium text-foreground mb-2">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="text-xs" style={{ color: item.color }}>
          {item.name}: {item.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function EngagementChart() {
  return (
    <div className="glass-panel rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Engagement Trends (7-Day)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={mockData}>
          <defs>
            <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(42 70% 55%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(42 70% 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(200 65% 50%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(200 65% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 16%)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220 10% 55%)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(220 10% 55%)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="engagement" name="Engagement" stroke="hsl(42 70% 55%)" fill="url(#engGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="reach" name="Reach" stroke="hsl(200 65% 50%)" fill="url(#reachGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}