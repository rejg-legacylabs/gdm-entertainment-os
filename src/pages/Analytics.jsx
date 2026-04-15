import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Heart, MessageSquare, Share2, Users, TrendingUp, MousePointer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MetricCard from '@/components/ui-premium/MetricCard';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';
import BrandBadge from '@/components/ui-premium/BrandBadge';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-panel rounded-lg p-3 border border-border text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((item, i) => (
        <p key={i} style={{ color: item.color }}>{item.name}: {item.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

const weeklyData = [
  { day: 'Mon', impressions: 28000, engagement: 4200, reach: 12000 },
  { day: 'Tue', impressions: 25000, engagement: 3800, reach: 11200 },
  { day: 'Wed', impressions: 32000, engagement: 5100, reach: 14500 },
  { day: 'Thu', impressions: 30000, engagement: 4700, reach: 13800 },
  { day: 'Fri', impressions: 41000, engagement: 6200, reach: 18000 },
  { day: 'Sat', impressions: 52000, engagement: 7800, reach: 22000 },
  { day: 'Sun', impressions: 36000, engagement: 5400, reach: 16000 },
];

const platformData = [
  { name: 'Instagram', value: 42, color: 'hsl(340, 75%, 55%)' },
  { name: 'Facebook', value: 22, color: 'hsl(220, 70%, 55%)' },
  { name: 'LinkedIn', value: 18, color: 'hsl(200, 65%, 50%)' },
  { name: 'TikTok', value: 12, color: 'hsl(280, 65%, 60%)' },
  { name: 'YouTube', value: 6, color: 'hsl(0, 72%, 51%)' },
];

const followerGrowth = [
  { week: 'W1', followers: 12400 }, { week: 'W2', followers: 12800 }, { week: 'W3', followers: 13500 },
  { week: 'W4', followers: 14200 }, { week: 'W5', followers: 14800 }, { week: 'W6', followers: 15600 },
  { week: 'W7', followers: 16400 }, { week: 'W8', followers: 17200 },
];

export default function Analytics() {
  const [brandFilter, setBrandFilter] = useState('all');

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list(),
  });

  const published = posts.filter(p => p.status === 'published');
  const totalImpressions = published.reduce((s, p) => s + (p.impressions || 0), 0);
  const totalReach = published.reduce((s, p) => s + (p.reach || 0), 0);
  const totalEngagement = published.reduce((s, p) => s + (p.engagement || 0), 0);
  const totalClicks = published.reduce((s, p) => s + (p.clicks || 0), 0);
  const totalShares = published.reduce((s, p) => s + (p.shares || 0), 0);
  const totalSaves = published.reduce((s, p) => s + (p.saves || 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Performance Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground font-display">Analytics</h1>
          </div>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-52 bg-secondary border-border"><SelectValue placeholder="All Brands" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Impressions" value={totalImpressions.toLocaleString()} change={18} icon={Eye} index={0} />
        <MetricCard title="Reach" value={totalReach.toLocaleString()} change={12} icon={Users} index={1} />
        <MetricCard title="Engagement" value={totalEngagement.toLocaleString()} change={23} icon={Heart} index={2} />
        <MetricCard title="Clicks" value={totalClicks.toLocaleString()} change={9} icon={MousePointer} index={3} />
        <MetricCard title="Shares" value={totalShares.toLocaleString()} change={31} icon={Share2} index={4} />
        <MetricCard title="Saves" value={totalSaves.toLocaleString()} change={15} icon={TrendingUp} index={5} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 16%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220 10% 55%)' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 10% 55%)' }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="engagement" name="Engagement" fill="hsl(42 70% 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reach" name="Reach" fill="hsl(200 65% 50%)" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {platformData.map(p => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-foreground">{p.name}</span>
                </div>
                <span className="text-muted-foreground">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follower Growth + AI */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Follower Growth (8 Weeks)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={followerGrowth}>
              <defs>
                <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(42 70% 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(42 70% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 16%)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(220 10% 55%)' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 10% 55%)' }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="followers" name="Followers" stroke="hsl(42 70% 55%)" fill="url(#followerGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <AIInsightPanel
          title="Analytics AI Director"
          insights={[
            { title: 'Instagram Reels outperform all formats', description: 'Reels are driving 4x more reach than static posts. Increase reel frequency.', category: 'growth', priority: 'high' },
            { title: 'Tuesday posts underperform', description: 'Consider shifting Tuesday content to Wednesday or Thursday.', category: 'warning', priority: 'medium' },
            { title: 'Engagement rate above industry avg', description: 'Your 4.2% engagement rate beats the 3.1% industry average. Keep it up.', category: 'success', priority: 'medium' },
            { title: 'Share rate dropping on Facebook', description: 'Facebook shares declined 15% this month. Try more shareable content formats.', category: 'warning', priority: 'high' },
          ]}
        />
      </div>
    </div>
  );
}