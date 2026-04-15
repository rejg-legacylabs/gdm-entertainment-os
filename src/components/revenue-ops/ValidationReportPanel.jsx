import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ValidationReportPanel({ test, scenario }) {
  if (!test) return null;

  const getStepStatus = (step) => {
    if (step.status === 'passed') return { icon: CheckCircle2, color: 'emerald', label: 'Passed' };
    if (step.status === 'failed') return { icon: AlertCircle, color: 'red', label: 'Failed' };
    return { icon: Clock, color: 'slate', label: 'Pending' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display">{scenario.label}</h2>
            <p className="text-muted-foreground mt-1">{scenario.description}</p>
          </div>
          <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${
            test.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
            test.status === 'failed' ? 'bg-red-500/20 text-red-400' :
            test.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
            'bg-slate-500/20 text-slate-400'
          }`}>
            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/30">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Passed Steps</p>
            <p className="text-2xl font-bold text-emerald-400">{test.pass_count || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Failed Steps</p>
            <p className="text-2xl font-bold text-red-400">{test.fail_count || 0}</p>
          </div>
        </div>

        {test.last_run_date && (
          <p className="text-xs text-muted-foreground pt-2">
            Last run: {new Date(test.last_run_date).toLocaleString()}
          </p>
        )}
      </div>

      {/* Test Steps */}
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Test Steps</h3>

        {test.steps && test.steps.length > 0 ? (
          <div className="space-y-3">
            {test.steps.map((step, idx) => {
              const stepConfig = getStepStatus(step);
              const StepIcon = stepConfig.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    'p-4 rounded-lg border',
                    stepConfig.color === 'emerald' && 'bg-emerald-500/10 border-emerald-500/30',
                    stepConfig.color === 'red' && 'bg-red-500/10 border-red-500/30',
                    stepConfig.color === 'slate' && 'bg-slate-500/10 border-slate-500/30'
                  )}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <StepIcon className={cn(
                      'w-5 h-5 flex-shrink-0 mt-0.5',
                      stepConfig.color === 'emerald' && 'text-emerald-400',
                      stepConfig.color === 'red' && 'text-red-400',
                      stepConfig.color === 'slate' && 'text-slate-400'
                    )} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{step.step_name}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        stepConfig.color === 'emerald' && 'text-emerald-400/75',
                        stepConfig.color === 'red' && 'text-red-400/75',
                        stepConfig.color === 'slate' && 'text-slate-400/75'
                      )}>
                        {stepConfig.label}
                      </p>
                    </div>
                  </div>

                  {step.expected && (
                    <div className="text-sm text-muted-foreground mt-3 space-y-1">
                      <p><span className="font-medium">Expected:</span> {step.expected}</p>
                      {step.actual && <p><span className="font-medium">Actual:</span> {step.actual}</p>}
                      {step.error && <p className="text-red-400"><span className="font-medium">Error:</span> {step.error}</p>}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {scenario.steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 rounded-lg bg-secondary/30 text-sm"
              >
                <p className="text-foreground">{step}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Related Records */}
      {(test.related_client_id || test.related_campaign_id || test.related_proposal_id || test.related_invoice_id) && (
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Related Records</h3>

          <div className="grid sm:grid-cols-2 gap-3">
            {test.related_client_id && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs text-blue-400 mb-1">Client ID</p>
                <p className="text-sm font-medium text-foreground break-all">{test.related_client_id}</p>
              </div>
            )}
            {test.related_campaign_id && (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-xs text-purple-400 mb-1">Campaign ID</p>
                <p className="text-sm font-medium text-foreground break-all">{test.related_campaign_id}</p>
              </div>
            )}
            {test.related_proposal_id && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-xs text-cyan-400 mb-1">Proposal ID</p>
                <p className="text-sm font-medium text-foreground break-all">{test.related_proposal_id}</p>
              </div>
            )}
            {test.related_invoice_id && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-400 mb-1">Invoice ID</p>
                <p className="text-sm font-medium text-foreground break-all">{test.related_invoice_id}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blocked Reason */}
      {test.blocked_reason && (
        <div className="glass-panel rounded-xl p-6 bg-red-500/10 border border-red-500/30">
          <h3 className="font-semibold text-red-400 mb-2">Blocked Reason</h3>
          <p className="text-sm text-muted-foreground">{test.blocked_reason}</p>
        </div>
      )}

      {/* Notes */}
      {test.notes && (
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{test.notes}</p>
        </div>
      )}
    </motion.div>
  );
}