import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Megaphone, Calendar, TrendingUp, Inbox, Sparkles, Zap, AlertCircle, BarChart3
} from 'lucide-react';
import InteractiveMetricCard from '@/components/command-center/InteractiveMetricCard';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import BrandOverviewRow from '@/components/command-center/BrandOverviewRow';
import TopPerformingPosts from '@/components/command-center/TopPerformingPosts';
import EngagementChart from '@/components/command-center/EngagementChart';
import PremiumWelcome from '@/components/ui-premium/PremiumWelcome';
import DrillDownPanel from '@/components/command-center/DrillDownPanel';
import RecommendationCard from '@/components/command-center/RecommendationCard';
import CampaignPreviewModal from '@/components/campaign/CampaignPreviewModal';

const aiInsights = [
  { title: 'GDM Entertainment needs 3 more posts this week', description: 'The posting cadence for GDM is below target. Schedule 3 Instagram reels to maintain momentum.', category: 'content', priority: 'high' },
  { title: 'HQ of Hope donor campaign is underperforming', description: 'The Spring Giving campaign has 40% lower engagement than expected. Consider adding testimonial content.', category: 'warning', priority: 'critical' },
  { title: 'RE Jones LinkedIn content is gaining traction', description: 'Community impact posts are getting 3x more shares. Double down on this content format.', category: 'growth', priority: 'medium' },
  { title: 'Jobs App has 12 unanswered inquiries', description: 'Respond to candidate questions within 4 hours to maintain conversion rates.', category: 'campaign', priority: 'high' },
  { title: 'Best posting window: Tuesday 6-8 PM', description: 'Cross-brand analysis shows highest engagement on Tuesday evenings. Schedule key content there.', category: 'strategy', priority: 'medium' },
];

