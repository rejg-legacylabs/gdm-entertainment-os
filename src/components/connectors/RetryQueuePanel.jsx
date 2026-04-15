import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCw, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RetryQueuePanel({ connectedAccountId }) {
  const queryClient = useQueryClient();

  const { data: failedActions = [] } = useQuery({
    queryKey: ['failedActionRetry', connectedAccountId],
    queryFn: async () => {
      return await base44.entities.FailedActionRetry.filter({
        connected_account_id: connectedAccountId,
        status: 'pending_retry',
      });
    },
  });

  const retryMutation = useMutation({
    mutationFn: async (retryId) => {
      return await base44.functions.invoke('processFailedActionRetry', {
        retryId,
        manualRetry: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['failedActionRetry'] });
    },
  });

  if (failedActions.length === 0) {
    return (
      <div className="glass-panel rounded-lg p-6 border border-border/50 text-center">
        <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No failed actions to retry</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {failedActions.map((action, idx) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="glass-panel rounded-lg p-4 border border-amber-500/30 bg-amber-500/5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="font-semibold text-foreground text-sm capitalize">
                  {action.original_action_type.replace(/_/g, ' ')}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{action.error_message}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {action.retry_count}/{action.max_retries} retries
                  {action.next_retry_at && ` • Next: ${new Date(action.next_retry_at).toLocaleTimeString()}`}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {action.requires_manual_intervention && (
                <Badge className="bg-red-500/20 text-red-400 text-xs">
                  Manual Required
                </Badge>
              )}
              <Button
                size="sm"
                onClick={() => retryMutation.mutate(action.id)}
                disabled={retryMutation.isPending}
                className="gap-2 whitespace-nowrap"
              >
                <RotateCw className={`w-3 h-3 ${retryMutation.isPending ? 'animate-spin' : ''}`} />
                Retry
              </Button>
            </div>
          </div>

          {action.required_action && (
            <div className="mt-3 pt-3 border-t border-amber-500/20">
              <p className="text-xs text-amber-400 font-medium">Required Action: {action.required_action}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}