import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Megaphone, PenTool, BarChart3, Sparkles, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import MetricCard from '@/components/ui-premium/MetricCard';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';
import ScoreRing from '@/components/ui-premium/ScoreRing';
import StatusBadge from '@/components/ui-premium/StatusBadge';
import SectionHeader from '@/components/ui-premium/SectionHeader';

export default function BrandWorkspace() {
  const urlParams = new URLSearchParams(window.location.search);
  const brandName = decodeURIComponent(window.location.pathname.split('/brands/')[1] || '');

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });
  const brand = brands.find(b => b.name === brandName);

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns', brandName],
    queryFn: () => base44.entities.Campaign.filter({ brand_name: brandName }),
    enabled: !!brandName,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts', brandName],
    queryFn: () => base44.entities.Post.filter({ brand_name: brandName }),
    enabled: !!brandName,
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recs', brandName],
    queryFn: () => base44.entities.AIRecommendation.filter({ brand_name: brandName }),
    enabled: !!brandName,
  });

  if (!brand) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
  const publishedPosts = posts.filter(p => p.status === 'published');
  const totalEngagement = publishedPosts.reduce((sum, p) => sum + (p.engagement || 0), 0);
  const totalReach = publishedPosts.reduce((sum, p) => sum + (p.reach || 0), 0);

  const healthScore = brandName === 'GDM Entertainment' ? 87 :
    brandName === 'Headquarters of Hope Foundation' ? 74 :
    brandName === 'RE Jones Global' ? 68 : 
    brandName === 'Legacy Transitional Housing' ? 71 : 79;

  const aiInsights = recommendations.length > 0
    ? recommendations.map(r => ({ title: r.title, description: r.description, category: r.category, priority: r.priority }))
    : [
      { title: `Optimize ${brandName} posting schedule`, description: 'Analysis shows gaps in your weekly content calendar. Fill Tuesday and Thursday slots.', category: 'content', priority: 'high' },
      { title: 'Boost engagement with video content', description: 'Video posts are outperforming static content by 3.2x for this brand.', category: 'growth', priority: 'medium' },
      { title: 'Review underperforming campaign', description: 'One active campaign has below-average metrics. Consider refreshing creative.', category: 'warning', priority: 'high' },
    ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <Link to="/brands" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Brands
      </Link>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: `${brand.color_accent}22`, color: brand.color_accent }}>
            {brand.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">{brand.name}</h1>
            <p className="text-sm text-muted-foreground">{brand.tone}</p>
          </div>
          <div className="ml-auto hidden md:block">
            <ScoreRing score={healthScore} size={70} strokeWidth={5} label="Health" />
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Active Campaigns" value={activeCampaigns.length} change={15} icon={Megaphone} index={0} />
        <MetricCard title="Scheduled Posts" value={scheduledPosts} change={8} icon={Calendar} index={1} />
        <MetricCard title="Total Engagement" value={totalEngagement.toLocaleString()} change={23} icon={TrendingUp} index={2} />
        <MetricCard title="Total Reach" value={totalReach.toLocaleString()} change={18} icon={BarChart3} index={3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <AIInsightPanel title={`AI Insights for ${brand.name}`} insights={aiInsights} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Active Campaigns */}
          <div>
            <SectionHeader title="Active Campaigns" />
            <div className="space-y-3">
              {activeCampaigns.slice(0, 4).map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-lg p-4 flex items-center justify-between card-hover"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{campaign.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{(campaign.type || '').replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-foreground">{(campaign.total_engagement || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Engagement</p>
                    </div>
                    <ScoreRing score={campaign.health_score || 70} size={40} strokeWidth={3} />
                  </div>
                </motion.div>
              ))}
              {activeCampaigns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No active campaigns</p>
              )}
            </div>
          </div>

          {/* Recent Content */}
          <div>
            <SectionHeader title="Recent Content" />
            <div className="space-y-2">
              {posts.slice(0, 5).map((post, i) => (
                <div key={post.id} className="glass-panel rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">{post.platform}</span>
                  <p className="text-sm text-foreground truncate flex-1">{post.caption}</p>
                  <StatusBadge status={post.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Content Pillars</h3>
          <div className="flex flex-wrap gap-2">
            {(brand.content_pillars || []).map((p, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">{p}</span>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Approved Hashtags</h3>
          <div className="flex flex-wrap gap-2">
            {(brand.approved_hashtags || []).map((h, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">{h}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}