import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MessageSquare, AlertCircle, CheckCircle2, Flag } from 'lucide-react';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import CommentCard from '@/components/publishing-ops/CommentCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CommentOpsCenter() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('new');
  const [replyingTo, setReplyingTo] = useState(null);

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list(),
  });

  const updateCommentMutation = useMutation({
    mutationFn: async (commentId, updates) => {
      return await base44.entities.Comment.update(commentId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const filteredComments = selectedStatus === 'all'
    ? comments
    : comments.filter(c => c.status === selectedStatus);

  const stats = {
    new: comments.filter(c => c.status === 'new').length,
    reviewed: comments.filter(c => c.status === 'reviewed').length,
    replied: comments.filter(c => c.status === 'replied').length,
    escalated: comments.filter(c => c.status === 'escalated').length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="Comment Operations Center"
        subtitle="Manage comments, replies, and engagement across all platforms"
      />

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'New Comments', count: stats.new, icon: MessageSquare, color: 'blue' },
          { label: 'Reviewed', count: stats.reviewed, icon: CheckCircle2, color: 'emerald' },
          { label: 'Replied', count: stats.replied, icon: MessageSquare, color: 'cyan' },
          { label: 'Escalated', count: stats.escalated, icon: AlertCircle, color: 'red' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
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
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium opacity-75 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.count}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comments List */}
      <Tabs defaultValue="new" value={selectedStatus} onValueChange={setSelectedStatus} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new">New ({stats.new})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({stats.reviewed})</TabsTrigger>
          <TabsTrigger value="replied">Replied ({stats.replied})</TabsTrigger>
          <TabsTrigger value="escalated">Escalated ({stats.escalated})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <div className="glass-panel rounded-lg p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No comments in this section</p>
              </div>
            ) : (
              filteredComments.map((comment, idx) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onReply={(id) => setReplyingTo(id)}
                  onEscalate={(id) => updateCommentMutation.mutate(id, { status: 'escalated' })}
                  onModerate={(id) => {}}
                  onAssign={(id) => {}}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}