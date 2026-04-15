import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, FileText } from 'lucide-react';

const pricingRules = {
  facebook_posts: 150,
  instagram_posts: 150,
  tiktok_posts: 200,
  linkedin_posts: 175,
  youtube_posts: 250,
  reels_stories_carousels: 200,
  ai_strategy_fee: 500,
  setup_fee: 1000,
  revision_per_post: 50,
  video_editing_per_minute: 100,
  analytics_reporting: 300,
  custom_addon: 250,
};

export default function PricingCalculator({ onProposalGenerate }) {
  const [mode, setMode] = useState('campaign'); // 'campaign' or 'retainer'
  const [posts, setPosts] = useState({
    facebook: 4,
    instagram: 6,
    tiktok: 2,
    linkedin: 2,
    youtube: 1,
    reels: 4,
  });
  const [options, setOptions] = useState({
    aiStrategy: true,
    videoEditing: 0,
    analyticsReporting: false,
    revisions: 2,
    campaigns: 1,
    duration: 30,
  });

  const [retainerMonthly, setRetainerMonthly] = useState(2500);
  const [numPlatforms, setNumPlatforms] = useState(3);

  const campaignTotal = useMemo(() => {
    let total = 0;

    // Per-post pricing
    total += posts.facebook * pricingRules.facebook_posts;
    total += posts.instagram * pricingRules.instagram_posts;
    total += posts.tiktok * pricingRules.tiktok_posts;
    total += posts.linkedin * pricingRules.linkedin_posts;
    total += posts.youtube * pricingRules.youtube_posts;
    total += posts.reels * pricingRules.reels_stories_carousels;

    // Add-ons
    if (options.aiStrategy) total += pricingRules.ai_strategy_fee;
    total += options.videoEditing * pricingRules.video_editing_per_minute;
    if (options.analyticsReporting) total += pricingRules.analytics_reporting;
    total += options.revisions * pricingRules.revision_per_post;
    total += pricingRules.setup_fee;

    return total;
  }, [posts, options]);

  const totalPosts = Object.values(posts).reduce((a, b) => a + b, 0);
  const postBreakdown = [
    { name: 'Facebook Posts', count: posts.facebook, price: posts.facebook * pricingRules.facebook_posts },
    { name: 'Instagram Posts', count: posts.instagram, price: posts.instagram * pricingRules.instagram_posts },
    { name: 'TikTok Posts', count: posts.tiktok, price: posts.tiktok * pricingRules.tiktok_posts },
    { name: 'LinkedIn Posts', count: posts.linkedin, price: posts.linkedin * pricingRules.linkedin_posts },
    { name: 'YouTube Posts', count: posts.youtube, price: posts.youtube * pricingRules.youtube_posts },
    { name: 'Reels/Stories/Carousels', count: posts.reels, price: posts.reels * pricingRules.reels_stories_carousels },
  ].filter(item => item.count > 0);

  const lineItems = [
    ...postBreakdown,
    options.aiStrategy && { name: 'AI Strategy & Planning', count: 1, price: pricingRules.ai_strategy_fee },
    options.videoEditing > 0 && { name: `Video Editing (${options.videoEditing} min)`, count: 1, price: options.videoEditing * pricingRules.video_editing_per_minute },
    options.analyticsReporting && { name: 'Analytics & Reporting', count: 1, price: pricingRules.analytics_reporting },
    options.revisions > 0 && { name: `Content Revisions (${options.revisions})`, count: 1, price: options.revisions * pricingRules.revision_per_post },
    { name: 'Setup & Implementation', count: 1, price: pricingRules.setup_fee },
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Tabs value={mode} onValueChange={setMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
          <TabsTrigger value="campaign">Campaign Pricing</TabsTrigger>
          <TabsTrigger value="retainer">Retainer Pricing</TabsTrigger>
        </TabsList>

        {/* Campaign Mode */}
        <TabsContent value="campaign" className="space-y-6">
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <h3 className="font-semibold text-foreground">Campaign Content Mix</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { key: 'facebook', label: 'Facebook Posts', max: 20 },
                { key: 'instagram', label: 'Instagram Posts', max: 20 },
                { key: 'tiktok', label: 'TikTok Videos', max: 15 },
                { key: 'linkedin', label: 'LinkedIn Posts', max: 15 },
                { key: 'youtube', label: 'YouTube Shorts', max: 10 },
                { key: 'reels', label: 'Reels/Stories', max: 20 },
              ].map(platform => (
                <div key={platform.key} className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">{platform.label}</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[posts[platform.key]]}
                      onValueChange={([val]) => setPosts({ ...posts, [platform.key]: val })}
                      max={platform.max}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-primary min-w-[40px] text-right">{posts[platform.key]}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
              <span className="font-medium text-foreground">Total Posts</span>
              <span className="text-2xl font-bold text-primary">{totalPosts}</span>
            </div>
          </div>

          {/* Add-ons */}
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Add-ons & Services</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.aiStrategy}
                  onChange={(e) => setOptions({ ...options, aiStrategy: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="flex-1 text-sm font-medium text-foreground">AI Strategy & Planning</span>
                <span className="text-sm font-bold text-primary">${pricingRules.ai_strategy_fee}</span>
              </label>

              <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Video Editing (minutes)</Label>
                  <span className="text-sm font-bold text-primary">{options.videoEditing}</span>
                </div>
                <Slider
                  value={[options.videoEditing]}
                  onValueChange={([val]) => setOptions({ ...options, videoEditing: val })}
                  max={60}
                  step={5}
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.analyticsReporting}
                  onChange={(e) => setOptions({ ...options, analyticsReporting: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="flex-1 text-sm font-medium text-foreground">Analytics & Monthly Reporting</span>
                <span className="text-sm font-bold text-primary">${pricingRules.analytics_reporting}</span>
              </label>

              <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Content Revisions</Label>
                  <span className="text-sm font-bold text-primary">{options.revisions}</span>
                </div>
                <Slider
                  value={[options.revisions]}
                  onValueChange={([val]) => setOptions({ ...options, revisions: val })}
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Retainer Mode */}
        <TabsContent value="retainer" className="space-y-6">
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Monthly Retainer</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[retainerMonthly]}
                  onValueChange={([val]) => setRetainerMonthly(val)}
                  min={1000}
                  max={10000}
                  step={100}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-primary min-w-[120px] text-right">${retainerMonthly.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Included Platforms</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[numPlatforms]}
                  onValueChange={([val]) => setNumPlatforms(val)}
                  min={1}
                  max={6}
                  step={1}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-primary min-w-[40px] text-right">{numPlatforms}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Total & Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/30">
          <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
          <span className="text-lg font-semibold text-foreground">${campaignTotal.toLocaleString()}</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {lineItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-medium text-foreground">${item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-primary/30 bg-primary/5 p-3 rounded-lg">
          <span className="text-lg font-bold text-foreground">Total Campaign Price</span>
          <span className="text-3xl font-bold text-primary">${campaignTotal.toLocaleString()}</span>
        </div>

        <Button
          onClick={() => onProposalGenerate?.({ mode, total: campaignTotal, lineItems, posts, options })}
          className="w-full bg-primary hover:bg-primary/90 gap-2"
        >
          <FileText className="w-4 h-4" />
          Generate Proposal
        </Button>
      </motion.div>
    </div>
  );
}