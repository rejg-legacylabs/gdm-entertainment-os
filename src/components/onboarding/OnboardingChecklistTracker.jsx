import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function OnboardingChecklistTracker({ session, items = [] }) {
  const totalItems = items.length;
  const completedItems = items.filter(i => i.is_completed).length;
  const mandatoryItems = items.filter(i => i.is_mandatory);
  const mandatoryCompleted = mandatoryItems.filter(i => i.is_completed).length;
  const completionPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const allMandatoryComplete = mandatoryCompleted === mandatoryItems.length;

  const categoryGroups = {};
  items.forEach(item => {
    if (!categoryGroups[item.item_category]) {
      categoryGroups[item.item_category] = [];
    }
    categoryGroups[item.item_category].push(item);
  });

  const categoryLabels = {
    brand_info: '🏢 Brand Information',
    billing_info: '💳 Billing Information',
    approvals_contact: '👤 Approvals Contact',
    connected_accounts: '📱 Connected Accounts',
    assets_uploaded: '📁 Assets & Branding',
    strategy_defined: '📊 Strategy & Goals',
    package_assigned: '📦 Package Selection',
    permissions_configured: '🔐 Permissions',
    launch_rules_configured: '🚀 Launch Rules',
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Onboarding Progress</h3>
          <span className="text-sm text-muted-foreground">{completedItems} of {totalItems} complete</span>
        </div>
        <Progress value={completionPercent} className="h-2" />
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-muted-foreground">{completionPercent}% Complete</span>
          {!allMandatoryComplete && mandatoryItems.length > 0 && (
            <span className="text-amber-400">
              {mandatoryItems.length - mandatoryCompleted} required items remaining
            </span>
          )}
          {allMandatoryComplete && (
            <span className="text-emerald-400">Ready for operations!</span>
          )}
        </div>
      </div>

      {/* Checklists by Category */}
      <div className="space-y-4">
        {Object.entries(categoryGroups).map(([category, categoryItems], catIdx) => {
          const catCompleted = categoryItems.filter(i => i.is_completed).length;
          const catTotal = categoryItems.length;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="glass-panel rounded-lg p-4 border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground text-sm">{categoryLabels[category]}</h4>
                <span className="text-xs text-muted-foreground">{catCompleted}/{catTotal}</span>
              </div>

              <div className="space-y-2">
                {categoryItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {item.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : item.is_mandatory ? (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm ${item.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.item_label}
                      </p>
                      {item.item_description && !item.is_completed && (
                        <p className="text-xs text-muted-foreground mt-1">{item.item_description}</p>
                      )}
                      {item.evidence && item.is_completed && (
                        <p className="text-xs text-muted-foreground mt-1">✓ {item.evidence}</p>
                      )}
                      {item.blocked_reason && (
                        <p className="text-xs text-red-400 mt-1">Blocked: {item.blocked_reason}</p>
                      )}
                    </div>

                    {item.is_mandatory && !item.is_completed && (
                      <Badge className="bg-amber-500/20 text-amber-400 text-xs ml-auto flex-shrink-0">
                        Required
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}