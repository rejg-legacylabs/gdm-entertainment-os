import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Sparkles, Target, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIAnalysis({ data, onNext }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      setAnalysis({
        sourceSummary: 'Analyzed 3 sources totaling 5 key messages and 2 video clips',
        themes: [
          { title: 'Community Impact', strength: 'Very Strong', description: 'Real stories of lives changed' },
          { title: 'Hope & Transformation', strength: 'Strong', description: 'Journey narratives resonate' },
          { title: 'Urgency & Action', strength: 'Strong', description: 'Clear CTAs for involvement' },
        ],
        contentOpportunities: [
          'Before/after transformation stories',
          'Testimonial video clips',
          'Success metrics and impact numbers',
          'Behind-the-scenes content',
          'Volunteer spotlights',
        ],
        recommendedCTA: 'Donate now to change a life',
        recommendedPlatforms: ['LinkedIn', 'Instagram', 'Facebook'],
        recommendedPostTypes: ['carousel', 'video', 'story', 'caption'],
        confidenceScore: 92,
      });
      setIsAnalyzing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isAnalyzing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">AI is analyzing your sources</h2>
          <p className="text-muted-foreground mb-8">
            Extracting key messages, identifying story angles, and discovering content opportunities...
          </p>

          {/* Fake Progress Indicators */}
          <div className="space-y-3 max-w-sm mx-auto">
            {[
              { label: 'Scanning sources...', done: true },
              { label: 'Extracting themes...', done: true },
              { label: 'Identifying story angles...', done: false },
              { label: 'Generating recommendations...', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
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
      {/* Analysis Complete */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-foreground">Analysis Complete</h2>
        </div>
        <p className="text-muted-foreground">{analysis?.sourceSummary}</p>
      </div>

      {/* Story Themes */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Story Themes Detected
        </h3>
        <div className="space-y-3">
          {analysis?.themes.map((theme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{theme.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                </div>
                <span className="text-xs font-medium text-primary ml-4 whitespace-nowrap">{theme.strength}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Opportunities */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Content Opportunities
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {analysis?.contentOpportunities.map((opp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/50"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-foreground">{opp}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-medium text-muted-foreground mb-2">RECOMMENDED CTA</p>
          <p className="text-lg font-semibold text-foreground">{analysis?.recommendedCTA}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-medium text-muted-foreground mb-2">RECOMMENDED PLATFORMS</p>
          <div className="flex flex-wrap gap-2">
            {analysis?.recommendedPlatforms.map((p) => (
              <span key={p} className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Confidence */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            AI Confidence Score
          </h4>
          <span className={cn(
            'text-lg font-bold',
            analysis?.confidenceScore >= 90 ? 'text-green-400' : analysis?.confidenceScore >= 70 ? 'text-primary' : 'text-amber-400'
          )}>
            {analysis?.confidenceScore}%
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-accent rounded-full h-2 transition-all duration-500"
            style={{ width: `${analysis?.confidenceScore}%` }}
          />
        </div>
      </div>

      <Button onClick={() => onNext({ analysis })} className="w-full">
        Continue to Campaign Build
      </Button>
    </motion.div>
  );
}