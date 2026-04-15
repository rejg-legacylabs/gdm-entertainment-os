import React from 'react';
import { cn } from '@/lib/utils';

const statusStyles = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  draft: 'bg-muted text-muted-foreground border-border',
  paused: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  scheduled: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  idea: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  ready_for_review: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  approved: 'bg-primary/15 text-primary border-primary/20',
  revise: 'bg-red-500/15 text-red-400 border-red-500/20',
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  read: 'bg-muted text-muted-foreground border-border',
  replied: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  flagged: 'bg-red-500/15 text-red-400 border-red-500/20',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  critical: 'bg-red-500/15 text-red-400 border-red-500/20',
  high: 'bg-primary/15 text-primary border-primary/20',
  medium: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export default function StatusBadge({ status }) {
  const label = (status || '').replace(/_/g, ' ');
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
      statusStyles[status] || statusStyles.draft
    )}>
      {label}
    </span>
  );
}