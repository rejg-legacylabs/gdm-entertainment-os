import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';

const contentTypes = [
  { value: 'caption', label: 'Caption', icon: '📝' },
  { value: 'carousel', label: 'Carousel', icon: '🎨' },
  { value: 'reel', label: 'Reel/Video', icon: '🎬' },
  { value: 'story', label: 'Story', icon: '⚡' },
];

const platforms = [
  { value: 'instagram', label: 'Instagram', color: 'bg-pink-500/20' },
  { value: 'facebook', label: 'Facebook', color: 'bg-blue-500/20' },
  { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600/20' },
  { value: 'tiktok', label: 'TikTok', color: 'bg-black/30' },
  { value: 'twitter', label: 'Twitter/X', color: 'bg-slate-500/20' },
  { value: 'youtube', label: 'YouTube', color: 'bg-red-500/20' },
];

export default function CampaignBuild({ data, onNext }) {
  const [content, setContent] = useState(data.content || []);
  const [generating, setGenerating] = useState(!data.content || data.content.length === 0);
  const [selectedContent, setSelectedContent] = useState(new Set());

  useEffect(() => {
    if (!data.content || data.content.length === 0) {
      generateContent();
    }
  }, []);

  const generateContent = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));

    const generatedContent = [
      {
        id: 1,
        type: 'caption',
        platform: 'instagram',
        caption: '🌟 Ready to make a difference? Our new campaign is here to inspire action and build a stronger community together. Join us on this incredible journey!',
        cta: 'Learn More',
        hashtags: ['#CommunityImpact', '#MakingADifference', '#JoinUs'],
        description: 'Inspirational campaign opener',
      },
      {
        id: 2,
        type: 'carousel',
        platform: 'instagram',
        caption: 'Swipe to see the incredible impact we\'re making! 👉 From day one to real transformation stories - every slide tells a story of hope and change.',
        cta: 'See Full Story',
        hashtags: ['#ImpactStories', '#BeforeAndAfter', '#Transformation'],
        description: 'Impact carousel showcase',
      },
      {
        id: 3,
        type: 'reel',
        platform: 'instagram',
        caption: '60 seconds to understanding our mission. Watch as real people share their experiences and the change they\'ve seen.',
        cta: 'Watch Now',
        hashtags: ['#testimonials', '#RealStories', '#MakingChange'],
        description: 'Testimonial video reel',
      },
      {
        id: 4,
        type: 'caption',
        platform: 'linkedin',
        caption: 'Industry insight: How community-driven initiatives create lasting change. Discover the data, strategies, and success stories behind our latest campaign.',
        cta: 'Read More',
        hashtags: ['#SocialImpact', '#Community', '#Leadership'],
        description: 'LinkedIn thought leadership',
      },
      {
        id: 5,
        type: 'reel',
        platform: 'tiktok',
        caption: '♬ Did you know? Our campaign has already impacted 10k+ lives. Here\'s how YOU can help! 🚀',
        cta: 'Get Involved',
        hashtags: ['#SocialGood', '#CommunityAction', '#YouthPower'],
        description: 'TikTok viral campaign call-to-action',
      },
      {
        id: 6,
        type: 'story',
        platform: 'instagram',
        caption: 'Your opinion matters! Help shape our next campaign. Quick poll: 👇',
        cta: 'Vote',
        hashtags: [],
        description: 'Interactive story engagement',
      },
      {
        id: 7,
        type: 'caption',
        platform: 'facebook',
        caption: 'Big news! We\'re launching something special this week. Be part of the movement that\'s changing lives in our community. 💪',
        cta: 'Learn More',
        hashtags: ['#CommunityFirst', '#WeAreInThis', '#Together'],
        description: 'Facebook community announcement',
      },
    ];

    setContent(generatedContent);
    setGenerating(false);
  };

  const toggleContent = (id) => {
    const newSelected = new Set(selectedContent);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContent(newSelected);
  };

  const handleContinue = () => {
    if (selectedContent.size < 3) {
      toast.error('Please select at least 3 pieces of content');
      return;
    }

    const selectedContentPieces = content.filter(c => selectedContent.has(c.id));
    onNext({ content: selectedContentPieces });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Content</h2>
        <p className="text-muted-foreground">AI generated {content.length} content pieces. Select at least 3 to continue.</p>
      </div>

      {generating ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-foreground font-medium">AI Director creating content...</p>
          <p className="text-sm text-muted-foreground">Generating captions, CTAs, and hashtags for all platforms</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {content.map((piece, idx) => {
            const isSelected = selectedContent.has(piece.id);
            const platformInfo = platforms.find(p => p.value === piece.platform);

            return (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => toggleContent(piece.id)}
                className={`cursor-pointer p-4 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-secondary/20 border-border hover:border-border/70'
                }`}
              >
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-1 ${
                    isSelected ? 'bg-primary border-primary' : 'border-border'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                  </div>

                  {/* Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{contentTypes.find(t => t.value === piece.type)?.icon}</span>
                      <p className="font-medium text-foreground text-sm capitalize">{piece.type}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${platformInfo?.color}`}>
                        {platformInfo?.label}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{piece.description}</p>
                    <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{piece.caption}</p>

                    {piece.hashtags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {piece.hashtags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs text-primary">{tag}</span>
                        ))}
                      </div>
                    )}

                    {piece.cta && (
                      <p className="text-xs text-primary font-medium mt-2">CTA: {piece.cta}</p>
                    )}
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(piece.caption);
                      toast.success('Copied to clipboard');
                    }}
                    className="p-2 hover:bg-primary/20 rounded transition flex-shrink-0"
                    title="Copy caption"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-xs font-medium text-blue-300">ℹ️ Content Selection</p>
        <p className="text-xs text-muted-foreground mt-1">
          {selectedContent.size} / {Math.min(content.length, 7)} selected. Select at least 3 pieces to continue.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={selectedContent.size < 3}
          className="gap-2"
        >
          Choose Channels
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}