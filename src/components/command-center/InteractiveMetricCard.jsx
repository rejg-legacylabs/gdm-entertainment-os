import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InteractiveMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  subtext,
  onClick,
  loading = false,
  actionText = 'View',
}) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="w-full text-left group rounded-xl glass-panel p-6 border-border/50 overflow-hidden relative"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
        </div>

        {/* Value */}
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">{loading ? '...' : value}</p>
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  {trend > 0 ? '+' : ''}{trend}% this week
                </span>
              </>
            ) : isNegative ? (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-medium text-red-400">
                  {trend}% this week
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </motion.button>
  );
}