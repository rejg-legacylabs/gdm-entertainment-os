import React from 'react';
import { cn } from '@/lib/utils';

const brandColors = {
  'GDM Entertainment': { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
  'Headquarters of Hope Foundation': { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  'RE Jones Global': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Legacy Transitional Housing': { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Jobs App': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-400' },
};

export default function BrandBadge({ name, size = 'sm' }) {
  const colors = brandColors[name] || { bg: 'bg-primary/20', text: 'text-primary', dot: 'bg-primary' };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      colors.bg, colors.text,
      size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {name}
    </span>
  );
}