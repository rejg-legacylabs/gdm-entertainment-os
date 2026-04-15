import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import PublishingQueueCard from '@/components/publishing-ops/PublishingQueueCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PublishingQueueCenter() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: publishingLogs = [] } = useQuery({
    queryKey: ['publishingLogs'],
    queryFn: () => base44.entities.PublishingLog.list(),
  });

  const { data: errors = [] } = useQuery({
    queryKey: ['publishingErrors'],
    queryFn: () => base44.entities.PublishingError.list(),
  });

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

  const cancelMutation = useMutation({
    mutationFn: async (logId) => {
      return await base44.entities.PublishingLog.update(logId, {
        status: 'canceled',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishingLogs'] });
    },
  });

  const filteredLogs = selectedStatus === 'all' 
    ? publishingLogs 
    : publishingLogs.filter(l => l.status === selectedStatus);

  const stats = {
    queued: publishingLogs.filter(l => l.status === 'queued').length,
    publishing: publishingLogs.filter(l => l.status === 'publishing').length,
    published: publishingLogs.filter(l => l.status === 'published').length,
    failed: publishingLogs.filter(l => l.status === 'failed').length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="Publishing Queue Center"
        subtitle="Monitor post publishing across all platforms"
      />

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Queued', count: stats.queued, icon: Clock, color: 'blue' },
          { label: 'Publishing', count: stats.publishing, icon: RotateCcw, color: 'cyan' },
          { label: 'Published', count: stats.published, icon: CheckCircle2, color: 'emerald' },
          { label: 'Failed', count: stats.failed, icon: AlertCircle, color: 'red' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
            emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            red: 'bg-red-500/10 text-red-400 border-red-500/30',
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
                <Icon className={`w-5 h-5 flex-shrink-0 ${stat.color === 'cyan' && stat.count > 0 ? 'animate-spin' : ''}`} />
                <div>
                  <p className="text-xs font-medium opacity-75 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.count}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Queue List */}
      <Tabs defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredLogs.length})</TabsTrigger>
          <TabsTrigger value="queued">Queued</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="glass-panel rounded-lg p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No posts in this queue</p>
              </div>
            ) : (
              filteredLogs.map((log, idx) => (
                <PublishingQueueCard
                  key={log.id}
                  log={log}
                  onRetry={(id) => retryMutation.mutate(id)}
                  onCancel={(id) => cancelMutation.mutate(id)}
                  onViewDetails={(id) => {}}
                  onDuplicate={(id) => {}}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}