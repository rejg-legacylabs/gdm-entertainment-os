import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'snapchat'];

export default function SocialAnalytics() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');

  const { data: analytics = [] } = useQuery({
    queryKey: ['analytics', selectedPlatform],
    queryFn: () => base44.entities.SocialAnalytics.filter({ platform: selectedPlatform }, '-date', 30),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['topPosts', selectedPlatform],
    queryFn: () => base44.entities.SocialPost.filter({ platform: [selectedPlatform] }, '-engagement_likes', 10),
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        </div>

        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            {PLATFORMS.map(p => (
              <TabsTrigger key={p} value={p} className="capitalize text-xs">
                {p}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedPlatform} className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Follower Growth */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Follower Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Line
                        type="monotone"
                        dataKey="followers_count"
                        stroke="#A78BFA"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Engagement Rate */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Engagement Rate</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Line
                        type="monotone"
                        dataKey="engagement_rate"
                        stroke="#FF0050"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Reach & Impressions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6 lg:col-span-2">
                  <h3 className="text-lg font-bold text-foreground mb-4">Reach & Impressions</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Bar dataKey="reach" fill="#0A66C2" />
                      <Bar dataKey="impressions" fill="#E4405F" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Top Performing Posts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Top Performing Posts</h3>
                <div className="space-y-3">
                  {posts.slice(0, 5).map(post => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex-1 truncate">
                        <p className="text-sm text-foreground truncate">{post.content.slice(0, 50)}...</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold text-primary">{post.engagement_likes} likes</div>
                        <div className="text-xs text-muted-foreground">{post.engagement_comments} comments</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}