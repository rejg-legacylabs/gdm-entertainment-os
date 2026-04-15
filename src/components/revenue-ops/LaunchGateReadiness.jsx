import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LaunchGateReadiness({ gate, campaign, invoices, clientApprovals }) {
  const invoice = invoices.find(i => i.id === gate.invoice_id);
  const approval = clientApprovals.find(a => a.proposal_id === gate.campaign_id);

  const requirements = [
    {
      title: 'Client Approval',
      required: gate.approval_required,
      met: gate.approval_status === 'approved',
      details: approval?.feedback || 'Waiting for client review',
      icon: CheckCircle2,
    },
    {
      title: 'Payment',
      required: gate.payment_required,
      met: gate.payment_status === 'paid',
      details: invoice ? `${gate.amount_paid ? 'Paid: $' + gate.amount_paid.toLocaleString() + ' / ' : ''}Pending: $${(gate.total_due - (gate.amount_paid || 0)).toLocaleString()}` : 'No invoice',
      icon: DollarSign,
    },
    {
      title: 'Content Ready',
      required: true,
      met: campaign?.status === 'active',
      details: campaign?.status || 'Pending',
      icon: CheckCircle2,
    },
    {
      title: 'Schedule Set',
      required: true,
      met: !!campaign?.start_date,
      details: campaign?.start_date ? `Starting ${campaign.start_date}` : 'Not set',
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Launch Readiness Checklist</h3>
      
      <div className="space-y-3">
        {requirements.map((req, idx) => {
          const Icon = req.met ? CheckCircle2 : req.required ? AlertCircle : Clock;
          const iconColor = req.met ? 'text-emerald-400' : req.required ? 'text-amber-400' : 'text-muted-foreground';
          const bgColor = req.met ? 'bg-emerald-500/10' : 'bg-secondary/30';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn('p-4 rounded-lg border border-border/30', bgColor)}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColor)} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{req.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{req.details}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}