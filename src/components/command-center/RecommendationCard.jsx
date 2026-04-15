import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, AlertCircle, Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const priorityConfig = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: AlertCircle },
  high: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: TrendingUp },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: Lightbulb },
  low: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: Target },
};

const categoryIcons = {
  content: Lightbulb,
  campaign: Target,
  growth: TrendingUp,
  strategy: Zap,
};

export default function RecommendationCard({
  title,
  description,
  category = 'content',
  priority = 'medium',
  actionText = 'View',
  onClick,
  index = 0,
}) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  const CategoryIcon = categoryIcons[category] || Lightbulb;
  const Icon = config.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl p-4 border transition-all',
        config.bg,
        config.border,
        'group hover:shadow-lg'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', config.text)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn('font-semibold text-sm', config.text)}>{title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
            </div>
            <ChevronRight className={cn('w-4 h-4 flex-shrink-0 transition-transform', config.text, 'group-hover:translate-x-0.5')} />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <CategoryIcon className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground capitalize">{category}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className={cn('text-xs font-medium capitalize', config.text)}>{priority}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}