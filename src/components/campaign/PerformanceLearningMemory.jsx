import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function PerformanceLearningMemory({ clientId }) {
  const [selectedPlatform, setSelectedPlatform] = useState('cross_platform');

  const { data: learnings = [] } = useQuery({
    queryKey: ['contentLearning', clientId],
    queryFn: () => base44.entities.ContentLearning.filter({ client_id: clientId }),
  });

  const categoryGroups = {};
  learnings.forEach(learning => {
    if (!categoryGroups[learning.learning_category]) {
      categoryGroups[learning.learning_category] = [];
    }
    categoryGroups[learning.learning_category].push(learning);
  });

  const categoryLabels = {
    hook_performance: '🎣 Hook Performance',
    cta_performance: '🔗 CTA Performance',
    post_type_performance: '📝 Post Type Performance',
    creative_format_performance: '🎨 Creative Format',
    timing_performance: '⏰ Timing Performance',
    content_pillar_performance: '📊 Content Pillar',
    platform_preference: '📱 Platform Preference',
    audience_sentiment: '💬 Audience Sentiment',
  };

  const categoryColors = {
    hook_performance: 'bg-blue-500/10 border-blue-500/30',
    cta_performance: 'bg-emerald-500/10 border-emerald-500/30',
    post_type_performance: 'bg-purple-500/10 border-purple-500/30',
    creative_format_performance: 'bg-pink-500/10 border-pink-500/30',
    timing_performance: 'bg-cyan-500/10 border-cyan-500/30',
    content_pillar_performance: 'bg-amber-500/10 border-amber-500/30',
    platform_preference: 'bg-lime-500/10 border-lime-500/30',
    audience_sentiment: 'bg-rose-500/10 border-rose-500/30',
  };

  const confidenceConfig = {
    high: 'bg-emerald-500/20 text-emerald-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-gray-500/20 text-gray-400',
  };

  if (learnings.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center border border-border/50">
        <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Learning engine is building patterns...</p>
        <p className="text-xs text-muted-foreground mt-2">More data = better recommendations</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Learning Overview */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Patterns Learned', count: learnings.length, icon: Brain },
          { label: 'High Confidence', count: learnings.filter(l => l.confidence_level === 'high').length, icon: TrendingUp },
          { label: 'Data Points', count: learnings.reduce((sum, l) => sum + (l.sample_count || 0), 0), icon: BarChart3 },
          { label: 'Avg Performance', count: `${(learnings.reduce((sum, l) => sum + l.performance_score, 0) / learnings.length).toFixed(0)}%`, icon: Zap },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-lg p-4 border border-border/50"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.count}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Learning Categories */}
      <div className="space-y-4">
        {Object.entries(categoryGroups).map(([category, items], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.1 }}
            className={`glass-panel rounded-xl p-6 border ${categoryColors[category]}`}
          >
            <h3 className="font-semibold text-foreground mb-4">{categoryLabels[category]}</h3>
            <div className="space-y-3">
              {items.map((learning, idx) => (
                <motion.div
                  key={learning.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-lg bg-secondary/30 border border-border/30"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{learning.dimension}</p>
                      <p className="text-xs text-muted-foreground mt-1">{learning.recommendation_text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold text-primary">{learning.performance_score.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">score</p>
                      </div>
                      <Badge className={confidenceConfig[learning.confidence_level]}>
                        {learning.confidence_level}
                      </Badge>
                    </div>
                  </div>

                  {learning.sample_count && (
                    <p className="text-xs text-muted-foreground">Based on {learning.sample_count} posts</p>
                  )}

                  {learning.trend && (
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <Badge className={`text-xs ${
                        learning.trend === 'improving' ? 'bg-emerald-500/20 text-emerald-400' :
                        learning.trend === 'stable' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {learning.trend} trend
                      </Badge>
                    </div>
                  )}

                  {learning.best_practices && learning.best_practices.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <p className="text-xs font-medium text-foreground mb-1">Best practices:</p>
                      <div className="flex flex-wrap gap-1">
                        {learning.best_practices.slice(0, 3).map((practice, pIdx) => (
                          <Badge key={pIdx} variant="outline" className="text-xs">
                            {practice}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}