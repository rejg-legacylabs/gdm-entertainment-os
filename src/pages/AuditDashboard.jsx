import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Eye, Filter, Download, Clock } from 'lucide-react';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function AuditDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchUser, setSearchUser] = useState('');

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AuditLog.list(),
  });

  const { data: overrideLogs = [] } = useQuery({
    queryKey: ['overrideLogs'],
    queryFn: () => base44.entities.OverrideLog.list(),
  });

  const filteredLogs = auditLogs.filter(log => {
    if (selectedFilter !== 'all' && log.risk_level !== selectedFilter) return false;
    if (searchUser && !log.user_email.includes(searchUser)) return false;
    return true;
  });

  const riskStats = {
    low: auditLogs.filter(l => l.risk_level === 'low').length,
    medium: auditLogs.filter(l => l.risk_level === 'medium').length,
    high: auditLogs.filter(l => l.risk_level === 'high').length,
    critical: auditLogs.filter(l => l.risk_level === 'critical').length,
  };

  const actionTypeStats = {};
  auditLogs.forEach(log => {
    actionTypeStats[log.action_type] = (actionTypeStats[log.action_type] || 0) + 1;
  });

  const riskConfig = {
    low: 'bg-blue-500/10 text-blue-400',
    medium: 'bg-amber-500/10 text-amber-400',
    high: 'bg-red-500/10 text-red-400',
    critical: 'bg-red-600/10 text-red-500',
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="Audit Dashboard"
        subtitle="Track all actions and changes across the platform"
      />

      {/* Risk Summary */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Low Risk', count: riskStats.low, color: 'blue' },
          { label: 'Medium Risk', count: riskStats.medium, color: 'amber' },
          { label: 'High Risk', count: riskStats.high, color: 'red' },
          { label: 'Critical', count: riskStats.critical, color: 'red-600' },
        ].map((stat, idx) => {
          const colors = {
            blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            red: 'bg-red-500/10 text-red-400 border-red-500/30',
            'red-600': 'bg-red-600/10 text-red-500 border-red-600/30',
          };

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-panel rounded-xl p-4 border ${colors[stat.color]}`}
            >
              <p className="text-xs font-medium opacity-75 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.count}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="logs" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">Action Logs ({filteredLogs.length})</TabsTrigger>
          <TabsTrigger value="overrides">Overrides ({overrideLogs.length})</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Action Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <div className="glass-panel rounded-lg p-6 border border-border/50 mb-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by user email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {filteredLogs.length === 0 ? (
              <div className="glass-panel rounded-lg p-12 text-center">
                <Eye className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No audit logs found</p>
              </div>
            ) : (
              filteredLogs.slice(0, 50).map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="glass-panel rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={riskConfig[log.risk_level]}>{log.risk_level}</Badge>
                        <span className="font-semibold text-foreground text-sm capitalize">{log.action_type.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                        <div>User: <strong className="text-foreground">{log.user_email}</strong></div>
                        <div>Entity: <strong className="text-foreground">{log.entity_name || log.entity_type}</strong></div>
                        <div>Time: <strong className="text-foreground">{new Date(log.timestamp).toLocaleString()}</strong></div>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Overrides Tab */}
        <TabsContent value="overrides" className="mt-6">
          <div className="space-y-2">
            {overrideLogs.length === 0 ? (
              <div className="glass-panel rounded-lg p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No overrides logged</p>
              </div>
            ) : (
              overrideLogs.map((override, idx) => (
                <motion.div
                  key={override.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="glass-panel rounded-lg p-4 border border-red-500/30 bg-red-500/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-500/20 text-red-400">{override.override_type}</Badge>
                        <span className="font-semibold text-foreground text-sm">{override.entity_name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{override.reason}</p>
                      <div className="grid sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                        <div>Requested: <strong className="text-foreground">{override.requested_by}</strong></div>
                        {override.approved_by && (
                          <div>Approved: <strong className="text-foreground">{override.approved_by}</strong></div>
                        )}
                        <div>Time: <strong className="text-foreground">{new Date(override.requested_at).toLocaleString()}</strong></div>
                      </div>
                    </div>
                    <Badge className={override.status === 'executed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                      {override.status}
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="mt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Top Actions */}
            <div className="glass-panel rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Most Common Actions</h3>
              <div className="space-y-3">
                {Object.entries(actionTypeStats)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([action, count]) => (
                    <div key={action} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{action.replace(/_/g, ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
              </div>
            </div>

            {/* Users by Activity */}
            <div className="glass-panel rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Top Users</h3>
              <div className="space-y-3">
                {auditLogs
                  .reduce((acc, log) => {
                    const idx = acc.findIndex(u => u.email === log.user_email);
                    if (idx >= 0) {
                      acc[idx].count++;
                    } else {
                      acc.push({ email: log.user_email, count: 1 });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 8)
                  .map((user) => (
                    <div key={user.email} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{user.email}</span>
                      <Badge variant="outline">{user.count} actions</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}