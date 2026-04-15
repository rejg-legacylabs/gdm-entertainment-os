import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PricingBreakdown({ lineItems, subtotal, tax, total, monthlyTotal, model }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (service) => {
    setExpandedItems(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6 space-y-4 sticky top-24"
    >
      <h2 className="font-semibold text-foreground">Pricing Breakdown</h2>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {lineItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => toggleItem(item.service)}
            className="w-full text-left p-2 rounded hover:bg-secondary/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground capitalize">{item.service.replace(/_/g, ' ')}</p>
                <p className="text-xs text-muted-foreground">{item.qty} × ${item.price.toLocaleString()}</p>
              </div>
              <p className="font-semibold text-primary">${item.total.toLocaleString()}</p>
            </div>
            <ChevronDown className={cn(
              'w-3 h-3 text-muted-foreground transition-transform mt-1',
              expandedItems[item.service] && 'rotate-180'
            )} />
          </button>
        ))}
      </div>

      <div className="border-t border-border/30 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-medium text-foreground">${tax.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">Total Campaign Price</p>
        <p className="text-3xl font-bold text-primary">${total.toLocaleString()}</p>
        {model === 'one_time_campaign' && (
          <p className="text-xs text-muted-foreground mt-2">or ${Math.round(monthlyTotal).toLocaleString()}/month</p>
        )}
      </div>
    </motion.div>
  );
}