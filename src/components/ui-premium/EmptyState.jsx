import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel,
  secondaryAction,
  secondaryLabel,
  variant = 'default' 
}) {
  const variants = {
    default: {
      bg: 'bg-card',
      border: 'border-border',
      iconColor: 'text-muted-foreground',
    },
    premium: {
      bg: 'bg-gradient-to-br from-primary/5 to-accent/5',
      border: 'border-primary/20',
      iconColor: 'text-primary',
    },
  };

  const style = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border p-12 text-center',
        style.bg,
        style.border
      )}
    >
      {Icon && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-4"
        >
          <Icon className={cn('w-12 h-12 mx-auto', style.iconColor)} />
        </motion.div>
      )}

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>

      <div className="flex justify-center gap-3">
        {action && (
          <Button onClick={action} className="gap-2">
            {actionLabel}
          </Button>
        )}
        {secondaryAction && (
          <Button onClick={secondaryAction} variant="outline">
            {secondaryLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}