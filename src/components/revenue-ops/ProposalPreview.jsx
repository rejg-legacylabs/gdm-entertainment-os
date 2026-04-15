import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProposalPreview({ proposal, onSend, onConvertToInvoice }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-panel rounded-xl p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Proposal</p>
            <h1 className="text-4xl font-bold text-foreground font-display">{proposal.proposal_number}</h1>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">${proposal.estimated_price.toLocaleString()}</p>
            <p className={`text-sm font-semibold mt-2 capitalize px-3 py-1 rounded-full w-fit ml-auto ${
              proposal.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
              proposal.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
              'bg-amber-500/20 text-amber-400'
            }`}>
              {proposal.status}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 border-t border-border/30 pt-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Client</p>
            <p className="font-semibold text-foreground">{proposal.client_name}</p>
            <p className="text-sm text-muted-foreground mt-1">Campaign: {proposal.campaign_name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-2">Timeline</p>
            <p className="text-sm text-foreground">{proposal.start_date} to {proposal.end_date}</p>
            <p className="text-sm text-muted-foreground mt-1">{proposal.timeline}</p>
          </div>
        </div>
      </div>

      {/* Scope */}
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Scope of Work</h2>
        <p className="text-sm text-foreground">{proposal.scope_of_work}</p>

        {proposal.platforms?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {proposal.platforms.map(p => (
                <span key={p} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs capitalize">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deliverables */}
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Deliverables</h2>
        <ul className="space-y-2">
          {proposal.deliverables?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-primary font-bold flex-shrink-0">✓</span>
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing */}
      <div className="glass-panel rounded-xl p-6 space-y-3">
        <h2 className="font-semibold text-foreground mb-4">Investment</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">${(proposal.estimated_price * 0.9).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium text-foreground">${(proposal.estimated_price * 0.1).toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border/30">
            <span className="font-semibold text-foreground">Total Investment</span>
            <span className="text-2xl font-bold text-primary">${proposal.estimated_price.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-2">Payment Terms: {proposal.payment_terms}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {proposal.status === 'draft' && (
          <Button
            onClick={onSend}
            className="flex-1 bg-primary hover:bg-primary/90 gap-2"
          >
            <Send className="w-4 h-4" />
            Send to Client
          </Button>
        )}
        {proposal.status === 'approved' && (
          <Button
            onClick={onConvertToInvoice}
            className="flex-1 bg-primary hover:bg-primary/90 gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Convert to Invoice
          </Button>
        )}
      </div>
    </motion.div>
  );
}