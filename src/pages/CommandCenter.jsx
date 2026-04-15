import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Megaphone, Calendar, TrendingUp, Users, Inbox, Eye, Sparkles, Zap
} from 'lucide-react';
import MetricCard from '@/components/ui-premium/MetricCard';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import BrandOverviewRow from '@/components/command-center/BrandOverviewRow';
import TopPerformingPosts from '@/components/command-center/TopPerformingPosts';
import EngagementChart from '@/components/command-center/EngagementChart';

const aiInsights = [
  { title: 'GDM Entertainment needs 3 more posts this week', description: 'The posting cadence for GDM is below target. Schedule 3 Instagram reels to maintain momentum.', category: 'content', priority: 'high' },
  { title: 'HQ of Hope donor campaign is underperforming', description: 'The Spring Giving campaign has 40% lower engagement than expected. Consider adding testimonial content.', category: 'warning', priority: 'critical' },
  { title: 'RE Jones LinkedIn content is gaining traction', description: 'Community impact posts are getting 3x more shares. Double down on this content format.', category: 'growth', priority: 'medium' },
  { title: 'Jobs App has 12 unanswered inquiries', description: 'Respond to candidate questions within 4 hours to maintain conversion rates.', category: 'campaign', priority: 'high' },
  { title: 'Best posting window: Tuesday 6-8 PM', description: 'Cross-brand analysis shows highest engagement on Tuesday evenings. Schedule key content there.', category: 'strategy', priority: 'medium' },
];

export default function CommandCenter() {
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list(),
  });

  const { data: inboxItems = [] } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => base44.entities.InboxItem.list(),
  });

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
  const totalEngagement = posts.reduce((sum, p) => sum + (p.engagement || 0), 0);
  const pendingInbox = inboxItems.filter(i => i.status === 'new').length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">AI-Directed Command Center</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Mission Control</h1>
        <p className="text-muted-foreground mt-1">Your multi-brand social media operating system</p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Active Campaigns" value={activeCampaigns} change={12} changeLabel="vs last week" icon={Megaphone} index={0} />
        <MetricCard title="Scheduled Posts" value={scheduledPosts} change={8} changeLabel="vs last week" icon={Calendar} index={1} />
        <MetricCard title="Total Engagement" value={totalEngagement.toLocaleString()} change={23} changeLabel="vs last week" icon={TrendingUp} index={2} />
        <MetricCard title="Pending Inbox" value={pendingInbox} change={-5} changeLabel="vs yesterday" icon={Inbox} index={3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* AI Insights - takes 1 col */}
        <div className="lg:col-span-1">
          <AIInsightPanel
            title="AI Director Recommendations"
            insights={aiInsights}
          />
        </div>

        {/* Chart - takes 2 cols */}
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>
      </div>

      {/* Brand Overview */}
      <div className="mb-8">
        <SectionHeader title="Brand Portfolio" subtitle="All brands at a glance" />
        <div className="space-y-3">
          {brands.map((brand, i) => (
            <BrandOverviewRow
              key={brand.id}
              brand={brand}
              campaigns={campaigns}
              posts={posts}
              index={i}
            />
          ))}
          {brands.length === 0 && (
            <div className="glass-panel rounded-xl p-12 text-center">
              <p className="text-muted-foreground">Loading brands...</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Content */}
      <TopPerformingPosts posts={posts} />
    </div>
  );
}