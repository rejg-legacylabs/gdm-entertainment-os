import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import LaunchGateReadiness from '@/components/revenue-ops/LaunchGateReadiness';
import LaunchGateTimeline from '@/components/revenue-ops/LaunchGateTimeline';

export default function LaunchGateCenter() {
  const queryClient = useQueryClient();
  const [expandedGate, setExpandedGate] = useState(null);
  const [blockerModal, setBlockerModal] = useState(null);

  const { data: launchGates = [] } = useQuery({
    queryKey: ['launchGates'],
    queryFn: () => base44.entities.LaunchGate.list(),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list(),
  });

  const { data: clientApprovals = [] } = useQuery({
    queryKey: ['clientApprovals'],
    queryFn: () => base44.entities.ClientApproval.list(),
  });

  const clearLaunchGate = useMutation({
    mutationFn: async (gateId) => {
      const gate = launchGates.find(g => g.id === gateId);
      const status = getGateStatus(gate);
      
      // Block launch if critical issues exist
      if (status.issueCount > 0) {
        setBlockerModal({
          gateId,
          issues: status.issues,
          campaign: gate.campaign_name,
        });
        throw new Error('Cannot launch: unresolved blockers');
      }
      
      return await base44.entities.LaunchGate.update(gateId, {
        can_launch: true,
        blocked_reason: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['launchGates'] });
    },
  });

  const blockLaunchGate = useMutation({
    mutationFn: async ({ gateId, reason }) => {
      return await base44.entities.LaunchGate.update(gateId, {
        can_launch: false,
        blocked_reason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['launchGates'] });
    },
  });

  const getGateStatus = (gate) => {
    const issues = [];

    if (gate.approval_required && gate.approval_status !== 'approved') {
      issues.push({ type: 'approval', severity: 'high', label: 'Awaiting client approval' });
    }

    if (gate.payment_required && gate.payment_status !== 'paid') {
      issues.push({ type: 'payment', severity: 'high', label: `Payment pending: $${(gate.total_due - gate.amount_paid).toLocaleString()}` });
    }

    if (gate.blocked_reason) {
      issues.push({ type: 'blocked', severity: 'critical', label: gate.blocked_reason });
    }

    return {
      isReady: issues.filter(i => i.severity !== 'blocked').length === 0 && gate.can_launch,
      issueCount: issues.length,
      issues,
    };
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="Launch Gate Center"
        subtitle="Monitor campaign readiness and approval status"
        icon={Lock}
      />

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Ready to Launch', count: launchGates.filter(g => g.can_launch).length, icon: CheckCircle2, color: 'emerald' },
          { label: 'Waiting Approval', count: launchGates.filter(g => !g.can_launch && g.approval_required && g.approval_status !== 'approved').length, icon: Clock, color: 'amber' },
          { label: 'Waiting Payment', count: launchGates.filter(g => !g.can_launch && g.payment_required && g.payment_status !== 'paid').length, icon: AlertCircle, color: 'red' },
          { label: 'Blocked', count: launchGates.filter(g => !g.can_launch && g.blocked_reason).length, icon: Lock, color: 'slate' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colors = {
            emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            red: 'bg-red-500/10 text-red-400 border-red-500/30',
            slate: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          };

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-panel rounded-xl p-4 border ${colors[stat.color]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium opacity-75 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.count}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Launch Gates */}
      <div className="space-y-4">
        {launchGates.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center">
            <Lock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No campaigns with launch gates</p>
          </div>
        ) : (
          launchGates.map((gate, idx) => {
            const campaign = campaigns.find(c => c.id === gate.campaign_id);
            const status = getGateStatus(gate);
            const isExpanded = expandedGate === gate.id;

            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-xl overflow-hidden border-border/50"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedGate(isExpanded ? null : gate.id)}
                  className="w-full p-6 hover:bg-secondary/30 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{gate.campaign_name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          status.isReady
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {status.isReady ? 'Ready to Launch' : `${status.issueCount} Issue${status.issueCount !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{campaign?.objective}</p>
                    </div>

                    {status.isReady ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border/30"
                    >
                      <div className="p-6 space-y-6">
                        <LaunchGateReadiness
                          gate={gate}
                          campaign={campaign}
                          invoices={invoices}
                          clientApprovals={clientApprovals}
                        />

                        <LaunchGateTimeline gate={gate} />

                        {/* Actions */}
                        {!status.isReady && status.issueCount > 0 && (
                          <div className="flex gap-3 pt-4 border-t border-border/30">
                            <Button
                              onClick={() => clearLaunchGate.mutate(gate.id)}
                              disabled={status.issueCount > 0}
                              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={status.issueCount > 0 ? `Cannot launch: ${status.issueCount} unresolved issue(s)` : ''}
                            >
                              Clear Launch Gate
                            </Button>
                            {!gate.blocked_reason && (
                              <Button
                                variant="outline"
                                onClick={() => blockLaunchGate.mutate({ gateId: gate.id, reason: 'Manual hold' })}
                              >
                                Block
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Blocker Modal */}
      <AnimatePresence>
        {blockerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setBlockerModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-xl p-6 max-w-md w-full border border-red-500/30 bg-red-500/5"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Cannot Launch Campaign</h3>
                  <p className="text-sm text-muted-foreground mt-1">{blockerModal.campaign}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 p-4 rounded-lg bg-secondary/30">
                {blockerModal.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{issue.label}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setBlockerModal(null)}
                className="w-full"
                variant="outline"
              >
                Dismiss
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}