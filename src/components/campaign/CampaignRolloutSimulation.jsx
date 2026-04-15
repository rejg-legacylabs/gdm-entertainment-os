import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export default function CampaignRolloutSimulation({ campaign, posts = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const startDate = new Date(campaign.start_date);
  const endDate = new Date(campaign.end_date);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const getCurrentDatePosts = () => {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + currentDay);
    const dateStr = currentDate.toISOString().split('T')[0];
    return posts.filter(p => p.scheduled_date?.startsWith(dateStr));
  };

  const getCurrentDate = () => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + currentDay);
    return date;
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      setCurrentDay(prev => prev < totalDays - 1 ? prev + 1 : 0);
    }, 800);
    return () => clearTimeout(timer);
  }, [isPlaying, currentDay, totalDays]);

  const todayPosts = getCurrentDatePosts();
  const currentDate = getCurrentDate();
  const progress = (currentDay / Math.max(totalDays - 1, 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Timeline Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs text-muted-foreground">Day {currentDay + 1} of {totalDays}</span>
        </div>
        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsPlaying(!isPlaying)}
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Play
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentDay(0)}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentDay(Math.min(currentDay + 7, totalDays - 1))}
          className="gap-2"
        >
          <SkipForward className="w-4 h-4" /> +7 Days
        </Button>
      </div>

      {/* Manual Slider */}
      <Slider
        value={[currentDay]}
        onValueChange={([value]) => setCurrentDay(value)}
        max={totalDays - 1}
        step={1}
        className="w-full"
      />

      {/* Posts for Current Day */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Posts Today: {todayPosts.length > 0 ? todayPosts.length : 'None'}
        </h3>
        
        <AnimatePresence mode="wait">
          {todayPosts.length > 0 ? (
            <div className="space-y-2">
              {todayPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 rounded-lg bg-primary/10 border border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground line-clamp-2">{post.caption}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                          {post.platform}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                          {post.content_type}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex-shrink-0 text-lg"
                    >
                      📤
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-lg bg-secondary/30 border border-border/20 text-center"
            >
              <p className="text-sm text-muted-foreground">No posts scheduled for this day</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Campaign Summary */}
      <div className="grid sm:grid-cols-4 gap-3 border-t border-border/30 pt-4">
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">Total Duration</p>
          <p className="font-semibold text-foreground">{totalDays} days</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">Total Posts</p>
          <p className="font-semibold text-foreground">{posts.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">Platforms</p>
          <p className="font-semibold text-foreground">{campaign.platforms?.length || 0}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">Avg Posts/Day</p>
          <p className="font-semibold text-foreground">{(posts.length / totalDays).toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}