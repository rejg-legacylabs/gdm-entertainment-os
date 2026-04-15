import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function AutopilotIntro({ onStart, onCancel }) {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Scan sources and extract insights automatically',
    },
    {
      icon: Zap,
      title: 'Content Generation',
      description: 'AI creates captions, CTAs, and hashtags for you',
    },
    {
      icon: TrendingUp,
      title: 'Smart Scheduling',
      description: 'Auto-schedule posts for optimal engagement',
    },
    {
      icon: CheckCircle2,
      title: 'Full Control Options',
      description: 'Choose manual, assisted, or full autopilot mode',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl max-w-2xl w-full p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-2">
            Campaign Autopilot
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Your AI Concierge for Campaign Success
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-secondary/30 rounded-xl p-4 border border-border/50"
              >
                <div className="flex gap-3">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-foreground/80">
            <span className="font-semibold text-primary">7-Step Guided Process:</span> From raw information to fully scheduled campaign. Choose your level of control—from hands-off autopilot to full manual review.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onStart}
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90"
          >
            <Zap className="w-4 h-4" />
            Start Campaign
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}