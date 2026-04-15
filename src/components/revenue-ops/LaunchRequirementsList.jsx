import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function LaunchRequirementsList({ gate, campaign, invoice, approval }) {
  const requirements = [
    {
      id: 'approval',
      label: 'Client Approval',
      required: gate.approval_required,
      met: approval?.approval_status === 'approved',
      blocker: 'Awaiting client review of proposal',
    },
    {
      id: 'payment',
      label: 'Payment Received',
      required: gate.payment_required,
      met: gate.payment_status === 'paid',
      blocker: `$${(gate.total_due - gate.amount_paid).toLocaleString()} due`,
    },
    {
      id: 'invoice',
      label: 'Invoice Generated',
      required: gate.payment_required,
      met: !!invoice,
      blocker: 'Invoice not yet created',
    },
    {
      id: 'campaign',
      label: 'Campaign Setup',
      required: true,
      met: campaign?.status === 'active' || campaign?.status === 'draft',
      blocker: 'Campaign not configured',
    },
  ];

  const unmetRequired = requirements.filter(r => r.required && !r.met);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Launch Requirements</h3>
        {unmetRequired.length === 0 ? (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">All clear</span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium">{unmetRequired.length} blocker(s)</span>
        )}
      </div>

      <div className="space-y-2">
        {requirements.map((req, idx) => {
          const Icon = req.met ? CheckCircle2 : req.required ? AlertCircle : Clock;
          const color = req.met ? 'text-emerald-400' : req.required ? 'text-red-400' : 'text-slate-400';
          const bgColor = req.met ? 'bg-emerald-500/10' : req.required ? 'bg-red-500/10' : 'bg-slate-500/10';

          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg ${bgColor}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{req.label}</p>
                  {req.required && !req.met && (
                    <span className="text-xs font-medium text-red-400">REQUIRED</span>
                  )}
                </div>
                {!req.met && (
                  <p className="text-xs text-muted-foreground mt-1">{req.blocker}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}