export default function CommandCenter() {
  const [showWelcome, setShowWelcome] = React.useState(localStorage.getItem('gdmWelcomeSeen') ? false : true);
  const [drillDownState, setDrillDownState] = useState({ type: null, isOpen: false });
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCampaignPreview, setShowCampaignPreview] = useState(false);

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

  const activeCampaignsData = campaigns.filter(c => c.status === 'active');
  const activeCampaigns = activeCampaignsData.length;
  const scheduledPostsData = posts.filter(p => p.status === 'scheduled');
  const scheduledPosts = scheduledPostsData.length;
  const totalEngagement = posts.reduce((sum, p) => sum + (p.engagement || 0), 0);
  const pendingInboxData = inboxItems.filter(i => i.status === 'new');
  const pendingInbox = pendingInboxData.length;

  const handleWelcomeDismiss = () => {
    setShowWelcome(false);
    localStorage.setItem('gdmWelcomeSeen', 'true');
  };

  const openDrillDown = (type, data = null) => {
    setDrillDownState({ type, data, isOpen: true });
  };

  const closeDrillDown = () => {
    setDrillDownState({ type: null, isOpen: false });
  };

  return (
    <>
      {showWelcome && <PremiumWelcome onDismiss={handleWelcomeDismiss} />}
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

      {/* Interactive Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InteractiveMetricCard
          title="Active Campaigns"
          value={activeCampaigns}
          icon={Megaphone}
          trend={12}
          onClick={() => openDrillDown('campaigns', { filter: 'active' })}
          actionText="View All"
        />
        <InteractiveMetricCard
          title="Scheduled Posts"
          value={scheduledPosts}
          icon={Calendar}
          trend={8}
          onClick={() => openDrillDown('posts', { filter: 'scheduled' })}
          actionText="View All"
        />
        <InteractiveMetricCard
          title="Total Engagement"
          value={totalEngagement.toLocaleString()}
          icon={TrendingUp}
          trend={23}
          onClick={() => openDrillDown('analytics', { metric: 'engagement' })}
          actionText="View Analytics"
        />
        <InteractiveMetricCard
          title="Pending Inbox"
          value={pendingInbox}
          icon={Inbox}
          trend={-5}
          onClick={() => openDrillDown('inbox', { filter: 'new' })}
          actionText="View Inbox"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* AI Insights - Interactive */}
        <div className="lg:col-span-1">
          <AIInsightPanel
            title="AI Director Recommendations"
            insights={aiInsights}
            onAction={(insight) => {
              if (insight.category === 'campaign') {
                openDrillDown('campaigns');
              } else if (insight.category === 'content') {
                openDrillDown('posts');
              } else {
                openDrillDown('recommendations', { insight });
              }
            }}
          />
        </div>

        {/* Chart - takes 2 cols */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Engagement Overview
            </h3>
            <EngagementChart onDrillDown={(data) => openDrillDown('analytics', data)} />
          </motion.div>
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
      <TopPerformingPosts
        posts={posts}
        onPostClick={(post) => openDrillDown('postDetail', { post })}
      />

      {/* Drill-Down Panels */}
      <DrillDownPanel
        isOpen={drillDownState.isOpen && drillDownState.type === 'campaigns'}
        onClose={closeDrillDown}
        title="Active Campaigns"
        subtitle={`${activeCampaigns} campaigns running`}
        icon={Megaphone}
        items={activeCampaignsData.map(c => ({
          id: c.id,
          title: c.name,
          description: c.objective,
          metadata: [c.type, c.platforms?.length ? `${c.platforms.length} platforms` : 'No platforms'],
          value: c.total_posts,
          onClick: () => {
            setSelectedCampaign(c);
            setShowCampaignPreview(true);
            closeDrillDown();
          },
        }))}
      />

      <DrillDownPanel
        isOpen={drillDownState.isOpen && drillDownState.type === 'posts'}
        onClose={closeDrillDown}
        title="Scheduled Posts"
        subtitle={`${scheduledPosts} posts queued`}
        icon={Calendar}
        items={scheduledPostsData.map(p => ({
          id: p.id,
          title: p.caption?.substring(0, 60) + '...',
          description: `${p.platform} • ${p.content_type}`,
          metadata: p.scheduled_date,
          value: p.engagement ? p.engagement : '0',
        }))}
      />

      <DrillDownPanel
        isOpen={drillDownState.isOpen && drillDownState.type === 'inbox'}
        onClose={closeDrillDown}
        title="Pending Inbox"
        subtitle={`${pendingInbox} items need attention`}
        icon={Inbox}
        items={pendingInboxData.map(item => ({
          id: item.id,
          title: item.author_name,
          description: item.message?.substring(0, 80) + '...',
          metadata: [item.platform, item.type, item.sentiment],
          value: item.sentiment === 'urgent' ? '⚠️' : item.sentiment === 'positive' ? '👍' : '💬',
        }))}
      />

      <DrillDownPanel
        isOpen={drillDownState.isOpen && drillDownState.type === 'analytics'}
        onClose={closeDrillDown}
        title="Analytics Breakdown"
        subtitle="Detailed performance metrics"
        icon={BarChart3}
        tabs={[
          {
            id: 'platforms',
            label: 'By Platform',
            render: () => (
              <div className="space-y-2">
                {['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Twitter'].map(platform => (
                  <div key={platform} className="p-3 rounded-lg bg-secondary/30 border border-border/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{platform}</span>
                      <span className="text-lg font-bold text-primary">{Math.floor(Math.random() * 50000)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Engagement this week</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            id: 'campaigns',
            label: 'By Campaign',
            render: () => (
              <div className="space-y-2">
                {activeCampaignsData.slice(0, 3).map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-secondary/30 border border-border/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                      <span className="text-lg font-bold text-primary">{c.total_engagement || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{c.total_posts} posts</p>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />

      {/* Campaign Preview Modal */}
      {selectedCampaign && (
        <CampaignPreviewModal
          campaign={selectedCampaign}
          posts={posts.filter(p => p.campaign_name === selectedCampaign.name)}
          isOpen={showCampaignPreview}
          onClose={() => setShowCampaignPreview(false)}
        />
      )}
      </div>
    </>
  );
}