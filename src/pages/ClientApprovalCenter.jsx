import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, MessageSquare, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import ApprovalCard from '@/components/revenue-ops/ApprovalCard';
import ApprovalDetailView from '@/components/revenue-ops/ApprovalDetailView';

export default function ClientApprovalCenter() {
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: approvals = [] } = useQuery({
    queryKey: ['client_approvals'],
    queryFn: () => base44.entities.ClientApproval.list(),
  });

  const filteredApprovals = approvals.filter(a => 
    statusFilter === 'all' || a.approval_status === statusFilter
  );

  const stats = {
    pending: approvals.filter(a => a.approval_status === 'pending').length,
    approved: approvals.filter(a => a.approval_status === 'approved').length,
    changes_requested: approvals.filter(a => a.approval_status === 'changes_requested').length,
    rejected: approvals.filter(a => a.approval_status === 'rejected').length,
  };

  if (selectedApproval) {
    return (
      <ApprovalDetailView 
        approval={selectedApproval} 
        onBack={() => setSelectedApproval(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <SectionHeader 
          title="Client Approval Center"
          subtitle="Manage all client approvals, content reviews, and signoffs"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-primary">{stats.pending}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Changes</p>
            <p className="text-2xl font-bold text-amber-400">{stats.changes_requested}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </motion.div>
        </div>

        {/* Filters and Tabs */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All', count: approvals.length },
                { id: 'pending', label: 'Pending', count: stats.pending },
                { id: 'approved', label: 'Approved', count: stats.approved },
                { id: 'changes_requested', label: 'Changes', count: stats.changes_requested },
              ].map(f => (
                <Button
                  key={f.id}
                  variant={statusFilter === f.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(f.id)}
                  className="text-xs"
                >
                  {f.label} {f.count > 0 && `(${f.count})`}
                </Button>
              ))}
            </div>
          </div>

          {/* Approvals List */}
          <div className="space-y-3">
            {filteredApprovals.length > 0 ? (
              filteredApprovals.map((approval, idx) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onClick={() => setSelectedApproval(approval)}
                  delay={idx * 0.05}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No approvals found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}