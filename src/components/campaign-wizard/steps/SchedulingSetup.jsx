import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Zap } from 'lucide-react';

const cadenceOptions = [
  { value: 'light', label: 'Light', description: '2-3 posts per week', posts: 'Daily variation' },
  { value: 'balanced', label: 'Balanced', description: '3-5 posts per week', posts: 'Consistent engagement' },
  { value: 'aggressive', label: 'Aggressive', description: '5-7 posts per week', posts: 'Maximum reach' },
];

export default function SchedulingSetup({ data, onNext }) {
  const [scheduling, setScheduling] = useState({
    cadence: data.schedule?.cadence || 'balanced',
    autoSchedule: data.schedule?.autoSchedule !== false,
    startDate: data.schedule?.startDate || new Date().toISOString().split('T')[0],
  });

  const handleContinue = () => {
    onNext({
      schedule: scheduling,
    });
  };

  const postsPerWeek = {
    light: 2.5,
    balanced: 4,
    aggressive: 6,
  };

  const campaignDuration = data.basics?.duration || 30;
  const totalPostsNeeded = Math.ceil((campaignDuration / 7) * postsPerWeek[scheduling.cadence]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Schedule Setup</h2>
        <p className="text-muted-foreground">Configure posting frequency and let AI handle the schedule.</p>
      </div>

      <div className="space-y-6">
        {/* Cadence Selection */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Posting Cadence</p>
          <div className="grid grid-cols-1 gap-3">
            {cadenceOptions.map((option, idx) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setScheduling(p => ({ ...p, cadence: option.value }))}
                className={`p-4 rounded-lg border transition-all text-left ${
                  scheduling.cadence === option.value
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-secondary/20 border-border hover:border-border/70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                    <p className="text-xs text-primary/80 mt-1">📊 {option.posts}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                    scheduling.cadence === option.value
                      ? 'bg-primary border-primary'
                      : 'border-border'
                  }`} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Auto Schedule Option */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-primary/10 border border-primary/20 rounded-lg p-4"
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={scheduling.autoSchedule}
              onChange={(e) => setScheduling(p => ({ ...p, autoSchedule: e.target.checked }))}
              className="mt-1"
            />
            <div>
              <p className="text-sm font-medium text-foreground">Auto-Schedule Posts</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {scheduling.autoSchedule
                  ? 'AI will automatically schedule posts based on optimal engagement times.'
                  : 'You\'ll manually approve and schedule each post.'}
              </p>
            </div>
          </label>
        </motion.div>

        {/* Campaign Schedule Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/30 rounded-lg p-4 border border-border space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Schedule Summary</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Campaign Duration</p>
              <p className="text-foreground font-semibold">{campaignDuration} days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Posting Frequency</p>
              <p className="text-foreground font-semibold">
                {postsPerWeek[scheduling.cadence].toFixed(1)}/week
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Posts Needed</p>
              <p className="text-foreground font-semibold">{totalPostsNeeded} posts</p>
            </div>
            <div>
              <p className="text-muted-foreground">Your Content Pieces</p>
              <p className="text-foreground font-semibold">{data.content?.length || 0} pieces</p>
            </div>
          </div>

          {totalPostsNeeded > (data.content?.length || 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-2 bg-amber-500/10 rounded border border-amber-500/20"
            >
              <p className="text-xs text-amber-300">
                ⚠️ You may need {totalPostsNeeded - (data.content?.length || 0)} more content pieces for optimal posting frequency.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Autopilot Info */}
        {data.basics?.mode === 'autopilot' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3"
          >
            <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Autopilot Mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                AI will automatically schedule and post your content according to the cadence and optimal engagement times.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleContinue} className="gap-2">
          Review & Launch
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}