import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SchedulingSetup({ data, onNext }) {
  const [scheduleMode, setScheduleMode] = useState('auto');
  const [cadence, setCadence] = useState('balanced');

  const scheduleOptions = [
    {
      id: 'auto',
      title: 'Auto-Schedule Everything',
      description: 'AI finds optimal posting times and fills your calendar automatically',
      icon: '⚡',
    },
    {
      id: 'suggested',
      title: 'Review & Approve',
      description: 'AI suggests times, you approve the schedule before publishing',
      icon: '👁️',
    },
    {
      id: 'manual',
      title: 'Manual Schedule',
      description: 'You choose each posting time on the calendar',
      icon: '✋',
    },
  ];

  const cadenceOptions = {
    light: { label: 'Light', description: '2-3 posts per week', posts: 4 },
    balanced: { label: 'Balanced', description: '4-5 posts per week', posts: 7 },
    aggressive: { label: 'Aggressive', description: '6-7+ posts per week', posts: 10 },
  };

  const handleSubmit = () => {
    onNext({
      schedule: {
        mode: scheduleMode,
        cadence,
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Schedule Mode */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Campaign Schedule</h2>

        <div className="space-y-3 mb-8">
          {scheduleOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setScheduleMode(option.id)}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                scheduleMode === option.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/80'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                </div>
                {scheduleMode === option.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cadence Selection */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Content Cadence
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          How frequently should content be posted across your channels?
        </p>

        <div className="space-y-3">
          {Object.entries(cadenceOptions).map(([key, { label, description, posts }]) => (
            <button
              key={key}
              onClick={() => setCadence(key)}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                cadence === key
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/80'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{label} Cadence</p>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  <p className="text-xs text-muted-foreground mt-2">≈ {posts} posts for a 30-day campaign</p>
                </div>
                {cadence === key && (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Preview */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Schedule Preview
        </h3>

        <div className="space-y-2">
          {['Monday 9:00 AM', 'Wednesday 2:00 PM', 'Friday 4:30 PM', 'Sunday 11:00 AM'].map((time, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-foreground">{time}</span>
            </motion.div>
          ))}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mt-3">
              AI will optimize posting times based on audience timezone and engagement history
            </p>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6">
          Continue to Review & Launch
        </Button>
      </div>
    </motion.div>
  );
}