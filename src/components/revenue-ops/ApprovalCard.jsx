import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeDate, formatDate } from '@/lib/dateUtils';

export default function ApprovalCard({ approval, onClick, delay = 0 }) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pending Review' },
    approved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Approved' },
    changes_requested: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Changes Requested' },
    rejected: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Rejected' },
  };

  const config = statusConfig[approval.approval_status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const approvalTypeLabel = {
    proposal: 'Proposal Approval',
    content: 'Content Approval',
    launch: 'Campaign Launch Approval',
  }[approval.approval_type] || 'Approval';

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="w-full text-left group"
    >
      <div className={cn(
        'p-4 rounded-lg border border-border/30 hover:border-primary/50 transition-all',
        config.bg
      )}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon className={cn('w-5 h-5 flex-shrink-0', config.color)} />
              <div>
                <p className="font-semibold text-foreground">{approval.proposal_number}</p>
                <p className="text-xs text-muted-foreground">{approvalTypeLabel}</p>
              </div>
            </div>
            <div className="ml-8 space-y-1">
              <p className="text-sm text-foreground">{approval.client_name}</p>
              {approval.campaign_name && (
                <p className="text-xs text-muted-foreground">{approval.campaign_name}</p>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
        </div>

        {/* Timeline Details */}
        <div className="ml-8 grid grid-cols-4 gap-2 text-xs mb-2 pb-2 border-t border-border/30">
          <div>
            <p className="text-muted-foreground mb-0.5">Sent</p>
            <p className="text-foreground font-medium">{formatRelativeDate(approval.requested_date, 'Not sent')}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Viewed</p>
            <p className="text-foreground font-medium">{approval.viewed_date ? formatDate(approval.viewed_date) : '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Approved</p>
            <p className="text-foreground font-medium">{approval.approved_date ? formatDate(approval.approved_date) : '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Changes</p>
            <p className="text-foreground font-medium">{approval.feedback ? '1' : '0'}</p>
          </div>
        </div>

        {/* Feedback/Status */}
        {approval.feedback && (
          <div className="ml-8 flex items-start gap-2 text-xs">
            <MessageSquare className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground line-clamp-2">{approval.feedback}</p>
          </div>
        )}
      </div>
    </motion.button>
  );
}