import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CampaignTimeline({ campaign, posts = [] }) {
  const startDate = new Date(campaign.start_date);
  const endDate = new Date(campaign.end_date);
  const daysTotal = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const days = Array.from({ length: Math.min(daysTotal, 60) }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const postsOnDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return posts.filter(p => p.scheduled_date?.startsWith(dateStr));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="w-4 h-4 text-primary" />
        <span>Campaign rollout over {daysTotal} days</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          const datePosts = postsOnDate(date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={cn(
                'p-2 rounded-lg border text-center transition-all',
                isToday && 'ring-2 ring-primary',
                datePosts.length > 0
                  ? 'bg-primary/20 border-primary/30'
                  : 'bg-secondary/30 border-border/20'
              )}
            >
              <p className="text-xs font-medium text-foreground">{date.getDate()}</p>
              <p className="text-[10px] text-muted-foreground">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
              {datePosts.length > 0 && (
                <p className="text-xs font-semibold text-primary mt-1">{datePosts.length} post{datePosts.length > 1 ? 's' : ''}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {daysTotal > 60 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200">
          <AlertCircle className="w-4 h-4" />
          Campaign extends beyond preview window. Showing first 60 days.
        </div>
      )}
    </div>
  );
}