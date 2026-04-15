import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Zap, TrendingUp } from 'lucide-react';

const scoreColors = {
  high: 'text-green-400',
  medium: 'text-amber-400',
  low: 'text-red-400',
};

export default function ReviewAndLaunch({ data, onNext, onComplete }) {
  const [isLaunching, setIsLaunching] = useState(false);

  const calculateScores = () => {
    const contentQuality = Math.min(100, 70 + data.content.length * 5);
    const campaignReadiness = Math.min(100, 65 + (data.publishing.channels.length * 5) + (data.schedule.autoSchedule ? 10 : 0));
    const overall = Math.round((contentQuality + campaignReadiness) / 2);

    return {
      contentQuality: Math.round(contentQuality),
      campaignReadiness: Math.round(campaignReadiness),
      overall: overall,
    };
  };

  const scores = calculateScores();
  const isReadyToLaunch = scores.overall >= 70;

  const handleLaunch = async () => {
    setIsLaunching(true);
    // Simulate launch process
    await new Promise(r => setTimeout(r, 1500));
    onComplete(data);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return scoreColors.high;
    if (score >= 60) return scoreColors.medium;
    return scoreColors.low;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Review & Launch</h2>
        <p className="text-muted-foreground">Review your campaign configuration before launching.</p>
      </div>

      <div className="space-y-6">
        {/* Campaign Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/30 border border-border rounded-lg p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Campaign Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="text-foreground font-medium">{data.basics.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Brand</p>
              <p className="text-foreground font-medium">{data.basics.brand}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Goal</p>
              <p className="text-foreground font-medium capitalize">{data.basics.goal}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Duration</p>
              <p className="text-foreground font-medium">{data.basics.duration} days</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Mode</p>
              <p className="text-foreground font-medium capitalize">{data.basics.mode}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Content Pieces</p>
              <p className="text-foreground font-medium">{data.content.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Platforms</p>
              <p className="text-foreground font-medium">{data.publishing.channels.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cadence</p>
              <p className="text-foreground font-medium capitalize">{data.schedule.cadence}</p>
            </div>
          </div>
        </motion.div>

        {/* Readiness Scores */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-foreground">Campaign Readiness</h3>
          
          {/* Overall Score */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className={`w-5 h-5 ${getScoreColor(scores.overall)}`} />
              <p className="text-sm text-muted-foreground">Overall Readiness</p>
            </div>
            <p className={`text-5xl font-bold ${getScoreColor(scores.overall)}`}>{scores.overall}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              {scores.overall >= 80 ? '✨ Ready to launch!' : scores.overall >= 60 ? '⚠️ Good, but could improve' : '❌ Needs more work'}
            </p>
          </div>

          {/* Individual Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Content Quality</p>
              <p className={`text-3xl font-bold ${getScoreColor(scores.contentQuality)}`}>
                {scores.contentQuality}%
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Campaign Readiness</p>
              <p className={`text-3xl font-bold ${getScoreColor(scores.campaignReadiness)}`}>
                {scores.campaignReadiness}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        {!isReadyToLaunch && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Campaign could be improved</p>
              <p className="text-xs text-muted-foreground mt-1">
                Consider adding more content pieces or selecting additional platforms to increase campaign impact.
              </p>
            </div>
          </motion.div>
        )}

        {/* Platform Summary */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm font-medium text-foreground mb-3">Publishing Platforms</p>
          <div className="flex flex-wrap gap-2">
            {data.publishing.channels.map(channel => (
              <span key={channel} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium capitalize">
                {channel}
              </span>
            ))}
          </div>
        </div>

        {/* Mode Badge */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Campaign Mode: {data.basics.mode === 'autopilot' ? '🤖 Full Autopilot' : data.basics.mode === 'assisted' ? '🤝 AI Assisted' : '👤 Manual'}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {data.basics.mode === 'autopilot' 
              ? 'AI will handle all posting and optimization.'
              : data.basics.mode === 'assisted'
              ? 'AI recommends actions, you approve before posting.'
              : 'You have full control over all campaign elements.'}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
          Back to Edit
        </Button>
        <Button
          onClick={handleLaunch}
          disabled={isLaunching}
          className={`flex-1 gap-2 ${isReadyToLaunch ? 'bg-green-500 hover:bg-green-600' : 'bg-primary'}`}
        >
          {isLaunching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Launch Campaign
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}