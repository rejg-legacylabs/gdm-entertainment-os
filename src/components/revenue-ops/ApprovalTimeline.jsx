import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';

export default function ApprovalTimeline({ approval }) {
  const events = [
    {
      date: approval.requested_date,
      label: 'Proposal Sent',
      icon: Clock,
      color: 'text-blue-400',
      complete: true,
    },
  ];

  if (approval.approval_status === 'changes_requested') {
    events.push({
      date: approval.approved_date || new Date().toISOString(),
      label: 'Changes Requested',
      icon: Clock,
      color: 'text-amber-400',
      complete: true,
    });
  }

  if (approval.approval_status === 'approved') {
    events.push({
      date: approval.approved_date,
      label: 'Approved',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      complete: true,
    });
    events.push({
      date: null,
      label: 'Invoice Generated',
      icon: Clock,
      color: 'text-muted-foreground',
      complete: false,
    });
  } else {
    events.push({
      date: null,
      label: 'Awaiting Decision',
      icon: Clock,
      color: 'text-muted-foreground',
      complete: false,
    });
  }

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <h3 className="font-semibold text-foreground">Timeline</h3>

      <div className="space-y-4">
        {events.map((event, idx) => {
          const EventIcon = event.icon;
          const isLast = idx === events.length - 1;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-2 top-8 w-0.5 h-6 bg-border/30" />
              )}

              {/* Event */}
              <div className="flex gap-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 border-current flex items-center justify-center ${event.color} bg-background`}>
                  {event.complete && <EventIcon className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{event.label}</p>
                  {event.date && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}