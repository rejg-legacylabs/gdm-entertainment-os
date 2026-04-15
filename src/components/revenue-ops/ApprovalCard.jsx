import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      className="w-full text-left"
    >
      <div className={cn(
        'p-4 rounded-lg border border-border/30 hover:border-primary/50 transition-all group',
        config.bg
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon className={cn('w-5 h-5', config.color)} />
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
              {approval.feedback && (
                <div className="flex items-center gap-1 text-xs text-blue-400 mt-2">
                  <MessageSquare className="w-3 h-3" />
                  {approval.feedback.substring(0, 50)}...
                </div>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded',
              config.bg,
              config.color
            )}>
              {config.label}
            </span>
            {approval.requested_date && (
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(approval.requested_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}