import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ApprovalTimeline from '@/components/revenue-ops/ApprovalTimeline';

export default function ApprovalDetailView({ approval, onBack }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const statusConfig = {
    pending: { icon: AlertCircle, color: 'text-amber-400', label: 'Pending Review' },
    approved: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Approved' },
    changes_requested: { icon: AlertCircle, color: 'text-blue-400', label: 'Changes Requested' },
    rejected: { icon: AlertCircle, color: 'text-red-400', label: 'Rejected' },
  };

  const config = statusConfig[approval.approval_status];
  const StatusIcon = config.icon;

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await base44.entities.ClientApproval.update(approval.id, {
        approval_status: 'approved',
        approved_by: (await base44.auth.me()).email,
        approved_date: new Date().toISOString(),
      });
      onBack();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-8 mb-6"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon className={`w-6 h-6 ${config.color}`} />
                <h1 className="text-3xl font-bold text-foreground font-display">
                  {approval.proposal_number}
                </h1>
              </div>
              <p className="text-muted-foreground">
                {approval.client_name} • {approval.campaign_name}
              </p>
            </div>
            <span className={`text-sm font-medium px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400`}>
              {config.label}
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-border/30">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Approval Type</p>
              <p className="text-sm font-medium text-foreground capitalize">
                {approval.approval_type} Approval
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Requested Date</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(approval.requested_date).toLocaleDateString()}
              </p>
            </div>
            {approval.approved_date && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Approved Date</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(approval.approved_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback/Revision Requests */}
            {approval.feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-foreground">
                    {approval.approval_status === 'changes_requested' ? 'Requested Changes' : 'Feedback'}
                  </h3>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4 text-sm text-foreground">
                  {approval.feedback}
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            {approval.notes && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-panel rounded-xl p-6"
              >
                <h3 className="font-semibold text-foreground mb-4">Internal Notes</h3>
                <div className="bg-secondary/30 rounded-lg p-4 text-sm text-muted-foreground">
                  {approval.notes}
                </div>
              </motion.div>
            )}

            {/* Action Section */}
            {approval.approval_status === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-xl p-6"
              >
                <h3 className="font-semibold text-foreground mb-4">Action</h3>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add notes or feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-24"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApprove}
                      disabled={isUpdating}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Approve
                    </Button>
                    <Button variant="outline" disabled={isUpdating}>
                      Request Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Timeline Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-1"
          >
            <ApprovalTimeline approval={approval} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}