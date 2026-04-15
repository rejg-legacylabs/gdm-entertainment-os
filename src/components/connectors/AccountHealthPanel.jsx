import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, AlertCircle, Zap, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const statusConfig = {
  valid: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  expiring_soon: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  expired: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  refresh_failed: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function AccountHealthPanel({ health }) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('refreshConnectorToken', {
        connectedAccountId: health.connected_account_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectorHealth'] });
      setRefreshing(false);
    },
    onError: () => {
      setRefreshing(false);
    },
  });

  const handleRefreshToken = async () => {
    setRefreshing(true);
    refreshTokenMutation.mutate();
  };

  const tokenConfig = statusConfig[health.token_status] || statusConfig.valid;
  const TokenIcon = tokenConfig.icon;

  const criticalAlerts = health.status_alerts?.filter(a => a.severity === 'critical') || [];
  const warningAlerts = health.status_alerts?.filter(a => a.severity === 'warning') || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl border border-border/50 p-6 space-y-6"
    >
      {/* Header with Health Score */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg">{health.account_name}</h3>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{health.platform}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${health.overall_health_score >= 80 ? 'text-emerald-400' : health.overall_health_score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
            {health.overall_health_score}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Health Score</p>
        </div>
      </div>

      {/* Health Progress Bar */}
      <div>
        <Progress value={health.overall_health_score} className="h-2" />
      </div>

      {/* Token Status */}
      <div className={`rounded-lg p-4 border border-border/30 ${tokenConfig.bg}`}>
        <div className="flex items-start gap-3">
          <TokenIcon className={`w-5 h-5 ${tokenConfig.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-foreground text-sm">Authentication Token</h4>
              <Badge className={`capitalize text-xs ${
                health.token_status === 'valid' ? 'bg-emerald-500/20 text-emerald-400' :
                health.token_status === 'expiring_soon' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {health.token_status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {health.token_expires_at 
                ? `Expires ${new Date(health.token_expires_at).toLocaleDateString()}`
                : 'Expiration unknown'
              }
            </p>
            {health.token_status === 'expiring_soon' && (
              <Button
                size="sm"
                onClick={handleRefreshToken}
                disabled={refreshing}
                className="mt-3 gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Token
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sync Status Grid */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'Analytics Sync', status: health.analytics_sync_status, icon: Zap },
          { label: 'Comment Sync', status: health.comment_sync_status, icon: Clock },
          { label: 'Publishing', status: health.publish_sync_status, icon: RefreshCw },
        ].map((item) => {
          const Icon = item.icon;
          const statusColor = item.status === 'synced' ? 'text-emerald-400' :
                              item.status === 'syncing' ? 'text-blue-400' :
                              item.status === 'operational' ? 'text-emerald-400' :
                              'text-red-400';
          return (
            <div key={item.label} className="rounded-lg p-3 bg-secondary/20 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${statusColor}`} />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-semibold text-foreground capitalize">{item.status}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
        <div className="space-y-2">
          {criticalAlerts.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            </motion.div>
          ))}
          {warningAlerts.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Permissions */}
      {!health.permissions_valid && health.missing_permissions?.length > 0 && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h4 className="font-semibold text-red-400 text-sm mb-2">Missing Permissions</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {health.missing_permissions.map((perm, idx) => (
              <li key={idx}>• {perm}</li>
            ))}
          </ul>
          <Button size="sm" className="mt-3">Reconnect Account</Button>
        </div>
      )}

      {/* Failed Actions Pending */}
      {health.failed_actions_pending > 0 && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-amber-400 text-sm">Failed Actions</h4>
              <p className="text-xs text-muted-foreground mt-1">{health.failed_actions_pending} action(s) pending retry</p>
            </div>
            <Button size="sm" variant="outline">View Queue</Button>
          </div>
        </div>
      )}

      {/* Last Check */}
      {health.last_health_check && (
        <p className="text-xs text-muted-foreground text-center">
          Last checked {new Date(health.last_health_check).toLocaleTimeString()}
        </p>
      )}
    </motion.div>
  );
}