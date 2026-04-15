import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { DollarSign, Send, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import InvoicePreview from '@/components/billing/InvoicePreview';
import InvoiceList from '@/components/revenue-ops/InvoiceList';

export default function InvoiceCenter() {
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list(),
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => base44.entities.Proposal.filter({ status: 'approved' }),
  });

  const createInvoice = useMutation({
    mutationFn: async (proposal) => {
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      return await base44.entities.Invoice.create({
        invoice_number: invoiceNumber,
        client_id: proposal.client_id,
        client_name: proposal.client_name,
        campaign_id: proposal.campaign_id,
        campaign_name: proposal.campaign_name,
        invoice_type: 'campaign',
        subtotal: Math.round(proposal.estimated_price * 0.9),
        tax_amount: Math.round(proposal.estimated_price * 0.1),
        total_amount: proposal.estimated_price,
        line_items: [
          {
            description: `${proposal.campaign_name} - Campaign Creation & Management`,
            quantity: 1,
            unit_price: Math.round(proposal.estimated_price * 0.9),
            amount: Math.round(proposal.estimated_price * 0.9),
          },
        ],
        status: 'draft',
        payment_status: 'unpaid',
        due_date: dueDate.toISOString().split('T')[0],
        issued_date: new Date().toISOString().split('T')[0],
        payment_terms: 'Net 30',
        client_notes: `Please remit payment to activate campaign launch for ${proposal.campaign_name}.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const sendInvoice = useMutation({
    mutationFn: async (invoiceId) => {
      return await base44.entities.Invoice.update(invoiceId, { status: 'sent' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const markPaid = useMutation({
    mutationFn: async (invoiceId) => {
      return await base44.entities.Invoice.update(invoiceId, {
        status: 'paid',
        payment_status: 'paid',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="Invoice Center"
        subtitle="Create, send, and track invoices"
        icon={DollarSign}
      />

      {selectedInvoice && viewMode === 'preview' ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setViewMode('list')}
            className="mb-4"
          >
            ← Back to List
          </Button>
          <InvoicePreview
            invoice={selectedInvoice}
            onSend={() => sendInvoice.mutate(selectedInvoice.id)}
            onDownload={() => {}}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Create from Proposal */}
          {proposals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-6"
            >
              <h2 className="font-semibold text-foreground mb-4">Create Invoice from Approved Proposal</h2>
              <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {proposals.map(proposal => (
                  <motion.button
                    key={proposal.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => createInvoice.mutate(proposal)}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                  >
                    <p className="font-medium text-foreground text-sm">{proposal.proposal_number}</p>
                    <p className="text-xs text-muted-foreground">{proposal.client_name}</p>
                    <p className="text-xs text-primary font-bold mt-1">${proposal.estimated_price.toLocaleString()}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Invoices Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
              <TabsTrigger value="all">All Invoices</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <InvoiceList
                invoices={invoices}
                onSelectInvoice={(invoice) => {
                  setSelectedInvoice(invoice);
                  setViewMode('preview');
                }}
                onSend={(id) => sendInvoice.mutate(id)}
                onMarkPaid={(id) => markPaid.mutate(id)}
              />
            </TabsContent>

            <TabsContent value="draft">
              <InvoiceList
                invoices={invoices.filter(i => i.status === 'draft')}
                onSelectInvoice={(invoice) => {
                  setSelectedInvoice(invoice);
                  setViewMode('preview');
                }}
                onSend={(id) => sendInvoice.mutate(id)}
              />
            </TabsContent>

            <TabsContent value="unpaid">
              <InvoiceList
                invoices={invoices.filter(i => i.payment_status === 'unpaid')}
                onSelectInvoice={(invoice) => {
                  setSelectedInvoice(invoice);
                  setViewMode('preview');
                }}
                onMarkPaid={(id) => markPaid.mutate(id)}
              />
            </TabsContent>

            <TabsContent value="paid">
              <InvoiceList
                invoices={invoices.filter(i => i.payment_status === 'paid')}
                onSelectInvoice={(invoice) => {
                  setSelectedInvoice(invoice);
                  setViewMode('preview');
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}