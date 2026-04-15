import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Search, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BrandBadge from '@/components/ui-premium/BrandBadge';
import StatusBadge from '@/components/ui-premium/StatusBadge';
import ScoreRing from '@/components/ui-premium/ScoreRing';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';

const campaignTypes = ['donor', 'fundraising', 'awareness', 'recruiting', 'hiring', 'event', 'storytelling', 'nonprofit_outreach', 'transitional_housing', 'community_engagement', 'brand_growth'];

export default function Campaigns() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', brand_name: '', type: '', objective: '', target_audience: '', status: 'draft' });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list('-created_date'),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Campaign.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setShowCreate(false);
      setNewCampaign({ name: '', brand_name: '', type: '', objective: '', target_audience: '', status: 'draft' });
    },
  });

  const filtered = campaigns.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const aiInsights = [
    { title: 'Launch a donor campaign for HQ of Hope', description: 'Spring is peak giving season. A targeted donor campaign could increase donations by 30%.', category: 'campaign', priority: 'high' },
    { title: 'GDM needs an event campaign', description: 'Upcoming events lack social coverage. Create a pre/during/post event content series.', category: 'content', priority: 'high' },
    { title: '2 campaigns ending this week', description: 'Review results and plan follow-up campaigns to maintain momentum.', category: 'strategy', priority: 'medium' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Megaphone className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Campaign Hub</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Campaigns</h1>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search campaigns..." className="pl-10 bg-secondary border-border" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create Campaign</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-foreground">Campaign Name</Label>
                    <Input className="bg-secondary border-border mt-1" value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-foreground">Brand</Label>
                    <Select value={newCampaign.brand_name} onValueChange={v => setNewCampaign(p => ({ ...p, brand_name: v }))}>
                      <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue placeholder="Select brand" /></SelectTrigger>
                      <SelectContent>
                        {brands.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground">Type</Label>
                    <Select value={newCampaign.type} onValueChange={v => setNewCampaign(p => ({ ...p, type: v }))}>
                      <SelectTrigger className="bg-secondary border-border mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {campaignTypes.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground">Objective</Label>
                    <Textarea className="bg-secondary border-border mt-1" value={newCampaign.objective} onChange={e => setNewCampaign(p => ({ ...p, objective: e.target.value }))} />
                  </div>
                  <Button onClick={() => createMutation.mutate(newCampaign)} disabled={!newCampaign.name || !newCampaign.brand_name} className="w-full bg-primary text-primary-foreground">
                    Create Campaign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Campaign List */}
          <div className="space-y-3">
            {filtered.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel rounded-xl p-5 card-hover"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <BrandBadge name={campaign.brand_name} />
                      <span className="text-xs text-muted-foreground capitalize">{(campaign.type || '').replace(/_/g, ' ')}</span>
                      {campaign.start_date && <span className="text-xs text-muted-foreground">{campaign.start_date} → {campaign.end_date || '...'}</span>}
                    </div>
                    {campaign.objective && <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{campaign.objective}</p>}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center hidden sm:block">
                      <p className="text-sm font-bold text-foreground">{(campaign.total_posts || 0)}</p>
                      <p className="text-[10px] text-muted-foreground">Posts</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-sm font-bold text-foreground">{(campaign.total_engagement || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Engagement</p>
                    </div>
                    <ScoreRing score={campaign.health_score || 70} size={45} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIInsightPanel title="Campaign AI Director" insights={aiInsights} />
        </div>
      </div>
    </div>
  );
}