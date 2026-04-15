import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InvoicePreview({ invoice, campaign, client, onSend, onDownload }) {
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
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Invoice</p>
            <h1 className="text-3xl font-bold text-foreground font-display">{invoice.invoice_number}</h1>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">${invoice.total_amount.toLocaleString()}</p>
            <p className={`text-sm font-semibold mt-2 capitalize ${
              invoice.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {invoice.payment_status}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 border-t border-border/30 pt-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Bill To</p>
            <p className="font-semibold text-foreground">{client?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{client?.contact_email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-2">Invoice Details</p>
            <p className="text-sm text-foreground">Issued: {invoice.issued_date}</p>
            <p className="text-sm text-foreground">Due: {invoice.due_date}</p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 bg-secondary/50 border-b border-border/30 font-semibold text-foreground text-sm">
          <div>Description</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Price</div>
          <div className="text-right">Amount</div>
        </div>

        <div className="p-4 space-y-3">
          {invoice.line_items?.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 py-2 border-b border-border/30 last:border-0">
              <div className="text-sm text-foreground">{item.description}</div>
              <div className="text-sm text-right text-muted-foreground">{item.quantity}</div>
              <div className="text-sm text-right text-muted-foreground">${item.unit_price.toLocaleString()}</div>
              <div className="text-sm text-right font-medium text-foreground">${item.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="p-4 bg-secondary/30 border-t border-border/30 space-y-2">
          <div className="flex justify-end gap-4">
            <span className="text-sm text-muted-foreground">Subtotal:</span>
            <span className="text-sm font-medium text-foreground">${(invoice.total_amount - (invoice.tax_amount || 0)).toLocaleString()}</span>
          </div>
          {invoice.tax_amount > 0 && (
            <div className="flex justify-end gap-4">
              <span className="text-sm text-muted-foreground">Tax:</span>
              <span className="text-sm font-medium text-foreground">${invoice.tax_amount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-end gap-4 pt-2 border-t border-border/30">
            <span className="text-lg font-bold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">${invoice.total_amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.client_notes && (
        <div className="glass-panel rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Notes</p>
          <p className="text-sm text-foreground">{invoice.client_notes}</p>
        </div>
      )}

      {/* Campaign Reference */}
      {campaign && (
        <div className="glass-panel rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Campaign</p>
          <p className="font-medium text-foreground">{campaign.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{campaign.objective}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onDownload}
          variant="outline"
          className="flex-1 gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        {invoice.status === 'draft' && (
          <Button
            onClick={onSend}
            className="flex-1 bg-primary hover:bg-primary/90 gap-2"
          >
            <Send className="w-4 h-4" />
            Send to Client
          </Button>
        )}
      </div>
    </motion.div>
  );
}