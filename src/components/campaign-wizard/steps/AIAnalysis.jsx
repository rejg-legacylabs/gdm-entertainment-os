import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2, Sparkles, TrendingUp, BookOpen } from 'lucide-react';

export default function AIAnalysis({ data, onNext }) {
  const [analyzing, setAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(data.analysis || {});

  useEffect(() => {
    // Simulate AI analysis with delay
    const timeout = setTimeout(() => {
      if (!data.analysis) {
        const generatedAnalysis = {
          summary: `AI analyzed ${data.sources?.length || 0} sources and identified key campaign themes and opportunities.`,
          contentPillars: ['Brand Story', 'Impact & Results', 'Community Voices', 'Call to Action', 'Behind the Scenes'],
          storyAngles: [
            'Customer success story with measurable impact',
            'Day-in-the-life perspective of your community',
            'Milestone achievement celebration',
            'Team member expertise and passion',
            'Real testimonial from beneficiary',
            'Before/after transformation narrative',
          ],
          recommendations: [
            'Focus on emotional storytelling to increase engagement',
            'Mix platform-specific content (Reels for TikTok/Instagram, long-form for LinkedIn)',
            'Incorporate user-generated content for authenticity',
          ],
        };
        setAnalysis(generatedAnalysis);
      }
      setAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [data.analysis, data.sources]);

  const handleContinue = () => {
    onNext({ analysis });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">AI Analysis</h2>
        <p className="text-muted-foreground">AI is analyzing your sources to extract insights, themes, and story angles.</p>
      </div>

      {analyzing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-foreground font-medium">AI Director analyzing sources...</p>
          <p className="text-sm text-muted-foreground">Extracting themes, angles, and recommendations</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-6"
          >
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">AI Summary</h3>
                <p className="text-sm text-foreground/80">{analysis.summary}</p>
              </div>
            </div>
          </motion.div>

          {/* Content Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Content Pillars</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {analysis.contentPillars?.map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-secondary/30 rounded-lg p-3 border border-border"
                >
                  <p className="text-sm font-medium text-foreground">{pillar}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story Angles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Story Angles</h3>
            </div>
            <div className="space-y-2">
              {analysis.storyAngles?.map((angle, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex gap-3 p-3 bg-secondary/20 rounded-lg border border-border"
                >
                  <span className="text-primary font-semibold flex-shrink-0">→</span>
                  <p className="text-sm text-foreground">{angle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Recommendations */}
          {analysis.recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-6"
            >
              <h3 className="font-semibold text-foreground mb-3">AI Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-2">
                    <span className="text-green-400">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={analyzing} className="gap-2">
          Build Campaign Content
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}