import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FileText, Send, Eye, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProposalList({ proposals, onSelectProposal, onSend }) {
  const { data: approvals = [] } = useQuery({
    queryKey: ['client_approvals'],
    queryFn: () => base44.entities.ClientApproval.list(),
  });

  const getApprovalStatus = (proposalId) => {
    return approvals.find(a => a.proposal_id === proposalId);
  };

  const statusColors = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    approved: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  const approvalColors = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Awaiting Approval' },
    approved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Approved' },
    changes_requested: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Changes Requested' },
    rejected: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Rejected' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6"
    >
      <h2 className="font-semibold text-foreground mb-4">All Proposals</h2>
      
      {proposals.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No proposals yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal, idx) => {
            const approval = getApprovalStatus(proposal.id);
            const approvalConfig = approval ? approvalColors[approval.approval_status] : null;
            const ApprovalIcon = approvalConfig?.icon;

            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-foreground">{proposal.proposal_number}</p>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize font-medium', statusColors[proposal.status])}>
                        {proposal.status}
                      </span>
                      {approval && (
                        <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium', approvalConfig.bg)}>
                          <ApprovalIcon className="w-3 h-3" />
                          {approvalConfig.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{proposal.client_name} • {proposal.campaign_name}</p>
                    <p className="text-sm font-bold text-primary mt-1">${proposal.estimated_price.toLocaleString()}</p>
                    {approval?.feedback && (
                      <p className="text-xs text-blue-400 mt-2">💬 {approval.feedback.substring(0, 60)}...</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectProposal(proposal)}
                      className="gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    {proposal.status === 'draft' && (
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 gap-1"
                        onClick={() => onSend(proposal.id)}
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}