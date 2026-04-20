import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radio, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const PLATFORMS = [
  { name: 'facebook', color: '#1877F2', label: 'Facebook' },
  { name: 'instagram', color: '#E4405F', label: 'Instagram' },
  { name: 'twitter', color: '#000000', label: 'Twitter/X' },
  { name: 'linkedin', color: '#0A66C2', label: 'LinkedIn' },
  { name: 'tiktok', color: '#FF0050', label: 'TikTok' },
  { name: 'youtube', color: '#FF0000', label: 'YouTube' },
  { name: 'pinterest', color: '#E60023', label: 'Pinterest' },
  { name: 'snapchat', color: '#FFFC00', label: 'Snapchat' },
];

export default function SocialCommandCenter() {
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.organization_id) setOrgId(user.organization_id);
    });
  }, []);

  const { data: accounts = [] } = useQuery({
    queryKey: ['socialAccounts', orgId],
    queryFn: () => orgId ? base44.entities.SocialAccount.filter({ organization_id: orgId }) : [],
    enabled: !!orgId,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['socialPosts', orgId],
    queryFn: () => orgId ? base44.entities.SocialPost.filter({ organization_id: orgId, status: 'scheduled' }) : [],
    enabled: !!orgId,
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['socialCampaigns', orgId],
    queryFn: () => orgId ? base44.entities.SocialCampaign.filter({ organization_id: orgId, status: 'active' }) : [],
    enabled: !!orgId,
  });

  const totalFollowers = accounts.reduce((sum, acc) => sum + (acc.follower_count || 0), 0);
  const postsThisMonth = posts.filter(p => new Date(p.created_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
  const avgEngagement = posts.length > 0
    ? (posts.reduce((sum, p) => sum + ((p.engagement_likes || 0) + (p.engagement_comments || 0)), 0) / posts.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Social Command Center</h1>
          </div>
          <p className="text-muted-foreground">Manage all your social media platforms in one place</p>
        </motion.div>

        {/* Platform Connection Status */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Platform Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORMS.map((platform) => {
              const account = accounts.find(a => a.platform === platform.name);
              return (
                <motion.div key={platform.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card
                    className="p-4 border-t-2 hover:shadow-lg transition-all"
                    style={{ borderTopColor: platform.color }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{platform.label}</span>
                        <Badge
                          variant={account?.status === 'connected' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {account?.status || 'disconnected'}
                        </Badge>
                      </div>
                      {account && (
                        <>
                          <div className="text-xs text-muted-foreground">
                            <div>@{account.account_handle}</div>
                            <div className="mt-1">{account.follower_count.toLocaleString()} followers</div>
                          </div>
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            Reconnect
                          </Button>
                        </>
                      )}
                      {!account && (
                        <Button size="sm" className="w-full text-xs" style={{ backgroundColor: platform.color }}>
                          Connect
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Today's Scheduled Posts */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Today's Scheduled Posts</h2>
          <Card className="p-6 space-y-4">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="text-foreground font-medium truncate max-w-md">{post.content.slice(0, 60)}...</p>
                    <div className="flex gap-2 mt-2">
                      {post.platform.map(p => {
                        const plat = PLATFORMS.find(x => x.name === p);
                        return <Badge key={p} style={{ backgroundColor: plat?.color }}>{p}</Badge>;
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(post.scheduled_at).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No posts scheduled for today</p>
            )}
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="text-3xl font-bold text-foreground">{totalFollowers.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Followers</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-accent">
            <div className="text-3xl font-bold text-foreground">{postsThisMonth}</div>
            <p className="text-sm text-muted-foreground">Posts This Month</p>
          </Card>
          <Card className="p-6 border-l-4" style={{ borderLeftColor: '#A78BFA' }}>
            <div className="text-3xl font-bold text-foreground">{avgEngagement}</div>
            <p className="text-sm text-muted-foreground">Avg Engagement</p>
          </Card>
          <Card className="p-6 border-l-4" style={{ borderLeftColor: '#FF0050' }}>
            <div className="text-3xl font-bold text-foreground">{campaigns.length}</div>
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
          </Card>
        </div>
      </div>
    </div>
  );
}