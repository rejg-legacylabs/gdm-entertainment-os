import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, RotateCcw, Trash2, Eye, CheckCircle2 } from 'lucide-react';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FailedPostsCenter() {
  const queryClient = useQueryClient();
  const [expandedError, setExpandedError] = useState(null);

  const { data: publishingLogs = [] } = useQuery({
    queryKey: ['publishingLogs'],
    queryFn: () => base44.entities.PublishingLog.list(),
  });

  const { data: errors = [] } = useQuery({
    queryKey: ['publishingErrors'],
    queryFn: () => base44.entities.PublishingError.list(),
  });

  const failedLogs = publishingLogs.filter(l => l.status === 'failed');

  const retryMutation = useMutation({
    mutationFn: async (logId) => {
      const log = publishingLogs.find(l => l.id === logId);
      return await base44.entities.PublishingLog.update(logId, {
        status: 'retrying',
        retry_count: (log.retry_count || 0) + 1,
        last_retry_time: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishingLogs'] });
    },
  });

  const resolveErrorMutation = useMutation({
    mutationFn: async (errorId) => {
      return await base44.entities.PublishingError.update(errorId, {
        resolved: true,
        resolved_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishingErrors'] });
    },
  });

  const errorTypeConfig = {
    invalid_media_format: { label: 'Invalid Media', color: 'bg-red-500/20 text-red-400' },
    disconnected_account: { label: 'Disconnected', color: 'bg-amber-500/20 text-amber-400' },
    expired_token: { label: 'Token Expired', color: 'bg-red-500/20 text-red-400' },
    missing_permissions: { label: 'Missing Scopes', color: 'bg-amber-500/20 text-amber-400' },
    api_rejection: { label: 'API Rejected', color: 'bg-red-500/20 text-red-400' },
    rate_limit: { label: 'Rate Limited', color: 'bg-amber-500/20 text-amber-400' },
    platform_validation: { label: 'Validation Error', color: 'bg-red-500/20 text-red-400' },
    network_error: { label: 'Network Error', color: 'bg-amber-500/20 text-amber-400' },
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="Failed Posts Center"
        subtitle="Review and retry failed publishing attempts"
      />

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-6 border border-red-500/30 bg-red-500/5 mb-6"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">{failedLogs.length} Posts Failed to Publish</h3>
            <p className="text-sm text-muted-foreground">
              {failedLogs.length} post(s) encountered errors during publishing. Review errors below and retry when ready.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Failed Posts */}
      <div className="space-y-3">
        <AnimatePresence>
          {failedLogs.length === 0 ? (
            <div className="glass-panel rounded-lg p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400/30 mx-auto mb-3" />
              <p className="text-muted-foreground">All posts published successfully!</p>
            </div>
          ) : (
            failedLogs.map((log, idx) => {
              const logErrors = errors.filter(e => e.publishing_log_id === log.id);
              const isExpanded = expandedError === log.id;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel rounded-lg overflow-hidden border border-border/50"
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedError(isExpanded ? null : log.id)}
                    className="w-full p-4 hover:bg-secondary/30 transition-colors text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{log.post_title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>Platform: {log.platform}</span>
                        <span>•</span>
                        <span>Account: {log.account_name}</span>
                        <span>•</span>
                        <span>Retries: {log.retry_count || 0}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/30"
                      >
                        <div className="p-4 space-y-4">
                          {logErrors.map((error, errorIdx) => {
                            const config = errorTypeConfig[error.error_type];
                            return (
                              <div key={error.id} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <Badge className={config.color}>{config.label}</Badge>
                                  {!error.resolved && (
                                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Unresolved</span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-foreground mb-1">{error.error_message}</p>
                                {error.error_code && (
                                  <p className="text-xs text-muted-foreground">Code: {error.error_code}</p>
                                )}
                              </div>
                            );
                          })}

                          <div className="flex gap-3 pt-4 border-t border-border/30">
                            {log.status === 'failed' && (
                              <Button
                                className="flex-1 bg-primary hover:bg-primary/90"
                                onClick={() => retryMutation.mutate(log.id)}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Retry Now
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Post
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Discard
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}