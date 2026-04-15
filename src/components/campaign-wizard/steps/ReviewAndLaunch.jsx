import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Rocket, TrendingUp, Zap } from 'lucide-react';
import ScoreRing from '@/components/ui-premium/ScoreRing';

export default function ReviewAndLaunch({ data, onComplete, isLastStep }) {
  const campaignReadiness = 92;
  const contentReadiness = 88;
  const healthScore = 90;

  const stats = [
    { label: 'Posts Created', value: '7', icon: '📄' },
    { label: 'Platforms', value: '4', icon: '📱' },
    { label: 'Duration', value: '30 days', icon: '📅' },
    { label: 'Estimated Reach', value: '24.5K', icon: '👁️' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Campaign Ready */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Ready to Launch</h2>
        <p className="text-muted-foreground">
          Your campaign is fully prepared and optimized for maximum impact
        </p>
      </motion.div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <span className="text-3xl block mb-2">{stat.icon}</span>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-bold text-foreground mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Readiness Scores */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">Campaign Readiness</h3>

        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <ScoreRing score={campaignReadiness} size={120} label="Campaign Readiness" />
          </div>
          <div className="flex flex-col items-center">
            <ScoreRing score={contentReadiness} size={120} label="Content Quality" />
          </div>
          <div className="flex flex-col items-center">
            <ScoreRing score={healthScore} size={120} label="Campaign Health" />
          </div>
        </div>
      </div>

      {/* Content Summary */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Content Summary</h3>

        <div className="space-y-3">
          {[
            { type: 'Carousel', count: 2, platforms: 'Instagram' },
            { type: 'Reel / Video', count: 2, platforms: 'Instagram, TikTok, Facebook' },
            { type: 'Caption Post', count: 2, platforms: 'LinkedIn, Facebook' },
            { type: 'Story', count: 1, platforms: 'Instagram' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{item.type}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{item.count}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.platforms}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-secondary/30 border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          What Happens Next
        </h3>
        <ol className="space-y-3">
          {[
            'Campaign launches on schedule',
            'Content posts automatically to all channels',
            'AI monitors engagement and performance',
            'You receive daily performance reports',
            'AI optimizes based on real-time data',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="font-bold text-primary flex-shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Launch Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <Button
          onClick={onComplete}
          className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 text-lg"
        >
          <Rocket className="w-5 h-5" />
          Launch Campaign Now
        </Button>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground">
        Campaign will begin posting on {new Date().toLocaleDateString()}
      </p>
    </motion.div>
  );
}