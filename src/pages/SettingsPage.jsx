import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings, Building2, Users, Shield, Sliders, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const [editingBrand, setEditingBrand] = useState(null);
  const [editData, setEditData] = useState({});

  const updateBrand = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Brand.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setEditingBrand(null);
      toast.success('Brand updated');
    },
  });

  const startEdit = (brand) => {
    setEditingBrand(brand.id);
    setEditData({
      name: brand.name,
      mission: brand.mission,
      audience: brand.audience,
      tone: brand.tone,
      color_accent: brand.color_accent,
      campaign_objectives: brand.campaign_objectives,
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Configuration</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Settings</h1>
      </motion.div>

      <Tabs defaultValue="brands" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="brands" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="w-4 h-4 mr-2" /> Brands
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sparkles className="w-4 h-4 mr-2" /> AI Settings
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sliders className="w-4 h-4 mr-2" /> General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-4">
          {brands.map(brand => (
            <div key={brand.id} className="glass-panel rounded-xl p-5">
              {editingBrand === brand.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground text-xs">Brand Name</Label>
                      <Input className="bg-secondary border-border mt-1" value={editData.name || ''} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-foreground text-xs">Color Accent</Label>
                      <Input className="bg-secondary border-border mt-1" type="color" value={editData.color_accent || '#c8a44e'} onChange={e => setEditData(p => ({ ...p, color_accent: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground text-xs">Mission</Label>
                    <Textarea className="bg-secondary border-border mt-1" value={editData.mission || ''} onChange={e => setEditData(p => ({ ...p, mission: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs">Tone of Voice</Label>
                    <Input className="bg-secondary border-border mt-1" value={editData.tone || ''} onChange={e => setEditData(p => ({ ...p, tone: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs">Target Audience</Label>
                    <Textarea className="bg-secondary border-border mt-1" value={editData.audience || ''} onChange={e => setEditData(p => ({ ...p, audience: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => updateBrand.mutate({ id: brand.id, data: editData })} className="bg-primary text-primary-foreground">
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                    <Button variant="outline" className="border-border" onClick={() => setEditingBrand(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: `${brand.color_accent}22`, color: brand.color_accent }}>
                      {brand.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground">{brand.tone}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-border text-muted-foreground" onClick={() => startEdit(brand)}>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <h3 className="font-semibold text-foreground">AI Assistance Level</h3>
            {[
              { label: 'Content Suggestions', desc: 'AI suggests post ideas and captions' },
              { label: 'Campaign Recommendations', desc: 'AI recommends campaign strategies' },
              { label: 'Engagement Analysis', desc: 'AI analyzes and classifies engagement' },
              { label: 'Auto-Draft Replies', desc: 'AI drafts reply suggestions for inbox items' },
              { label: 'Proactive Alerts', desc: 'AI alerts you about issues and opportunities' },
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm text-foreground">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <h3 className="font-semibold text-foreground">General Preferences</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground text-xs">Default Timezone</Label>
                <Input className="bg-secondary border-border mt-1" defaultValue="America/New_York" />
              </div>
              <div>
                <Label className="text-foreground text-xs">Notification Email</Label>
                <Input className="bg-secondary border-border mt-1" type="email" placeholder="your@email.com" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">Require Approval Before Publishing</p>
                  <p className="text-xs text-muted-foreground">Posts need admin approval before going live</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}