import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, MessageSquare, Calendar, FileText, DollarSign, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ApprovalTimeline from '@/components/revenue-ops/ApprovalTimeline';
import { formatDate, formatDateTime } from '@/lib/dateUtils';

export default function ApprovalDetailView({ approval, onBack }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [changeReason, setChangeReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: proposal } = useQuery({
    queryKey: ['proposal', approval.proposal_id],
    queryFn: async () => {
      const results = await base44.entities.Proposal.filter({ id: approval.proposal_id });
      return results[0];
    },
    enabled: !!approval.proposal_id,
  });

  const { data: invoice } = useQuery({
    queryKey: ['invoice', approval.campaign_id],
    queryFn: async () => {
      const results = await base44.entities.Invoice.filter({ campaign_id: approval.campaign_id });
      return results[0];
    },
    enabled: !!approval.campaign_id,
  });

  const updateApproval = useMutation({
    mutationFn: async (updates) => {
      return await base44.entities.ClientApproval.update(approval.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client_approvals'] });
      setComment('');
      setChangeReason('');
      setShowChangeRequest(false);
      setIsUpdating(false);
    },
  });

  const handleApprove = async () => {
    setIsUpdating(true);
    updateApproval.mutate({
      approval_status: 'approved',
      approved_by: 'client',
      approved_date: new Date().toISOString(),
    });
  };

  const handleRequestChanges = async () => {
    setIsUpdating(true);
    updateApproval.mutate({
      approval_status: 'changes_requested',
      feedback: changeReason,
      notes: comment || null,
    });
  };

  const handleReject = async () => {
    setIsUpdating(true);
    updateApproval.mutate({
      approval_status: 'rejected',
      feedback: changeReason || 'Proposal rejected by client',
    });
  };

  const canConvertToInvoice = approval.approval_status === 'approved' && !invoice;
  const isActionable = approval.approval_status === 'pending' || approval.approval_status === 'changes_requested';

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Awaiting Review' },
    approved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Approved' },
    changes_requested: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Changes Requested' },
    rejected: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Rejected' },
  };

  const config = statusConfig[approval.approval_status];
  const StatusIcon = config.icon;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Approvals
      </motion.button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Approval Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <StatusIcon className={`w-6 h-6 ${config.color}`} />
                  <h2 className="text-2xl font-bold text-foreground">{approval.proposal_number}</h2>
                </div>
                <p className="text-muted-foreground">{approval.client_name} • {approval.campaign_name}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${config.bg} ${config.color}`}>
                {config.label}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid sm:grid-cols-3 gap-4 py-4 border-y border-border/30">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Approval Type</p>
                <p className="text-sm font-medium text-foreground capitalize">{approval.approval_type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Requested</p>
                <p className="text-sm font-medium text-foreground">{formatDate(approval.requested_date, 'Not requested')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Viewed</p>
                <p className="text-sm font-medium text-foreground">{approval.viewed_date ? formatDate(approval.viewed_date) : '—'}</p>
              </div>
              {approval.approved_date && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Approved By</p>
                    <p className="text-sm font-medium text-foreground">{approval.approved_by || 'Client'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Approved Date</p>
                    <p className="text-sm font-medium text-emerald-400">{formatDate(approval.approved_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-medium text-emerald-400">✓ Finalized</p>
                  </div>
                </>
              )}
              {approval.approval_status === 'rejected' && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Rejected By</p>
                    <p className="text-sm font-medium text-red-400">{approval.approved_by || 'Client'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Rejected Date</p>
                    <p className="text-sm font-medium text-red-400">{formatDate(approval.approved_date, 'Not set')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-medium text-red-400">✗ Rejected</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Proposal Details */}
          {proposal && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Proposal Summary
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-medium text-foreground capitalize">{proposal.status}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Investment</p>
                  <p className="text-lg font-bold text-primary">${proposal.estimated_price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                  <p className="text-sm font-medium text-foreground">{proposal.timeline || '—'}</p>
                </div>
              </div>
              {proposal.platforms?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {proposal.platforms.map(p => (
                      <span key={p} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Invoice Link */}
          {invoice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-panel rounded-xl p-6 bg-emerald-500/5 border border-emerald-500/30"
            >
              <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Associated Invoice
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Invoice #</p>
                  <p className="text-sm font-bold text-foreground">{invoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                  <p className="text-sm font-bold text-emerald-400">${invoice.total_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className={`text-sm font-medium ${invoice.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {invoice.payment_status}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Feedback Section */}
          {approval.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {approval.approval_status === 'changes_requested' ? 'Requested Changes' : 'Client Feedback'}
              </h3>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-foreground">{approval.feedback}</p>
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-panel rounded-xl p-6"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Approval Timeline
            </h3>
            <ApprovalTimeline approval={approval} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          {isActionable && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-4 space-y-3"
            >
              <p className="text-sm font-medium text-foreground">Actions</p>
              <Button
                onClick={handleApprove}
                disabled={isUpdating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowChangeRequest(!showChangeRequest)}
                disabled={isUpdating}
                className="w-full gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Request Changes
              </Button>
            </motion.div>
          )}

          {/* Change Request Form */}
          {showChangeRequest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-4 space-y-3"
            >
              <Textarea
                placeholder="What changes are needed?"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleRequestChanges}
                  disabled={isUpdating || !changeReason}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 gap-1"
                >
                  <Send className="w-3 h-3" />
                  Send
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowChangeRequest(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Status Info */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">Status</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current:</span>
                <span className={`font-medium ${config.color} capitalize`}>{approval.approval_status}</span>
              </div>
              {approval.approval_status === 'approved' && (
                <div className="flex items-center justify-between text-emerald-400 text-xs">
                  <span>✓ Approved</span>
                  <span>{new Date(approval.approved_date).toLocaleDateString()}</span>
                </div>
              )}
              {canConvertToInvoice && (
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-xs text-emerald-400">✓ Ready to convert to invoice</p>
                </div>
              )}
              {approval.approval_status === 'rejected' && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/30">
                  <p className="text-xs text-red-400">✗ Proposal rejected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}