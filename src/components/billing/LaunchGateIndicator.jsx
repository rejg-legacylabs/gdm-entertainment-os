import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, DollarSign, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LaunchGateIndicator({
  launchGate,
  campaign,
  onPaymentClick,
  onApprovalClick,
  compact = false,
}) {
  if (!launchGate) return null;

  const issues = [];
  if (launchGate.payment_required && launchGate.payment_status !== 'paid') {
    issues.push({
      type: 'payment',
      icon: DollarSign,
      title: 'Payment Pending',
      message: `$${(launchGate.total_due - launchGate.amount_paid).toLocaleString()} remaining`,
      action: 'Pay Now',
    });
  }

  if (launchGate.approval_required && launchGate.approval_status !== 'approved') {
    issues.push({
      type: 'approval',
      icon: AlertCircle,
      title: 'Awaiting Approval',
      message: 'Client review required before launch',
      action: 'Request Approval',
    });
  }

  if (launchGate.can_launch) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="font-semibold text-emerald-400">Ready to Launch</p>
          <p className="text-xs text-emerald-400/70">All requirements met</p>
        </div>
      </motion.div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
        <Lock className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-medium text-amber-400">{issues.length} requirement{issues.length !== 1 ? 's' : ''}</span>
      </div>
    );
  }

  return (
    <motion.div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">Launch Requirements</p>
      <AnimatePresence>
        {issues.map((issue, idx) => {
          const Icon = issue.icon;
          return (
            <motion.div
              key={issue.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-amber-400">{issue.title}</p>
                  <p className="text-xs text-amber-400/70 mt-0.5">{issue.message}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (issue.type === 'payment') onPaymentClick?.();
                  if (issue.type === 'approval') onApprovalClick?.();
                }}
                className="w-full"
              >
                {issue.action}
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}