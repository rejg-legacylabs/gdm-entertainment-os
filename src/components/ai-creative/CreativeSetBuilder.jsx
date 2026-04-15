import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreativeSetBuilder({ campaign, brand, onSetGenerated }) {
  const queryClient = useQueryClient();
  const [generatedSet, setGeneratedSet] = useState(null);

  const generateSet = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('generateCreativeSet', {
        campaignId: campaign.id,
        campaignName: campaign.name,
        brandName: brand.name,
        objective: campaign.objective,
        cta: campaign.cta,
        audience: campaign.target_audience,
        platforms: campaign.platforms || ['instagram', 'facebook'],
        sourceMaterial: campaign.desired_outcomes,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setGeneratedSet(data.creative_set);
      toast.success(`Generated ${data.creative_set.total_creatives} creatives!`);
      onSetGenerated?.(data.creative_set);
      queryClient.invalidateQueries({ queryKey: ['generatedCreatives'] });
    },
    onError: (error) => {
      toast.error('Failed to generate creative set: ' + error.message);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Generate Full Creative Set
        </h3>
        <p className="text-sm text-muted-foreground">
          Create a complete suite of campaign creatives including hero image, supporting posts, and captions
        </p>
      </div>

      <AnimatePresence>
        {generatedSet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 space-y-4 border-b border-border/30 pb-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {generatedSet.creatives.map((creative, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-lg overflow-hidden border border-border/30"
                >
                  <img
                    src={creative.image_url}
                    alt={creative.type}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 bg-secondary/30">
                    <p className="text-xs font-medium text-foreground capitalize">
                      {creative.type.replace('_', ' ')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase">
                Generated Captions
              </p>
              {generatedSet.captions?.map((caption, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-secondary/20">
                  <p className="text-xs text-foreground">{caption}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase">
                Hashtags
              </p>
              <div className="flex flex-wrap gap-2">
                {generatedSet.hashtags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => generateSet.mutate()}
        disabled={generateSet.isPending}
        className="w-full bg-primary hover:bg-primary/90 gap-2"
      >
        {generateSet.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating Creative Set...
          </>
        ) : generatedSet ? (
          <>
            <Check className="w-4 h-4" />
            Set Generated
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Creative Set
          </>
        )}
      </Button>
    </motion.div>
  );
}