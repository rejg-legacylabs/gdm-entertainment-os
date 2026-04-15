import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProposalList({ proposals, onSelectProposal, onSend }) {
  const statusColors = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    approved: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6"
    >
      <h2 className="font-semibold text-foreground mb-4">All Proposals</h2>
      
      {proposals.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No proposals yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal, idx) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-foreground">{proposal.proposal_number}</p>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize font-medium', statusColors[proposal.status])}>
                      {proposal.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{proposal.client_name} • {proposal.campaign_name}</p>
                  <p className="text-sm font-bold text-primary mt-1">${proposal.estimated_price.toLocaleString()}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectProposal(proposal)}
                    className="gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                  {proposal.status === 'draft' && (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 gap-1"
                      onClick={() => onSend(proposal.id)}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}