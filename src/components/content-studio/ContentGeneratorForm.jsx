import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

const platforms = ['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'twitter'];
const contentTypes = ['caption', 'event_promotion', 'donor_campaign', 'fundraising', 'nonprofit_storytelling', 'housing_awareness', 'recruiting', 'job_opportunity', 'testimonial', 'community_engagement', 'call_to_action', 'hook_variation', 'carousel_idea', 'reel_idea', 'story_sequence'];
const tones = ['bold', 'premium', 'compassionate', 'inspiring', 'empowering', 'direct', 'viral', 'professional', 'casual', 'urgent'];

export default function ContentGeneratorForm({
  brand,
  setBrand,
  platform,
  setPlatform,
  contentType,
  setContentType,
  tone,
  setTone,
  topic,
  setTopic,
  onGenerate,
  loading,
  brands,
  selectedBrand,
}) {
  const isComplete = brand && platform && topic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Wand2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Content Generator</h3>
      </div>

      <div className="space-y-4">
        {/* Brand Selection */}
        <div>
          <Label className="text-sm font-medium text-foreground">Brand</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="mt-2 bg-secondary border-border">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(b => (
                <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBrand && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Tone: <span className="text-primary font-medium capitalize">{selectedBrand.tone}</span>
            </p>
          )}
        </div>

        {/* Platform & Content Type */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="mt-2 bg-secondary border-border">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(p => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="mt-2 bg-secondary border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map(t => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tone */}
        <div>
          <Label className="text-sm font-medium text-foreground">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="mt-2 bg-secondary border-border">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map(t => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic/Brief */}
        <div>
          <Label className="text-sm font-medium text-foreground">Topic / Brief</Label>
          <Textarea
            className="mt-2 bg-secondary border-border min-h-[120px]"
            placeholder="Describe what this post should be about. Include key points, keywords, or a specific angle..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading || !isComplete}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 gap-2 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}