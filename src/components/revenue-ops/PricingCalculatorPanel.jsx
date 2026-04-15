import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const platformLabels = {
  facebook: 'Facebook Posts',
  instagram: 'Instagram Posts',
  tiktok: 'TikTok Videos',
  linkedin: 'LinkedIn Posts',
  youtube: 'YouTube Shorts',
  reels: 'Reels',
  stories: 'Stories',
  carousels: 'Carousels',
};

export default function PricingCalculatorPanel({ scope, onScopeChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6 space-y-6"
    >
      <h2 className="font-semibold text-foreground">Content Mix</h2>

      <div className="space-y-4">
        {Object.entries(platformLabels).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-foreground">{label}</Label>
              <span className="text-sm font-bold text-primary">{scope[key]}</span>
            </div>
            <Slider
              value={[scope[key]]}
              onValueChange={([val]) => onScopeChange({ ...scope, [key]: val })}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-border/30 pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Add-ons & Services</h3>
        
        <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30 cursor-pointer">
          <Checkbox
            checked={scope.strategy_fee}
            onCheckedChange={(checked) => onScopeChange({ ...scope, strategy_fee: checked })}
          />
          <span className="text-sm text-foreground">Strategy & Planning Fee ($500)</span>
        </label>

        <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30 cursor-pointer">
          <Checkbox
            checked={scope.setup_fee}
            onCheckedChange={(checked) => onScopeChange({ ...scope, setup_fee: checked })}
          />
          <span className="text-sm text-foreground">Setup & Implementation ($1,000)</span>
        </label>

        <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30 cursor-pointer">
          <Checkbox
            checked={scope.reporting}
            onCheckedChange={(checked) => onScopeChange({ ...scope, reporting: checked })}
          />
          <span className="text-sm text-foreground">Analytics & Reporting ($300)</span>
        </label>

        <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30 cursor-pointer">
          <Checkbox
            checked={scope.community_management}
            onCheckedChange={(checked) => onScopeChange({ ...scope, community_management: checked })}
          />
          <span className="text-sm text-foreground">Community Management ($250)</span>
        </label>

        <label className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30 cursor-pointer">
          <Checkbox
            checked={scope.ai_generation}
            onCheckedChange={(checked) => onScopeChange({ ...scope, ai_generation: checked })}
          />
          <span className="text-sm text-foreground">AI Content Generation (Included)</span>
        </label>
      </div>

      <div className="border-t border-border/30 pt-4 space-y-3">
        <div>
          <Label className="text-sm text-foreground">Video Editing (minutes)</Label>
          <Slider
            value={[scope.video_editing_minutes]}
            onValueChange={([val]) => onScopeChange({ ...scope, video_editing_minutes: val })}
            max={120}
            step={5}
          />
        </div>

        <div>
          <Label className="text-sm text-foreground">Revision Rounds</Label>
          <Slider
            value={[scope.revisions]}
            onValueChange={([val]) => onScopeChange({ ...scope, revisions: val })}
            max={10}
            step={1}
          />
        </div>
      </div>
    </motion.div>
  );
}