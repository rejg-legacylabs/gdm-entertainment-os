import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublishingControl({ data, onNext }) {
  const [publishingMode, setPublishingMode] = useState('assisted');
  const [selectedChannels, setSelectedChannels] = useState(new Set(['instagram', 'facebook']));

  const channels = [
    { id: 'instagram', label: 'Instagram', icon: '📸', color: 'bg-pink-500/20 border-pink-500/30' },
    { id: 'facebook', label: 'Facebook', icon: '👥', color: 'bg-blue-500/20 border-blue-500/30' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-sky-500/20 border-sky-500/30' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'bg-slate-500/20 border-slate-500/30' },
    { id: 'youtube', label: 'YouTube', icon: '🎥', color: 'bg-red-500/20 border-red-500/30' },
    { id: 'twitter', label: 'Twitter / X', icon: '𝕏', color: 'bg-gray-500/20 border-gray-500/30' },
  ];

  const modeDescriptions = {
    manual: {
      title: 'Manual Publishing',
      description: 'Review every post before it goes live. Full control, more time investment.',
      icon: '✋',
    },
    assisted: {
      title: 'Assisted Publishing',
      description: 'AI prepares posts, you approve before publishing. Balanced approach.',
      icon: '🤝',
    },
    autopilot: {
      title: 'Full Autopilot',
      description: 'AI creates, schedules, and publishes automatically. Maximum efficiency.',
      icon: '🚀',
    },
  };

  const toggleChannel = (id) => {
    const newChannels = new Set(selectedChannels);
    if (newChannels.has(id)) {
      newChannels.delete(id);
    } else {
      newChannels.add(id);
    }
    setSelectedChannels(newChannels);
  };

  const handleSubmit = () => {
    onNext({
      publishing: {
        mode: publishingMode,
        channels: Array.from(selectedChannels),
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Publishing Mode */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Publishing Control</h2>

        <div className="space-y-3 mb-8">
          {Object.entries(modeDescriptions).map(([key, { title, description, icon }]) => (
            <button
              key={key}
              onClick={() => setPublishingMode(key)}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                publishingMode === key
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/80'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-0.5">{icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                {publishingMode === key && (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Channel Selection */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Where to publish?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select which social channels you want to publish to. AI will optimize content for each platform.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => toggleChannel(channel.id)}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all flex items-start justify-between',
                selectedChannels.has(channel.id)
                  ? `border-primary ${channel.color.split(' ')[0]}`
                  : 'border-border hover:border-border/80'
              )}
            >
              <div>
                <span className="text-2xl block mb-2">{channel.icon}</span>
                <p className="font-medium text-foreground text-sm">{channel.label}</p>
              </div>
              {selectedChannels.has(channel.id) && (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
          <p className="text-sm text-foreground font-medium">
            {selectedChannels.size} channel{selectedChannels.size !== 1 ? 's' : ''} selected
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Content will be adapted for each platform automatically
          </p>
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6" disabled={selectedChannels.size === 0}>
          Continue to Scheduling
        </Button>
      </div>
    </motion.div>
  );
}