import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Save, Copy, FileText, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import PricingCalculatorPanel from '@/components/revenue-ops/PricingCalculatorPanel';
import PricingBreakdown from '@/components/revenue-ops/PricingBreakdown';
import AIRecommendations from '@/components/revenue-ops/AIRecommendations';

export default function PricingStudio() {
  const queryClient = useQueryClient();
  const [scope, setScope] = useState({
    name: 'New Campaign Scope',
    client_id: '',
    client_name: '',
    campaign_name: '',
    brand_name: '',
    package_tier: 'growth',
    pricing_model: 'one_time_campaign',
    campaign_duration_months: 3,
    facebook: 4,
    instagram: 6,
    tiktok: 2,
    linkedin: 2,
    youtube: 1,
    reels: 4,
    stories: 2,
    carousels: 1,
    strategy_fee: true,
    setup_fee: true,
    reporting: false,
    community_management: false,
    video_editing_minutes: 0,
    revisions: 2,
    ai_generation: true,
    custom_addons: [],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.Package.list(),
  });

  // Calculate pricing
  const pricingRules = {
    facebook: 150, instagram: 150, tiktok: 200, linkedin: 175, youtube: 250,
    reels: 200, stories: 150, carousels: 175,
    strategy_fee: 500, setup_fee: 1000, reporting: 300, community_management: 250,
    video_editing: 100, revision: 50,
  };

  const lineItems = useMemo(() => {
    const items = [];
    if (scope.facebook) items.push({ service: 'facebook_posts', qty: scope.facebook, price: pricingRules.facebook, total: scope.facebook * pricingRules.facebook });
    if (scope.instagram) items.push({ service: 'instagram_posts', qty: scope.instagram, price: pricingRules.instagram, total: scope.instagram * pricingRules.instagram });
    if (scope.tiktok) items.push({ service: 'tiktok_posts', qty: scope.tiktok, price: pricingRules.tiktok, total: scope.tiktok * pricingRules.tiktok });
    if (scope.linkedin) items.push({ service: 'linkedin_posts', qty: scope.linkedin, price: pricingRules.linkedin, total: scope.linkedin * pricingRules.linkedin });
    if (scope.youtube) items.push({ service: 'youtube_posts', qty: scope.youtube, price: pricingRules.youtube, total: scope.youtube * pricingRules.youtube });
    if (scope.reels) items.push({ service: 'reels', qty: scope.reels, price: pricingRules.reels, total: scope.reels * pricingRules.reels });
    if (scope.stories) items.push({ service: 'stories', qty: scope.stories, price: pricingRules.stories, total: scope.stories * pricingRules.stories });
    if (scope.carousels) items.push({ service: 'carousels', qty: scope.carousels, price: pricingRules.carousels, total: scope.carousels * pricingRules.carousels });
    if (scope.strategy_fee) items.push({ service: 'strategy_fee', qty: 1, price: pricingRules.strategy_fee, total: pricingRules.strategy_fee });
    if (scope.setup_fee) items.push({ service: 'setup_fee', qty: 1, price: pricingRules.setup_fee, total: pricingRules.setup_fee });
    if (scope.reporting) items.push({ service: 'reporting', qty: 1, price: pricingRules.reporting, total: pricingRules.reporting });
    if (scope.community_management) items.push({ service: 'community_management', qty: 1, price: pricingRules.community_management, total: pricingRules.community_management });
    if (scope.video_editing_minutes) items.push({ service: 'video_editing', qty: scope.video_editing_minutes, price: pricingRules.video_editing, total: scope.video_editing_minutes * pricingRules.video_editing });
    if (scope.revisions) items.push({ service: 'revisions', qty: scope.revisions, price: pricingRules.revision, total: scope.revisions * pricingRules.revision });
    return items;
  }, [scope]);

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + tax;
  const monthlyTotal = scope.pricing_model === 'monthly_retainer' ? total : Math.round(total / scope.campaign_duration_months);

  const saveScope = useMutation({
    mutationFn: async () => {
      return await base44.entities.PricingScope.create({
        ...scope,
        subtotal,
        tax_amount: tax,
        total,
        monthly_total: monthlyTotal,
        line_items: lineItems,
        status: 'saved',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingScopes'] });
    },
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-display">Pricing Studio</h1>
        <p className="text-muted-foreground mt-1">Build custom campaign pricing and scope</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scope Basics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Scope Details</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-foreground mb-1">Scope Name</Label>
                <Input
                  value={scope.name}
                  onChange={(e) => setScope({ ...scope, name: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1">Package Tier</Label>
                <Select value={scope.package_tier} onValueChange={(val) => setScope({ ...scope, package_tier: val })}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['starter', 'growth', 'premium', 'elite', 'custom'].map(tier => (
                      <SelectItem key={tier} value={tier} className="capitalize">{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-foreground mb-1">Client</Label>
                <Select value={scope.client_id} onValueChange={(val) => {
                  const client = clients.find(c => c.id === val);
                  setScope({ ...scope, client_id: val, client_name: client?.name });
                }}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1">Campaign Name</Label>
                <Input
                  value={scope.campaign_name}
                  onChange={(e) => setScope({ ...scope, campaign_name: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-foreground mb-1">Pricing Model</Label>
                <Select value={scope.pricing_model} onValueChange={(val) => setScope({ ...scope, pricing_model: val })}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time_campaign">One-Time Campaign</SelectItem>
                    <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1">Duration (months)</Label>
                <Input
                  type="number"
                  min="1"
                  max="24"
                  value={scope.campaign_duration_months}
                  onChange={(e) => setScope({ ...scope, campaign_duration_months: parseInt(e.target.value) })}
                  className="bg-secondary/50"
                />
              </div>
            </div>
          </motion.div>

          {/* Content Mix */}
          <PricingCalculatorPanel
            scope={scope}
            onScopeChange={setScope}
          />
        </div>

        {/* Right: Breakdown & Recommendations */}
        <div className="space-y-6">
          <PricingBreakdown
            lineItems={lineItems}
            subtotal={subtotal}
            tax={tax}
            total={total}
            monthlyTotal={monthlyTotal}
            model={scope.pricing_model}
          />

          <div className="space-y-3">
            <Button
              onClick={() => saveScope.mutate()}
              className="w-full bg-primary hover:bg-primary/90 gap-2"
            >
              <Save className="w-4 h-4" />
              Save Scope
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Proposal
            </Button>
          </div>

          <AIRecommendations scope={scope} total={total} />
        </div>
      </div>
    </div>
  );
}