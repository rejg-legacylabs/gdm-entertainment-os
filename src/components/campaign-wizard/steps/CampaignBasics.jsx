import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar, Zap } from 'lucide-react';

export default function CampaignBasics({ onNext }) {
  const [basics, setBasics] = useState({
    name: '',
    brand: '',
    objective: '',
    duration: '30',
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'balanced',
    mode: 'assisted',
  });

  const modeDescriptions = {
    manual: 'You review and edit everything before posting',
    assisted: 'AI generates, you approve key decisions',
    autopilot: 'AI builds and schedules with minimal input',
  };

  const frequencyOptions = {
    light: '2-3 posts per week',
    balanced: '4-5 posts per week',
    aggressive: '6-7+ posts per week',
  };

  const handleSubmit = () => {
    onNext({ basics });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Set Up Your Campaign</h2>

        <div className="space-y-6">
          {/* Campaign Name */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Campaign Name</Label>
            <Input
              placeholder="e.g., Spring Fundraising Drive 2026"
              value={basics.name}
              onChange={(e) => setBasics({ ...basics, name: e.target.value })}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground mt-2">Make it descriptive and memorable</p>
          </div>

          {/* Brand Selection */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Brand / Organization</Label>
            <Select value={basics.brand} onValueChange={(value) => setBasics({ ...basics, brand: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GDM Entertainment">GDM Entertainment</SelectItem>
                <SelectItem value="Headquarters of Hope Foundation">Headquarters of Hope Foundation</SelectItem>
                <SelectItem value="RE Jones Global">RE Jones Global</SelectItem>
                <SelectItem value="Legacy Transitional Housing">Legacy Transitional Housing</SelectItem>
                <SelectItem value="Jobs App">Jobs App</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Objective */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Campaign Objective</Label>
            <Textarea
              placeholder="What do you want to achieve? e.g., Increase donations, recruit volunteers, drive sign-ups, build brand awareness"
              value={basics.objective}
              onChange={(e) => setBasics({ ...basics, objective: e.target.value })}
              className="resize-none h-20"
            />
            <p className="text-xs text-muted-foreground mt-2">AI will use this to guide content creation</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={basics.startDate}
                  onChange={(e) => setBasics({ ...basics, startDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
                />
              </div>
            </div>

            {/* Campaign Duration */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Duration (days)</Label>
              <Select value={basics.duration} onValueChange={(value) => setBasics({ ...basics, duration: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posting Frequency */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Posting Frequency</Label>
            <div className="space-y-2">
              {Object.entries(frequencyOptions).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setBasics({ ...basics, frequency: key })}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    basics.frequency === key
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-transparent hover:border-border/80'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Autopilot Mode */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Campaign Mode</Label>
            <div className="space-y-2">
              {Object.entries(modeDescriptions).map(([key, desc]) => (
                <button
                  key={key}
                  onClick={() => setBasics({ ...basics, mode: key })}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    basics.mode === key
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-transparent hover:border-border/80'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground capitalize">{key} Mode</p>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full mt-8 gap-2" disabled={!basics.name || !basics.brand}>
          <Zap className="w-4 h-4" />
          Continue to Information Sources
        </Button>
      </div>
    </motion.div>
  );
}