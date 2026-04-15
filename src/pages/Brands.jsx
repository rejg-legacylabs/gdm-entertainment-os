import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Sparkles, Users, Megaphone, PenTool, Zap, BookOpen } from 'lucide-react';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import ScoreRing from '@/components/ui-premium/ScoreRing';
import BrandActionCard from '@/components/brands/BrandActionCard';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';

const healthScores = {
  'GDM Entertainment': 87,
  'Headquarters of Hope Foundation': 74,
  'RE Jones Global': 68,
  'Legacy Transitional Housing': 71,
  'Jobs App': 79,
};

export default function Brands() {
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const brandActions = [
    { icon: Zap, title: 'Create Campaign', description: 'Launch an AI-powered campaign', action: '/campaigns' },
    { icon: PenTool, title: 'Generate Content', description: 'Create posts with AI assistance', action: '/content-studio' },
    { icon: BookOpen, title: 'View Analytics', description: 'Track performance & insights', action: '/analytics' },
  ];

  const aiInsights = [
    { title: 'GDM Entertainment trending up', description: 'Engagement increased 24% this week. Keep momentum with weekly campaigns.', category: 'content', priority: 'high' },
    { title: 'HQ of Hope needs donor focus', description: 'Fundraising posts underperform. Consider storytelling + CTA campaigns.', category: 'strategy', priority: 'medium' },
    { title: 'New brand onboarding', description: 'All 5 brands are connected. Ready to scale campaigns across portfolio.', category: 'success', priority: 'low' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Brand Portfolio</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Your Brands</h1>
        <p className="text-muted-foreground mt-1">Manage all {brands.length} brand workspaces from one place</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {brands.map((brand, i) => {
          const brandCampaigns = campaigns.filter(c => c.brand_name === brand.name && c.status === 'active');
          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/brands/${encodeURIComponent(brand.name)}`}>
                <div className="glass-panel rounded-xl p-6 card-hover group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: `${brand.color_accent}22`, color: brand.color_accent }}>
                      {brand.name[0]}
                    </div>
                    <ScoreRing score={healthScores[brand.name] || 70} size={50} strokeWidth={4} />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{brand.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{brand.mission}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>{brandCampaigns.length} active</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PenTool className="w-3.5 h-3.5" />
                      <span>{(brand.content_pillars || []).length} pillars</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(brand.connected_channels || []).slice(0, 4).map(ch => (
                      <span key={ch} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">{ch}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-xs text-primary font-medium">View Workspace</span>
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
          </div>
        </div>

        {/* Sidebar: Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-3">
              {brandActions.map((action, idx) => (
                <BrandActionCard
                  key={idx}
                  index={idx}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  action={action.action}
                />
              ))}
            </div>
          </div>

          <AIInsightPanel
            title="Brand AI Director"
            insights={aiInsights}
            compact={false}
          />
        </div>
      </div>
    </div>
  );
}