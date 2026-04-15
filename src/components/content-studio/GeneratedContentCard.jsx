import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Sparkles, ChevronDown, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const refineOptions = [
  { label: 'Rewrite Stronger', instruction: 'rewrite it to be more powerful, compelling, and attention-grabbing' },
  { label: 'More Emotional', instruction: 'make it more emotionally compelling and heartfelt' },
  { label: 'More Premium', instruction: 'elevate the tone to feel more luxury and premium' },
  { label: 'More Urgent', instruction: 'add urgency and a sense of time-sensitivity' },
  { label: 'More Viral', instruction: 'make it more shareable, relatable, and viral-worthy' },
  { label: 'Shorten', instruction: 'make it shorter and punchier while keeping the core message' },
  { label: 'Expand', instruction: 'expand it with more detail, storytelling, and depth' },
  { label: 'Donor-Focused', instruction: 'make it appeal to donors and supporters with impact language' },
];

export default function GeneratedContentCard({ content, platform, brand, tone, onRegenerate, onRefine, loading }) {
  const [showRefineOptions, setShowRefineOptions] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-panel rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Generated Content</h3>
            <p className="text-xs text-muted-foreground">
              {platform && `for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
              {tone && ` • ${tone}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-primary gap-1.5"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRegenerate}
            disabled={loading}
            className="text-muted-foreground hover:text-primary gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Content Display */}
      <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/30">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>

      {/* Refine Tools */}
      <div className="space-y-2">
        <motion.button
          onClick={() => setShowRefineOptions(!showRefineOptions)}
          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              AI Refine Tools
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRefineOptions ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {showRefineOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-2">
                {refineOptions.map((opt, idx) => (
                  <motion.div
                    key={opt.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-border text-muted-foreground hover:text-primary hover:border-primary/30"
                      onClick={() => onRefine(opt.instruction)}
                      disabled={loading}
                    >
                      {opt.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}