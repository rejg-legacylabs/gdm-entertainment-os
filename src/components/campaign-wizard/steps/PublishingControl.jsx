import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

const allChannels = [
  { value: 'instagram', label: 'Instagram', icon: '📸', description: 'Feed, Stories, Reels' },
  { value: 'facebook', label: 'Facebook', icon: '👍', description: 'Timeline, Groups' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', description: 'Feed, Articles' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', description: 'Main Feed' },
  { value: 'twitter', label: 'Twitter/X', icon: '𝕏', description: 'Feed, Threads' },
  { value: 'youtube', label: 'YouTube', icon: '▶️', description: 'Community, Shorts' },
];

export default function PublishingControl({ data, onNext }) {
  const [channels, setChannels] = useState(
    data.publishing?.channels || ['instagram', 'facebook', 'linkedin']
  );

  const toggleChannel = (channel) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleAllChannels = () => {
    setChannels(allChannels.map(c => c.value));
  };

  const handleSelectedOnly = () => {
    // Keep only the currently selected
  };

  const handleContinue = () => {
    if (channels.length === 0) {
      alert('Please select at least one channel');
      return;
    }

    onNext({
      publishing: {
        mode: data.publishing?.mode || data.basics?.mode || 'assisted',
        channels,
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Publishing Channels</h2>
        <p className="text-muted-foreground">Choose which platforms to publish your campaign content.</p>
      </div>

      <div className="space-y-6">
        {/* Channel Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allChannels.map((platform, idx) => {
            const isSelected = channels.includes(platform.value);

            return (
              <motion.button
                key={platform.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => toggleChannel(platform.value)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  isSelected
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-secondary/20 border-border hover:border-border/70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{platform.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{platform.label}</p>
                        <p className="text-xs text-muted-foreground">{platform.description}</p>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAllChannels} className="flex-1 text-xs">
            Select All Channels
          </Button>
          <Button
            variant="outline"
            onClick={() => setChannels([])}
            className="flex-1 text-xs"
          >
            Clear All
          </Button>
        </div>

        {/* Publishing Mode Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3"
        >
          <p className="text-xs font-medium text-blue-300">📱 Publishing Mode</p>
          <p className="text-xs text-muted-foreground">
            {data.basics?.mode === 'autopilot'
              ? 'Your content will automatically post to all selected channels on the schedule set in the next step.'
              : data.basics?.mode === 'assisted'
              ? 'You\'ll review and approve each post before it publishes to selected channels.'
              : 'You have full control over when and how content is published to each channel.'}
          </p>
        </motion.div>

        {/* Selected Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-secondary/30 rounded-lg p-4 border border-border"
        >
          <p className="text-sm font-medium text-foreground mb-3">Selected Channels ({channels.length})</p>
          <div className="flex flex-wrap gap-2">
            {channels.length === 0 ? (
              <p className="text-xs text-muted-foreground">No channels selected</p>
            ) : (
              channels.map(channel => {
                const platform = allChannels.find(p => p.value === channel);
                return (
                  <span key={channel} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    {platform?.label}
                  </span>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={channels.length === 0}
          className="gap-2"
        >
          Set Schedule
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}