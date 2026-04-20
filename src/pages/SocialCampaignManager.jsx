import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const CAMPAIGN_TYPES = ['donor_drive', 'awareness', 'program_promotion', 'volunteer_recruitment', 'fundraiser', 'event_promotion'];
const GOAL_TYPES = ['donations', 'followers', 'engagement', 'applications'];
const PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'snapchat'];

export default function SocialCampaignManager() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: 'awareness',
    description: '',
    start_date: '',
    end_date: '',
    target_platforms: [],
    goal_type: 'engagement',
    goal_amount: 0,
  });
  const queryClient = useQueryClient();

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.SocialCampaign.filter({ organization_id: 'demo-org' }),
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data) => base44.entities.SocialCampaign.create({ ...data, organization_id: 'demo-org', status: 'draft' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setFormData({
        campaign_name: '',
        campaign_type: 'awareness',
        description: '',
        start_date: '',
        end_date: '',
        target_platforms: [],
        goal_type: 'engagement',
        goal_amount: 0,
      });
      setShowForm(false);
    },
  });

  const togglePlatform = (platform) => {
    setFormData(prev => ({
      ...prev,
      target_platforms: prev.target_platforms.includes(platform)
        ? prev.target_platforms.filter(p => p !== platform)
        : [...prev.target_platforms, platform],
    }));
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const daysRemaining = (campaign) => {
    const end = new Date(campaign.end_date);
    const now = new Date();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Campaign Manager</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary">
            <Plus className="w-4 h-4 mr-2" /> New Campaign
          </Button>
        </div>

        {/* Create Campaign Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Campaign name"
                  value={formData.campaign_name}
                  onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                  className="bg-secondary/50"
                />
                <select
                  value={formData.campaign_type}
                  onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value })}
                  className="px-3 py-2 bg-secondary/50 rounded-md text-foreground border border-border"
                >
                  {CAMPAIGN_TYPES.map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-secondary/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="bg-secondary/50"
                />
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Platforms</label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`p-2 rounded text-xs font-medium transition-all ${
                        formData.target_platforms.includes(p)
                          ? 'bg-primary text-white'
                          : 'bg-secondary/50 text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.goal_type}
                  onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                  className="px-3 py-2 bg-secondary/50 rounded-md text-foreground border border-border"
                >
                  {GOAL_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Goal amount"
                  value={formData.goal_amount}
                  onChange={(e) => setFormData({ ...formData, goal_amount: parseInt(e.target.value) })}
                  className="bg-secondary/50"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => createCampaignMutation.mutate(formData)}
                  className="flex-1 bg-primary"
                >
                  Create Campaign
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Active Campaigns */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Active Campaigns</h2>
          {activeCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCampaigns.map(campaign => (
                <motion.div key={campaign.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{campaign.campaign_name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{campaign.campaign_type.replace(/_/g, ' ')}</p>
                      </div>
                      <Badge variant="outline">{campaign.status}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">
                          {campaign.current_amount} / {campaign.goal_amount}
                        </span>
                      </div>
                      <Progress
                        value={(campaign.current_amount / campaign.goal_amount) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {campaign.target_platforms.slice(0, 3).map(p => (
                        <Badge key={p} variant="secondary" className="text-xs capitalize">
                          {p}
                        </Badge>
                      ))}
                      {campaign.target_platforms.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{campaign.target_platforms.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {daysRemaining(campaign)} days remaining
                    </div>

                    <Button variant="outline" className="w-full text-xs">
                      View Details
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No active campaigns. Create one to get started!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}