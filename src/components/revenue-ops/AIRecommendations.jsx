import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIRecommendations({ scope, total }) {
  const recommendations = [];

  const totalPosts = Object.keys(scope)
    .filter(key => ['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'reels', 'stories', 'carousels'].includes(key))
    .reduce((sum, key) => sum + (scope[key] || 0), 0);

  if (totalPosts < 8) {
    recommendations.push({
      type: 'warning',
      title: 'Low Content Volume',
      description: 'Consider adding more posts for better campaign impact',
      icon: AlertCircle,
    });
  }

  if (totalPosts > 30) {
    recommendations.push({
      type: 'success',
      title: 'High Engagement Potential',
      description: 'Excellent content cadence for sustained reach',
      icon: CheckCircle2,
    });
  }

  if (!scope.reporting) {
    recommendations.push({
      type: 'warning',
      title: 'Add Analytics Reporting',
      description: 'Clients expect performance metrics. Add reporting for $300',
      icon: AlertCircle,
    });
  }

  if (total < 3000) {
    recommendations.push({
      type: 'warning',
      title: 'Underpriced Scope',
      description: 'Consider reviewing pricing or expanding deliverables',
      icon: AlertCircle,
    });
  }

  if (!scope.strategy_fee) {
    recommendations.push({
      type: 'info',
      title: 'Strategy Planning Recommended',
      description: 'Add strategy fee ($500) for premium positioning',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">AI Insights</h3>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon || Sparkles;
          const color = rec.type === 'warning' ? 'amber' : rec.type === 'success' ? 'emerald' : 'sky';
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'p-3 rounded-lg border text-sm',
                color === 'amber' && 'bg-amber-500/10 border-amber-500/30',
                color === 'emerald' && 'bg-emerald-500/10 border-emerald-500/30',
                color === 'sky' && 'bg-sky-500/10 border-sky-500/30'
              )}
            >
              <div className="flex gap-2">
                <Icon className={cn(
                  'w-4 h-4 flex-shrink-0 mt-0.5',
                  color === 'amber' && 'text-amber-400',
                  color === 'emerald' && 'text-emerald-400',
                  color === 'sky' && 'text-sky-400'
                )} />
                <div>
                  <p className={cn(
                    'font-medium',
                    color === 'amber' && 'text-amber-400',
                    color === 'emerald' && 'text-emerald-400',
                    color === 'sky' && 'text-sky-400'
                  )}>
                    {rec.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}