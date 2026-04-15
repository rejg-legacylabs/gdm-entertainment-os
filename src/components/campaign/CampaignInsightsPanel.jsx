import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, AlertCircle, Target, Clock, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CampaignInsightsPanel({ campaignId, clientId }) {
  const [activeTab, setActiveTab] = useState('what_worked');

  const { data: insights, isLoading } = useQuery({
    queryKey: ['campaignInsights', campaignId],
    queryFn: async () => {
      const result = await base44.entities.CampaignInsights.filter({ campaign_id: campaignId });
      return result[0];
    },
  });

  if (isLoading || !insights) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-border/50">
        <p className="text-muted-foreground text-sm">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="glass-panel rounded-xl p-6 border border-border/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Campaign Health</h3>
            <p className="text-xs text-muted-foreground mt-1">Based on {insights.posts_analyzed} posts</p>
          </div>
          <div className="text-3xl font-bold text-primary">{insights.overall_health_score}/100</div>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${insights.overall_health_score}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/30">
        {[
          { id: 'what_worked', label: '✓ What Worked', icon: TrendingUp },
          { id: 'next', label: '→ What to Try', icon: Lightbulb },
          { id: 'performance', label: '📊 Performance', icon: Target },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* What Worked */}
      {activeTab === 'what_worked' && (
        <div className="space-y-3">
          {insights.what_worked && insights.what_worked.length > 0 ? (
            insights.what_worked.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-lg p-4 border border-emerald-500/30 bg-emerald-500/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-400 text-sm">{item.element}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    {item.post_count && (
                      <p className="text-xs text-muted-foreground mt-1">Tested in {item.post_count} posts</p>
                    )}
                  </div>
                  {item.performance_lift && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 whitespace-nowrap">
                      +{item.performance_lift}%
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No performance data yet</p>
          )}
        </div>
      )}

      {/* What to Try Next */}
      {activeTab === 'next' && (
        <div className="space-y-3">
          {insights.what_to_try_next && insights.what_to_try_next.length > 0 ? (
            insights.what_to_try_next.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-lg p-4 border border-primary/30 bg-primary/5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-primary text-sm">{item.recommendation}</h4>
                  <Badge className={`whitespace-nowrap ${
                    item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.rationale}</p>
                {item.expected_lift && (
                  <p className="text-xs text-primary mt-2">Expected lift: +{item.expected_lift}%</p>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recommendations yet</p>
          )}
        </div>
      )}

      {/* Performance Details */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          {/* Platform Performance */}
          {insights.platform_performance_rank && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Platform Performance</h4>
              <div className="space-y-2">
                {Object.entries(insights.platform_performance_rank).map(([platform, rate]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">{platform}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-secondary/30 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${Math.min(rate * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground min-w-[40px]">{(rate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Posting Window */}
          {insights.optimal_posting_window && (
            <div className="glass-panel rounded-lg p-3 border border-border/30 bg-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground text-sm">Optimal Posting Window</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>{insights.optimal_posting_window.best_day}</strong> at <strong>{insights.optimal_posting_window.best_hour}:00</strong>
              </p>
            </div>
          )}

          {/* Audience Sentiment */}
          {insights.audience_sentiment_trend && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Audience Sentiment</h4>
              <Badge className={`${
                insights.audience_sentiment_trend === 'increasingly_positive' ? 'bg-emerald-500/20 text-emerald-400' :
                insights.audience_sentiment_trend === 'stable_positive' ? 'bg-blue-500/20 text-blue-400' :
                insights.audience_sentiment_trend === 'mixed' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {insights.audience_sentiment_trend}
              </Badge>
            </div>
          )}

          {/* Weak Themes */}
          {insights.weak_themes && insights.weak_themes.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Avoid These Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {insights.weak_themes.map((theme, idx) => (
                  <Badge key={idx} className="bg-red-500/20 text-red-400">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}