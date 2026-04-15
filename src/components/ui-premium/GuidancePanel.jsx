import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function GuidancePanel({ 
  title = "Smart Guidance",
  items = [],
  onAction,
  compact = false,
  variant = 'default'
}) {
  const [expanded, setExpanded] = React.useState(!compact);

  const variants = {
    default: 'border-primary/20 bg-primary/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    success: 'border-green-500/20 bg-green-500/5',
  };

  const iconMap = {
    tip: Lightbulb,
    warning: AlertTriangle,
    success: CheckCircle2,
    ai: Sparkles,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border overflow-hidden',
        variants[variant]
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-black/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground">({items.length})</span>
        </div>
        <ChevronRight className={cn(
          'w-4 h-4 text-muted-foreground transition-transform',
          expanded && 'rotate-90'
        )} />
      </button>

      <AnimatePresence>
        {expanded && items.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-current border-opacity-20"
          >
            <div className="p-3 space-y-2">
              {items.map((item, i) => {
                const Icon = iconMap[item.type] || Lightbulb;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-black/20 group hover:bg-black/30 transition-colors"
                  >
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    {onAction && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 text-primary text-xs h-6"
                        onClick={() => onAction(item)}
                      >
                        Act
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}