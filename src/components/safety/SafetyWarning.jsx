import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const severityConfig = {
  low: { icon: AlertCircle, color: 'bg-blue-500/10 border-blue-500/30 text-blue-400', bgColor: 'bg-blue-500/5' },
  medium: { icon: AlertTriangle, color: 'bg-amber-500/10 border-amber-500/30 text-amber-400', bgColor: 'bg-amber-500/5' },
  high: { icon: AlertTriangle, color: 'bg-red-500/10 border-red-500/30 text-red-400', bgColor: 'bg-red-500/5' },
  critical: { icon: XCircle, color: 'bg-red-600/10 border-red-600/30 text-red-500', bgColor: 'bg-red-600/5' },
  success: { icon: CheckCircle2, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', bgColor: 'bg-emerald-500/5' },
};

export default function SafetyWarning({ severity = 'medium', title, message, details = [], actionLabel, onAction, dismissible = true }) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const config = severityConfig[severity] || severityConfig.medium;
  const Icon = config.icon;
  const isBlocking = severity === 'critical' || severity === 'high';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-lg border p-4 ${config.color} ${config.bgColor}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`} />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            {dismissible && !isBlocking && (
              <button
                onClick={() => setDismissed(true)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{message}</p>
          
          {details.length > 0 && (
            <ul className="text-xs text-muted-foreground space-y-1 mb-3">
              {details.map((detail, idx) => (
                <li key={idx}>• {detail}</li>
              ))}
            </ul>
          )}

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}