import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FileText, Send, Eye, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import ProposalPreview from '@/components/revenue-ops/ProposalPreview';
import ProposalList from '@/components/revenue-ops/ProposalList';

export default function ProposalStudio() {
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'preview'

  const { data: proposals = [] } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => base44.entities.Proposal.list(),
  });

  const { data: pricingScopes = [] } = useQuery({
    queryKey: ['pricingScopes'],
    queryFn: () => base44.entities.PricingScope.filter({ status: 'saved' }),
  });

  const generateProposal = useMutation({
    mutationFn: async (scopeId) => {
      const scope = pricingScopes.find(s => s.id === scopeId);
      const proposalNumber = `PROP-${Date.now().toString().slice(-6)}`;
      
      return await base44.entities.Proposal.create({
        proposal_number: proposalNumber,
        client_id: scope.client_id,
        client_name: scope.client_name,
        campaign_id: scope.campaign_id,
        campaign_name: scope.campaign_name,
        proposal_type: 'campaign',
        scope_of_work: 'Multi-platform social media campaign with content creation, scheduling, and analytics.',
        deliverables: [
          `${scope.facebook} Facebook posts`,
          `${scope.instagram} Instagram posts`,
          `${scope.tiktok} TikTok videos`,
          `${scope.linkedin} LinkedIn posts`,
          scope.reporting ? 'Monthly analytics report' : null,
        ].filter(Boolean),
        platforms: ['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube'].filter((p, i) => scope[p] > 0),
        estimated_price: scope.total,
        timeline: `${scope.campaign_duration_months} months`,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + scope.campaign_duration_months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        payment_condition: 'Net 30',
        approval_workflow: 'Client approval required before launch',
        price_breakdown: { subtotal: scope.subtotal, tax: scope.tax_amount, total: scope.total },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });

  const sendProposal = useMutation({
    mutationFn: async (proposalId) => {
      const proposal = proposals.find(p => p.id === proposalId);
      
      // Update proposal status
      await base44.entities.Proposal.update(proposalId, { status: 'sent' });

      // Create ClientApproval record
      const user = await base44.auth.me();
      await base44.entities.ClientApproval.create({
        proposal_id: proposalId,
        proposal_number: proposal.proposal_number,
        client_id: proposal.client_id,
        client_name: proposal.client_name,
        campaign_id: proposal.campaign_id,
        approval_type: 'proposal',
        approval_status: 'pending',
        requested_by: user.email,
        requested_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['client_approvals'] });
    },
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="Proposal Studio"
        subtitle="Create, manage, and send branded proposals"
        icon={FileText}
      />

      {selectedProposal && viewMode === 'preview' ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setViewMode('list')}
            className="mb-4"
          >
            ← Back to List
          </Button>
          <ProposalPreview
            proposal={selectedProposal}
            onSend={() => sendProposal.mutate(selectedProposal.id)}
            onConvertToInvoice={() => {}}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Generate from Pricing Scope</h2>
            <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {pricingScopes.map(scope => (
                <motion.button
                  key={scope.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => generateProposal.mutate(scope.id)}
                  className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                >
                  <p className="font-medium text-foreground text-sm">{scope.name}</p>
                  <p className="text-xs text-muted-foreground">{scope.client_name}</p>
                  <p className="text-xs text-primary font-bold mt-1">${scope.total.toLocaleString()}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Proposals List */}
          <ProposalList
            proposals={proposals}
            onSelectProposal={(proposal) => {
              setSelectedProposal(proposal);
              setViewMode('preview');
            }}
            onSend={(id) => sendProposal.mutate(id)}
          />
        </div>
      )}
    </div>
  );
}