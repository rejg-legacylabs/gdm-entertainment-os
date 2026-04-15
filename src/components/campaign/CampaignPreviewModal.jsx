import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Play, Pause, SkipForward, Calendar, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CampaignTimeline from '@/components/campaign/CampaignTimeline';
import PostPlatformPreview from '@/components/campaign/PostPlatformPreview';
import CampaignRolloutSimulation from '@/components/campaign/CampaignRolloutSimulation';

export default function CampaignPreviewModal({ campaign, posts = [], isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedPost, setSelectedPost] = useState(null);

  if (!campaign) return null;

  const campaignPosts = posts.filter(p => p.campaign_name === campaign.name);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border/30 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{campaign.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {campaign.type} • {campaignPosts.length} posts • {campaign.platforms?.join(', ')}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
              <TabsTrigger value="timeline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="posts" className="gap-2">
                <Eye className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="simulation" className="gap-2">
                <Play className="w-4 h-4" />
                Simulation
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <Settings className="w-4 h-4" />
                Details
              </TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4">
              <CampaignTimeline campaign={campaign} posts={campaignPosts} />
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {campaignPosts.length > 0 ? (
                  campaignPosts.map((post, idx) => (
                    <motion.button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="w-full text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm line-clamp-1">{post.caption}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.platform} • {post.content_type} • {post.scheduled_date}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary ml-2 flex-shrink-0">
                          {post.status}
                        </span>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No posts in this campaign</div>
                )}
              </div>

              {/* Post Preview */}
              <AnimatePresence>
                {selectedPost && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-t border-border/30 pt-4"
                  >
                    <PostPlatformPreview post={selectedPost} />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Simulation Tab */}
            <TabsContent value="simulation" className="space-y-4">
              <CampaignRolloutSimulation campaign={campaign} posts={campaignPosts} />
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-1">Objective</p>
                  <p className="font-medium text-foreground">{campaign.objective}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-1">Target Audience</p>
                  <p className="font-medium text-foreground">{campaign.target_audience}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium text-foreground">{campaign.start_date} to {campaign.end_date}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                  <p className="font-medium text-foreground">{campaign.content_frequency}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}