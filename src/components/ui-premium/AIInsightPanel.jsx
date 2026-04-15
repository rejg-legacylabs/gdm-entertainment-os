import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categoryIcons = {
  content: Lightbulb,
  campaign: Target,
  growth: TrendingUp,
  warning: AlertTriangle,
  success: CheckCircle2,
  strategy: Sparkles,
};

export default function AIInsightPanel({ title = "AI Director", insights = [], loading = false, onAction, compact = false }) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{insights.length} recommendations</p>
          </div>
        </div>
        <ChevronRight className={cn(
          'w-4 h-4 text-muted-foreground transition-transform',
          expanded && 'rotate-90'
        )} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">AI analyzing...</span>
                </div>
              ) : (
                insights.map((insight, i) => {
                  const CategoryIcon = categoryIcons[insight.category] || Sparkles;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                    >
                      <CategoryIcon className={cn(
                        'w-4 h-4 mt-0.5 flex-shrink-0',
                        insight.priority === 'critical' ? 'text-red-400' :
                        insight.priority === 'high' ? 'text-primary' :
                        'text-muted-foreground'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{insight.description}</p>
                      </div>
                      {onAction && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 text-primary text-xs h-7"
                          onClick={() => onAction(insight)}
                        >
                          Act
                        </Button>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}