import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, TrendingUp, Calendar, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ScoreRing from '@/components/ui-premium/ScoreRing';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';

export default function AIStrategy() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [actionPlan, setActionPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const generateActionPlan = async () => {
    setLoading(true);
    const brandContext = selectedBrand === 'all' ? 'all brands' : selectedBrand;
    const brandData = brands.find(b => b.name === selectedBrand);
    const brandCampaigns = selectedBrand === 'all' ? campaigns : campaigns.filter(c => c.brand_name === selectedBrand);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an elite social media strategist with 20 years of experience. Create a comprehensive 7-day action plan for ${brandContext}.

Brand details: ${brandData ? JSON.stringify({ name: brandData.name, tone: brandData.tone, pillars: brandData.content_pillars, audience: brandData.audience }) : 'Multiple brands portfolio'}
Active campaigns: ${brandCampaigns.filter(c => c.status === 'active').map(c => c.name).join(', ') || 'None'}

Provide a JSON response with:
- weekly_plan: array of 7 objects with day, actions (array of strings), priority_content
- content_strategy: 3 strategic recommendations
- posting_frequency: recommended posting schedule
- platform_focus: which platforms to prioritize and why
- content_mix: recommended content type percentages
- growth_opportunities: 3 specific growth opportunities
- weak_spots: 3 areas needing improvement
- success_checklist: 5 items to check for success readiness`,
      response_json_schema: {
        type: 'object',
        properties: {
          weekly_plan: { type: 'array', items: { type: 'object', properties: { day: { type: 'string' }, actions: { type: 'array', items: { type: 'string' } }, priority_content: { type: 'string' } } } },
          content_strategy: { type: 'array', items: { type: 'string' } },
          posting_frequency: { type: 'string' },
          platform_focus: { type: 'string' },
          content_mix: { type: 'string' },
          growth_opportunities: { type: 'array', items: { type: 'string' } },
          weak_spots: { type: 'array', items: { type: 'string' } },
          success_checklist: { type: 'array', items: { type: 'string' } },
        }
      }
    });
    setActionPlan(result);
    setLoading(false);
  };

  const scores = {
    success: 76, campaign: 82, content: 68, engagement: 71,
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">AI Strategy Center</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">AI Strategy Director</h1>
        <p className="text-muted-foreground mt-1">Your expert social media consultant powered by AI</p>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Success Score', score: scores.success },
          { label: 'Campaign Health', score: scores.campaign },
          { label: 'Content Readiness', score: scores.content },
          { label: 'Engagement Opportunity', score: scores.engagement },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-xl p-6 flex flex-col items-center"
          >
            <ScoreRing score={s.score} size={90} strokeWidth={6} />
            <p className="text-sm font-medium text-foreground mt-3">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Plan Generator */}
      <div className="glass-panel rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Action Plan Generator</h3>
          </div>
          <div className="flex gap-3">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-52 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={generateActionPlan} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
              Generate Plan
            </Button>
          </div>
        </div>

        {actionPlan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-6">
            {/* Weekly Plan */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> 7-Day Action Plan
              </h4>
              <div className="grid md:grid-cols-7 gap-2">
                {(actionPlan.weekly_plan || []).map((day, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-primary mb-2">{day.day}</p>
                    <div className="space-y-1">
                      {(day.actions || []).map((a, j) => (
                        <p key={j} className="text-[11px] text-foreground/80">• {a}</p>
                      ))}
                    </div>
                    {day.priority_content && (
                      <p className="text-[10px] text-primary mt-2 italic">{day.priority_content}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Sections */}
            <div className="grid md:grid-cols-2 gap-4">
              {actionPlan.content_strategy && (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> Content Strategy
                  </h4>
                  {actionPlan.content_strategy.map((s, i) => (
                    <p key={i} className="text-xs text-foreground/80 mb-1">• {s}</p>
                  ))}
                </div>
              )}

              {actionPlan.growth_opportunities && (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Growth Opportunities
                  </h4>
                  {actionPlan.growth_opportunities.map((g, i) => (
                    <p key={i} className="text-xs text-foreground/80 mb-1">• {g}</p>
                  ))}
                </div>
              )}

              {actionPlan.weak_spots && (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Weak Spots
                  </h4>
                  {actionPlan.weak_spots.map((w, i) => (
                    <p key={i} className="text-xs text-foreground/80 mb-1">• {w}</p>
                  ))}
                </div>
              )}

              {actionPlan.success_checklist && (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Success Checklist
                  </h4>
                  {actionPlan.success_checklist.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground/80">{c}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {actionPlan.posting_frequency && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Recommended Posting Frequency</p>
                <p className="text-sm text-foreground">{actionPlan.posting_frequency}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AIInsightPanel
        title="Strategic AI Recommendations"
        insights={[
          { title: 'Content readiness is below threshold', description: 'Only 68% content readiness. Create 10+ posts to bring this above 80%.', category: 'warning', priority: 'critical' },
          { title: 'Donor campaigns need more storytelling', description: 'HQ of Hope needs 3x more story-driven content to hit fundraising goals.', category: 'campaign', priority: 'high' },
          { title: 'Cross-promote between brands', description: 'GDM Entertainment events can drive awareness for HQ of Hope. Create joint content.', category: 'growth', priority: 'medium' },
          { title: 'LinkedIn is underutilized', description: 'RE Jones Global should increase LinkedIn posting by 50% for B2B reach.', category: 'strategy', priority: 'high' },
          { title: 'Jobs App needs video testimonials', description: 'Video job testimonials get 5x more applications. Prioritize video content.', category: 'content', priority: 'high' },
        ]}
      />
    </div>
  );
}