import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, Eye } from 'lucide-react';
import BrandBadge from '@/components/ui-premium/BrandBadge';
import SectionHeader from '@/components/ui-premium/SectionHeader';

export default function TopPerformingPosts({ posts }) {
  const topPosts = [...posts]
    .filter(p => p.status === 'published')
    .sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
    .slice(0, 5);

  return (
    <div>
      <SectionHeader title="Top Performing Content" subtitle="Highest engagement posts" />
      <div className="space-y-3">
        {topPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel rounded-lg p-4 card-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <BrandBadge name={post.brand_name} />
                  <span className="text-xs text-muted-foreground capitalize">{post.platform}</span>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{post.caption}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-primary">{(post.engagement || 0).toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Engagement</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" /> {(post.impressions || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="w-3 h-3" /> {(post.reach || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" /> {(post.comments_count || 0)}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Share2 className="w-3 h-3" /> {(post.shares || 0)}
              </span>
            </div>
          </motion.div>
        ))}
        {topPosts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No published posts yet</p>
        )}
      </div>
    </div>
  );
}