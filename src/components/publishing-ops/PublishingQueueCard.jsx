import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2, RotateCcw, Eye, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  draft: { icon: Clock, color: 'bg-slate-500/20 text-slate-400', label: 'Draft' },
  approved: { icon: CheckCircle2, color: 'bg-emerald-500/20 text-emerald-400', label: 'Approved' },
  queued: { icon: Clock, color: 'bg-blue-500/20 text-blue-400', label: 'Queued' },
  publishing: { icon: RotateCcw, color: 'bg-cyan-500/20 text-cyan-400', label: 'Publishing...' },
  published: { icon: CheckCircle2, color: 'bg-emerald-500/20 text-emerald-400', label: 'Published' },
  failed: { icon: AlertCircle, color: 'bg-red-500/20 text-red-400', label: 'Failed' },
  retrying: { icon: RotateCcw, color: 'bg-amber-500/20 text-amber-400', label: 'Retrying' },
  canceled: { icon: AlertCircle, color: 'bg-slate-500/20 text-slate-400', label: 'Canceled' },
};

export default function PublishingQueueCard({ log, onRetry, onCancel, onViewDetails, onDuplicate }) {
  const config = statusConfig[log.status] || statusConfig.draft;
  const Icon = config.icon;
  const isAnimating = log.status === 'publishing' || log.status === 'retrying';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
            <h3 className="font-semibold text-foreground text-sm">{log.post_title}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <span>Platform: <strong className="text-foreground capitalize">{log.platform}</strong></span>
            <span>Account: <strong className="text-foreground">{log.account_name}</strong></span>
            <span>Campaign: <strong className="text-foreground">{log.campaign_name}</strong></span>
            {log.scheduled_time && (
              <span>Scheduled: <strong className="text-foreground">{new Date(log.scheduled_time).toLocaleDateString()}</strong></span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={config.color}>{config.label}</Badge>
          {log.retry_count > 0 && (
            <Badge variant="outline" className="text-xs">Retry {log.retry_count}</Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1"
          onClick={() => onViewDetails(log.id)}
        >
          <Eye className="w-3 h-3 mr-1" />
          Details
        </Button>
        {log.status === 'failed' && (
          <Button
            size="sm"
            className="flex-1 bg-primary/20 hover:bg-primary/30"
            onClick={() => onRetry(log.id)}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
        {(log.status === 'queued' || log.status === 'draft') && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onCancel(log.id)}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onDuplicate(log.id)}
          title="Duplicate to another platform"
        >
          <Copy className="w-3 h-3 mr-1" />
          Duplicate
        </Button>
      </div>
    </motion.div>
  );
}