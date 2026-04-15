import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export default function LaunchGateTimeline({ gate }) {
  const timeline = [
    { label: 'Proposal Sent', date: gate.approved_date, status: 'done' },
    { label: 'Client Approval', date: gate.approved_date, status: gate.approval_status === 'approved' ? 'done' : 'pending' },
    { label: 'Payment Due', date: gate.approved_date, status: gate.payment_status === 'paid' ? 'done' : 'pending' },
    { label: 'Campaign Launch', date: null, status: gate.can_launch ? 'done' : 'blocked' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Timeline</h3>
      
      <div className="space-y-3">
        {timeline.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-4"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
              item.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {item.status === 'done' && '✓'}
              {item.status === 'pending' && '○'}
              {item.status === 'blocked' && '✕'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.label}</p>
              {item.date && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}