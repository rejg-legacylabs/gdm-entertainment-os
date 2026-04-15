import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Upload, Sparkles, Loader2, Film, Scissors, Quote, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';

export default function VideoStudio() {
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeVideo = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an elite video content strategist. Analyze this video transcript and provide a comprehensive repurposing plan.

Transcript: ${transcript}

Provide a JSON response with:
- summary: 2-3 sentence summary
- strongest_moments: array of 3-5 key moments with timestamps if visible
- clip_suggestions: array of 3-5 clip ideas for short-form content
- social_hooks: array of 5 attention-grabbing hooks
- teaser_copy: 3 teaser/trailer style captions
- post_captions: 3 full social media captions
- quote_cards: 3 quotable moments
- thumbnail_ideas: 3 thumbnail/title suggestions
- reel_ideas: 3 reel/shorts concepts`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          strongest_moments: { type: 'array', items: { type: 'string' } },
          clip_suggestions: { type: 'array', items: { type: 'string' } },
          social_hooks: { type: 'array', items: { type: 'string' } },
          teaser_copy: { type: 'array', items: { type: 'string' } },
          post_captions: { type: 'array', items: { type: 'string' } },
          quote_cards: { type: 'array', items: { type: 'string' } },
          thumbnail_ideas: { type: 'array', items: { type: 'string' } },
          reel_ideas: { type: 'array', items: { type: 'string' } },
        }
      }
    });
    setAnalysis(result);
    setLoading(false);
  };

  const sections = analysis ? [
    { title: 'Summary', icon: Film, items: [analysis.summary] },
    { title: 'Strongest Moments', icon: Sparkles, items: analysis.strongest_moments || [] },
    { title: 'Clip Suggestions', icon: Scissors, items: analysis.clip_suggestions || [] },
    { title: 'Social Hooks', icon: Lightbulb, items: analysis.social_hooks || [] },
    { title: 'Teaser Copy', icon: Film, items: analysis.teaser_copy || [] },
    { title: 'Post Captions', icon: Quote, items: analysis.post_captions || [] },
    { title: 'Quote Cards', icon: Quote, items: analysis.quote_cards || [] },
    { title: 'Thumbnail Ideas', icon: Film, items: analysis.thumbnail_ideas || [] },
    { title: 'Reel / Shorts Ideas', icon: Video, items: analysis.reel_ideas || [] },
  ] : [];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Video className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Creator Suite</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Video Studio</h1>
        <p className="text-muted-foreground mt-1">AI-powered video repurposing engine</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Video Transcript Input
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Paste your video transcript below and our AI will extract social media assets from it.
            </p>
            <Textarea
              className="bg-secondary border-border min-h-[200px] mb-4"
              placeholder="Paste your video transcript here..."
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
            />
            <Button onClick={analyzeVideo} disabled={loading || !transcript.trim()} className="w-full bg-primary text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Analyze & Repurpose
            </Button>
          </div>

          {analysis && (
            <div className="space-y-4">
              {sections.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-xl p-5"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <section.icon className="w-4 h-4 text-primary" /> {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, j) => (
                      <div key={j} className="bg-secondary/50 rounded-lg p-3 text-sm text-foreground/90">{item}</div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <AIInsightPanel
            title="Video AI Director"
            insights={[
              { title: 'Short-form clips get 5x more reach', description: 'Extract 15-30 second clips for Instagram Reels and TikTok.', category: 'growth', priority: 'high' },
              { title: 'Add subtitles for accessibility', description: '85% of social video is watched without sound. Always include captions.', category: 'strategy', priority: 'medium' },
              { title: 'First 3 seconds are critical', description: 'Hook viewers immediately with your strongest visual or statement.', category: 'content', priority: 'high' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}