import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FileText, Send, DollarSign, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProposalPreview({ proposal, onSend, onConvertToInvoice, onInvoiceCreated }) {
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState(null);
  
  const { data: approvals = [] } = useQuery({
    queryKey: ['client_approvals'],
    queryFn: () => base44.entities.ClientApproval.list(),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list(),
  });

  // Determine eligibility
  const approval = approvals.find(a => a.proposal_id === proposal.id);
  const alreadyConverted = invoices.some(i => i.proposal_id === proposal.id);
  
  const eligibility = {
    approved: proposal.status === 'approved',
    approvalComplete: !approval || approval.approval_status === 'approved',
    notConverted: !alreadyConverted,
    notRejected: proposal.status !== 'rejected',
  };

  const isEligible = eligibility.approved && eligibility.approvalComplete && eligibility.notConverted && eligibility.notRejected;
  
  const eligibilityReason = !eligibility.approved 
    ? `Proposal must be approved (currently ${proposal.status})`
    : !eligibility.approvalComplete
    ? `Awaiting approval (status: ${approval?.approval_status})`
    : !eligibility.notConverted
    ? 'Already converted to invoice'
    : !eligibility.notRejected
    ? 'Rejected proposals cannot be converted'
    : null;

  const handleConvert = async () => {
    if (!isEligible) return;
    
    setConversionLoading(true);
    setConversionError(null);
    
    try {
      const result = await base44.functions.invoke('convertProposalToInvoice', { 
        proposalId: proposal.id 
      });
      
      if (result.data.success) {
        if (onInvoiceCreated) {
          onInvoiceCreated(result.data.invoice);
        }
        if (onConvertToInvoice) {
          onConvertToInvoice(result.data.invoice);
        }
      }
    } catch (err) {
      setConversionError(err.response?.data?.reason || err.message);
    } finally {
      setConversionLoading(false);
    }
  };
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

      {/* Invoice Eligibility Status */}
      <div className={cn(
        'glass-panel rounded-xl p-4 border',
        isEligible 
          ? 'border-emerald-500/30 bg-emerald-500/5' 
          : 'border-amber-500/30 bg-amber-500/5'
      )}>
        <div className="flex items-start gap-3">
          {isEligible ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">
              {isEligible ? 'Eligible for Invoice Conversion' : 'Not Eligible for Invoice'}
            </p>
            {eligibilityReason && (
              <p className="text-xs text-muted-foreground mt-1">{eligibilityReason}</p>
            )}
          </div>
        </div>
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
        {proposal.status === 'approved' || proposal.status === 'invoice_created' ? (
          <Button
            onClick={handleConvert}
            disabled={!isEligible || conversionLoading}
            className="flex-1 bg-primary hover:bg-primary/90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isEligible ? eligibilityReason : 'Click to convert this proposal to an invoice'}
          >
            {conversionLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating Invoice...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                Convert to Invoice
              </>
            )}
          </Button>
        ) : null}
      </div>

      {/* Conversion Error */}
      {conversionError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-400">{conversionError}</p>
        </motion.div>
      )}
    </motion.div>
  );
}