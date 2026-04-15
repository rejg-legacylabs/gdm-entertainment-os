import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Copy, Shuffle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CampaignBuild({ onNext }) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(new Set());

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setContent([
        {
          id: 1,
          type: 'carousel',
          platform: 'Instagram',
          title: 'Lives Changed Gallery',
          caption: '📸 Meet the people whose lives have been transformed...',
          draft: 'Before and after stories of program participants',
          generated: true,
        },
        {
          id: 2,
          type: 'video',
          platform: 'Instagram',
          title: 'Sarah\'s Story - 60s',
          caption: '🎬 One person. One opportunity. One life changed.',
          draft: 'Video testimonial from program graduate',
          generated: true,
        },
        {
          id: 3,
          type: 'caption',
          platform: 'LinkedIn',
          title: 'Impact by the Numbers',
          caption: '📊 In just 6 months, we\'ve impacted 150+ lives...',
          draft: 'Post about measurable campaign results',
          generated: true,
        },
        {
          id: 4,
          type: 'reel',
          platform: 'Instagram',
          title: 'Day in the Life',
          caption: '🌅 A day in the life of our team making a difference',
          draft: '15-second behind-the-scenes reel',
          generated: true,
        },
        {
          id: 5,
          type: 'story',
          platform: 'Instagram',
          title: 'Testimonial Poll',
          caption: 'Help us celebrate! Which story moved you most?',
          draft: 'Interactive story with poll stickers',
          generated: true,
        },
      ]);
      setIsGenerating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const toggleContent = (id) => {
    const newSelected = new Set(selectedContent);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContent(newSelected);
  };

  if (isGenerating) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">AI is building your campaign</h2>
          <p className="text-muted-foreground mb-8">
            Creating captions, drafting posts, and suggesting content structure...
          </p>

          <div className="space-y-3 max-w-sm mx-auto">
            {[
              { label: 'Generating post ideas...', done: true },
              { label: 'Writing captions...', done: true },
              { label: 'Creating platform variants...', done: false },
              { label: 'Finalizing content...', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {item.done ? (
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                )}
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">AI Generated Content</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select the content pieces you want to include in your campaign. You can edit them later.
        </p>

        <div className="space-y-3">
          {content.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => toggleContent(item.id)}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all flex items-start gap-4',
                selectedContent.has(item.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/80'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border-2',
                selectedContent.has(item.id)
                  ? 'bg-primary border-primary'
                  : 'border-border'
              )}>
                {selectedContent.has(item.id) && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {item.type}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {item.platform}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.caption}</p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // Edit action
                }}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
          <p className="text-sm text-foreground font-medium mb-1">
            {selectedContent.size} of {content.length} pieces selected
          </p>
          <p className="text-xs text-muted-foreground">Select at least 3 pieces to proceed</p>
        </div>

        <Button onClick={() => onNext({ content: Array.from(selectedContent) })} className="w-full mt-6" disabled={selectedContent.size < 3}>
          Continue to Publishing Control
        </Button>
      </div>
    </motion.div>
  );
}