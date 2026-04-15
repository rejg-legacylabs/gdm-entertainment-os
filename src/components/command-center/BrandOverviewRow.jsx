import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandBadge from '@/components/ui-premium/BrandBadge';
import ScoreRing from '@/components/ui-premium/ScoreRing';

export default function BrandOverviewRow({ brand, campaigns = [], posts = [], index = 0 }) {
  const brandCampaigns = campaigns.filter(c => c.brand_name === brand.name);
  const brandPosts = posts.filter(p => p.brand_name === brand.name);
  const activeCampaigns = brandCampaigns.filter(c => c.status === 'active').length;
  const scheduledPosts = brandPosts.filter(p => p.status === 'scheduled').length;
  const totalEngagement = brandPosts.reduce((sum, p) => sum + (p.engagement || 0), 0);
  const healthScore = brand.name === 'GDM Entertainment' ? 87 :
    brand.name === 'Headquarters of Hope Foundation' ? 74 :
    brand.name === 'RE Jones Global' ? 68 :
    brand.name === 'Legacy Transitional Housing' ? 71 : 79;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/brands/${encodeURIComponent(brand.name)}`}>
        <div className="glass-panel rounded-xl p-5 card-hover flex items-center gap-6 group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: `${brand.color_accent}22`, color: brand.color_accent }}>
            {brand.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{brand.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{brand.mission}</p>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{activeCampaigns}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Campaigns</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{scheduledPosts}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Scheduled</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{totalEngagement.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Engagement</p>
            </div>
            <ScoreRing score={healthScore} size={50} strokeWidth={4} />
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}