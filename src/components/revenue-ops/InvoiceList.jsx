import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Send, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function InvoiceList({ invoices, onSelectInvoice, onSend, onMarkPaid }) {
  const statusColors = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    paid: 'bg-emerald-500/20 text-emerald-400',
    unpaid: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6"
    >
      {invoices.length === 0 ? (
        <div className="py-12 text-center">
          <DollarSign className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No invoices in this view</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice, idx) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-foreground">{invoice.invoice_number}</p>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize font-medium', 
                      statusColors[invoice.payment_status] || statusColors['unpaid']
                    )}>
                      {invoice.payment_status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.client_name} • {invoice.campaign_name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm font-bold text-primary">${invoice.total_amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Due: {invoice.due_date}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectInvoice(invoice)}
                    className="gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                  {invoice.status === 'draft' && onSend && (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 gap-1"
                      onClick={() => onSend(invoice.id)}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </Button>
                  )}
                  {invoice.payment_status === 'unpaid' && onMarkPaid && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkPaid(invoice.id)}
                      className="gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Paid
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