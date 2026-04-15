import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Zap, Loader2, Download, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ImageAdGenerator({ campaign, brand, onCreativeGenerated }) {
  const queryClient = useQueryClient();
  const [selectedFormat, setSelectedFormat] = useState('square');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedStyle, setSelectedStyle] = useState('premium');
  const [showPreview, setShowPreview] = useState(false);

  const generateImage = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('generateImageAd', {
        campaignId: campaign.id,
        campaignName: campaign.name,
        brandName: brand.name,
        creativeType: 'image_ad',
        format: selectedFormat,
        platform: selectedPlatform,
        style: selectedStyle,
        objective: campaign.objective,
        cta: campaign.cta,
        audience: campaign.target_audience,
        sourceMaterial: campaign.desired_outcomes,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Creative generated successfully!');
      onCreativeGenerated?.(data.creative);
      queryClient.invalidateQueries({ queryKey: ['generatedCreatives'] });
    },
    onError: (error) => {
      toast.error('Failed to generate creative: ' + error.message);
    },
  });

  const formats = [
    { value: 'square', label: 'Square (1:1)' },
    { value: 'portrait', label: 'Portrait (4:5)' },
    { value: 'landscape', label: 'Landscape (16:9)' },
    { value: 'story', label: 'Story (9:16)' },
  ];

  const styles = [
    'premium',
    'bold',
    'emotional',
    'urgent',
    'donor_focused',
    'luxury',
    'community_driven',
    'corporate',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          AI Image Ad Generator
        </h3>
        <p className="text-sm text-muted-foreground">
          Generate branded social graphics and ad creatives instantly
        </p>
      </div>

      {/* Format Selection */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Format
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => setSelectedFormat(f.value)}
              className={`p-3 rounded-lg border transition-all ${
                selectedFormat === f.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="text-sm font-medium text-foreground text-left">
                {f.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Selection */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Platform
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {['instagram', 'facebook', 'linkedin', 'tiktok'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`p-3 rounded-lg border transition-all capitalize ${
                selectedPlatform === p
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="text-sm font-medium text-foreground">{p}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Creative Style
        </label>
        <div className="grid sm:grid-cols-3 gap-2">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStyle(s)}
              className={`p-2 rounded-lg border transition-all text-xs capitalize ${
                selectedStyle === s
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-foreground">{s.replace('_', ' ')}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {generateImage.data && showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-border/30 pt-4 space-y-4"
        >
          <img
            src={generateImage.data.image_url}
            alt="Generated creative"
            className="w-full rounded-lg"
          />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Headline:</p>
            <p className="text-sm font-medium text-foreground">
              {generateImage.data.headline}
            </p>
            <p className="text-xs text-muted-foreground mt-3">Caption:</p>
            <p className="text-sm text-foreground">
              {generateImage.data.caption}
            </p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/30">
        <Button
          onClick={() => generateImage.mutate()}
          disabled={generateImage.isPending}
          className="flex-1 bg-primary hover:bg-primary/90 gap-2"
        >
          {generateImage.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate Creative
            </>
          )}
        </Button>
        {generateImage.data && (
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        )}
      </div>
    </motion.div>
  );
}