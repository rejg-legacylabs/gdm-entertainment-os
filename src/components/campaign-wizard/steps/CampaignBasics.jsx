import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronRight } from 'lucide-react';

const campaignGoals = [
  { value: 'awareness', label: 'Build Awareness' },
  { value: 'engagement', label: 'Increase Engagement' },
  { value: 'leads', label: 'Generate Leads' },
  { value: 'donations', label: 'Drive Donations' },
  { value: 'recruiting', label: 'Recruiting' },
  { value: 'sales', label: 'Drive Sales' },
  { value: 'event', label: 'Event Promotion' },
];

const durations = [
  { value: 7, label: '7 days' },
  { value: 14, label: '2 weeks' },
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
];

export default function CampaignBasics({ data, onNext }) {
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const [formData, setFormData] = useState({
    name: data.basics?.name || '',
    brand: data.basics?.brand || '',
    goal: data.basics?.goal || '',
    targetAudience: data.basics?.targetAudience || '',
    duration: data.basics?.duration || 30,
    mode: data.basics?.mode || 'assisted',
  });

  const handleSubmit = () => {
    if (formData.name && formData.brand && formData.goal) {
      onNext({ basics: formData });
    }
  };

  const isComplete = formData.name && formData.brand && formData.goal;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Basics</h2>
        <p className="text-muted-foreground">Name your campaign, select a brand, and define your goal.</p>
      </div>

      <div className="space-y-6">
        {/* Campaign Name */}
        <div>
          <Label className="text-foreground font-medium">Campaign Name</Label>
          <Input
            className="mt-2 bg-secondary border-border"
            placeholder="e.g., Spring Fundraiser 2026"
            value={formData.name}
            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
          />
        </div>

        {/* Brand Selection */}
        <div>
          <Label className="text-foreground font-medium">Brand</Label>
          <Select value={formData.brand} onValueChange={(v) => setFormData(p => ({ ...p, brand: v }))}>
            <SelectTrigger className="mt-2 bg-secondary border-border">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(b => (
                <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Goal */}
        <div>
          <Label className="text-foreground font-medium">Campaign Goal</Label>
          <Select value={formData.goal} onValueChange={(v) => setFormData(p => ({ ...p, goal: v }))}>
            <SelectTrigger className="mt-2 bg-secondary border-border">
              <SelectValue placeholder="What's your primary goal?" />
            </SelectTrigger>
            <SelectContent>
              {campaignGoals.map(g => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div>
          <Label className="text-foreground font-medium">Campaign Duration</Label>
          <Select value={String(formData.duration)} onValueChange={(v) => setFormData(p => ({ ...p, duration: parseInt(v) }))}>
            <SelectTrigger className="mt-2 bg-secondary border-border">
              <SelectValue placeholder="How long?" />
            </SelectTrigger>
            <SelectContent>
              {durations.map(d => (
                <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Audience */}
        <div>
          <Label className="text-foreground font-medium">Target Audience (Optional)</Label>
          <Textarea
            className="mt-2 bg-secondary border-border"
            placeholder="Describe your ideal audience..."
            value={formData.targetAudience}
            onChange={(e) => setFormData(p => ({ ...p, targetAudience: e.target.value }))}
            rows={3}
          />
        </div>

        {/* AI Mode Selection */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <Label className="text-foreground font-medium mb-4 block">Campaign Mode</Label>
          <div className="space-y-3">
            {[
              { value: 'manual', label: 'Full Manual', desc: 'You control everything' },
              { value: 'assisted', label: 'AI Assisted', desc: 'AI recommends, you decide' },
              { value: 'autopilot', label: 'Full Autopilot', desc: 'AI runs the entire campaign' },
            ].map(mode => (
              <label key={mode.value} className="flex items-start gap-3 p-3 rounded border border-transparent cursor-pointer hover:bg-primary/20 transition">
                <input
                  type="radio"
                  name="mode"
                  value={mode.value}
                  checked={formData.mode === mode.value}
                  onChange={(e) => setFormData(p => ({ ...p, mode: e.target.value }))}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-foreground text-sm">{mode.label}</p>
                  <p className="text-xs text-muted-foreground">{mode.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}