import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';

export default function PremiumWelcome({ onDismiss }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      title: 'Welcome to Campaign Autopilot',
      description: 'Your AI-powered campaign builder is ready to transform how you create content at scale.',
      highlight: 'Campaign Autopilot',
    },
    {
      icon: Zap,
      title: 'AI Guides Every Step',
      description: 'From campaign basics to content generation, AI provides smart recommendations and handles the heavy lifting.',
      highlight: 'AI Intelligence',
    },
    {
      icon: Target,
      title: 'Build Campaigns in Minutes',
      description: 'Provide sources, let AI analyze, generate content, and schedule posts—all in one seamless flow.',
      highlight: 'Quick Setup',
    },
    {
      icon: TrendingUp,
      title: 'Optimize in Real-Time',
      description: 'Monitor performance, get AI insights, and let automation maximize your campaign results.',
      highlight: 'Smart Optimization',
    },
  ];

  const currentStep = steps[step];
  const CurrentIcon = currentStep.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-border rounded-2xl p-8 max-w-md w-full"
        >
          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="text-center">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <CurrentIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{currentStep.title}</h2>
              <p className="text-muted-foreground mb-4">{currentStep.description}</p>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {currentStep.highlight}
              </span>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 my-8">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === step ? 24 : 8,
                    backgroundColor: i <= step ? 'rgb(42, 179, 141)' : 'rgb(100, 116, 139)',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full cursor-pointer"
                  onClick={() => setStep(i)}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={onDismiss}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                >
                  Start Building
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}