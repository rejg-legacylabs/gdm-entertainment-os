import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Database, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DataLinkageViewer({ client, campaign, proposal, invoice, launchGate, payment }) {
  const [expandedRecord, setExpandedRecord] = useState(null);

  const records = [
    { type: 'Client', data: client, color: 'blue' },
    { type: 'Campaign', data: campaign, color: 'purple' },
    { type: 'Proposal', data: proposal, color: 'cyan' },
    { type: 'Invoice', data: invoice, color: 'amber' },
    { type: 'Launch Gate', data: launchGate, color: 'emerald' },
    { type: 'Payment', data: payment, color: 'sky' },
  ].filter(r => r.data);

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      sky: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    };
    return colors[color];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Data Linkage Map</h3>
      </div>

      <div className="space-y-2">
        {records.map((record, idx) => (
          <motion.div
            key={record.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="space-y-2"
          >
            {/* Record Card */}
            <button
              onClick={() => setExpandedRecord(expandedRecord === record.type ? null : record.type)}
              className={`w-full p-4 rounded-lg border transition-colors ${getColorClass(record.color)} hover:opacity-80`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 text-left">
                  <p className="font-semibold">{record.type}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {record.data?.name || record.data?.proposal_number || record.data?.invoice_number || record.data?.id?.slice(0, 8)}
                  </p>
                </div>
                <ChevronRight className={cn(
                  'w-4 h-4 transition-transform flex-shrink-0',
                  expandedRecord === record.type && 'rotate-90'
                )} />
              </div>
            </button>

            {/* Links to Other Records */}
            {record.data && (
              <AnimatePresence>
                {expandedRecord === record.type && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-4 space-y-2 overflow-hidden"
                  >
                    {/* Links Summary */}
                    <div className="text-xs space-y-1">
                      {record.type === 'Client' && (
                        <>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Campaigns: {campaign?.id === record.data.id ? '1' : '0'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Proposals: {proposal?.client_id === record.data.id ? '1' : '0'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Invoices: {invoice?.client_id === record.data.id ? '1' : '0'}</span>
                          </div>
                        </>
                      )}

                      {record.type === 'Campaign' && (
                        <>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Client: {record.data.brand_id ? '✓ Linked' : '✗ Missing'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Proposal: {proposal?.campaign_id === record.data.id ? '✓ Linked' : '✗ Missing'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Launch Gate: {launchGate?.campaign_id === record.data.id ? '✓ Linked' : '✗ Missing'}</span>
                          </div>
                        </>
                      )}

                      {record.type === 'Proposal' && (
                        <>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Campaign: {record.data.campaign_id ? '✓ Linked' : '✗ Missing'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Invoice: {invoice?.proposal_id === record.data.id ? '✓ Linked' : 'Pending'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Total: ${record.data.estimated_price?.toLocaleString() || '0'}</span>
                          </div>
                        </>
                      )}

                      {record.type === 'Invoice' && (
                        <>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Proposal: {record.data.proposal_id ? '✓ Linked' : 'Pending'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Payment Status: {record.data.payment_status}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Total: ${record.data.total_amount?.toLocaleString() || '0'}</span>
                          </div>
                        </>
                      )}

                      {record.type === 'Launch Gate' && (
                        <>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Campaign: {record.data.campaign_id ? '✓ Linked' : '✗ Missing'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Invoice: {record.data.invoice_id ? '✓ Linked' : 'Pending'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Can Launch: {record.data.can_launch ? '✓ Yes' : '✗ No'}</span>
                          </div>
                        </>
                      )}

                      {record.type === 'Payment' && (
                        <>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Invoice: {record.data.invoice_id ? '✓ Linked' : '✗ Missing'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Amount: ${record.data.amount?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="w-3 h-3" />
                            <span>Status: {record.data.status}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        ))}
      </div>

      {/* Validation Summary */}
      <div className="p-4 rounded-lg bg-secondary/30 mt-4">
        <p className="text-sm font-semibold text-foreground mb-2">Validation Summary</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className={proposal?.estimated_price === invoice?.total_amount ? '✓' : '✗'}>
              Proposal total matches invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={invoice?.payment_status === 'paid' && launchGate?.can_launch ? '✓' : '✗'}>
              Payment status syncs to launch gate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={campaign && launchGate?.campaign_id === campaign.id ? '✓' : '✗'}>
              Campaign links to launch gate
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}