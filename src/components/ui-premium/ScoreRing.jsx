import React from 'react';
import { cn } from '@/lib/utils';

export default function ScoreRing({ score, size = 80, label, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-primary' : score >= 40 ? 'text-amber-400' : 'text-red-400';
  const strokeColor = score >= 80 ? 'stroke-emerald-400' : score >= 60 ? 'stroke-primary' : score >= 40 ? 'stroke-amber-400' : 'stroke-red-400';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(220 12% 16%)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-lg font-bold', color)}>{score}</span>
        </div>
      </div>
      {label && <span className="text-xs text-muted-foreground text-center">{label}</span>}
    </div>
  );
}