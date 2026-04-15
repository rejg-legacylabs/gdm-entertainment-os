import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Video, Type } from 'lucide-react';

const platformConfigs = {
  instagram: {
    name: 'Instagram',
    width: 400,
    height: 500,
    format: 'Portrait',
    icon: '📷',
  },
  facebook: {
    name: 'Facebook',
    width: 500,
    height: 'auto',
    format: 'Feed',
    icon: 'f',
  },
  linkedin: {
    name: 'LinkedIn',
    width: 500,
    height: 'auto',
    format: 'Feed',
    icon: '🔗',
  },
  tiktok: {
    name: 'TikTok',
    width: 360,
    height: 640,
    format: 'Vertical Video',
    icon: '🎵',
  },
  youtube: {
    name: 'YouTube',
    width: 640,
    height: 360,
    format: 'Horizontal Video',
    icon: '▶️',
  },
  twitter: {
    name: 'X (Twitter)',
    width: 500,
    height: 'auto',
    format: 'Tweet',
    icon: '𝕏',
  },
};

export default function PostPlatformPreview({ post }) {
  const [selectedPlatform, setSelectedPlatform] = useState(post.platform || 'instagram');
  const platforms = post.platform ? [post.platform] : Object.keys(platformConfigs);
  const config = platformConfigs[selectedPlatform];

  if (!config) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Platform Preview</h3>
        
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <TabsList className="grid w-full gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(platforms.length, 6)}, 1fr)` }}>
            {platforms.map(platform => (
              <TabsTrigger key={platform} value={platform} className="text-xs">
                {platformConfigs[platform]?.icon}
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map(platform => (
            <TabsContent key={platform} value={platform} className="flex justify-center">
              <PlatformMockup
                platform={platform}
                config={platformConfigs[platform]}
                post={post}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Metadata */}
      <div className="grid sm:grid-cols-2 gap-3 border-t border-border/30 pt-4">
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
          <p className="font-medium text-foreground text-sm">{post.scheduled_date || 'Not scheduled'}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <p className="font-medium text-foreground text-sm capitalize">{post.status}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">Type</p>
          <p className="font-medium text-foreground text-sm capitalize">{post.content_type}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="text-xs text-muted-foreground mb-1">CTA</p>
          <p className="font-medium text-foreground text-sm">{post.cta || 'No CTA'}</p>
        </div>
      </div>
    </div>
  );
}

function PlatformMockup({ platform, config, post }) {
  const isPlatform = (p) => platform === p;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="my-4"
    >
      {isPlatform('instagram') && (
        <div
          className="rounded-2xl border-8 border-black bg-black overflow-hidden shadow-2xl"
          style={{ width: 320, height: 580 }}
        >
          <div className="bg-card h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                <span className="text-xs font-semibold text-foreground">{post.brand_name}</span>
              </div>
              <span className="text-muted-foreground">•••</span>
            </div>

            {/* Image */}
            {post.media_url ? (
              <div className="aspect-square bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                <Video className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            {/* Actions */}
            <div className="px-4 py-2 border-b border-border/30 flex gap-3">
              <span className="text-lg">❤️</span>
              <span className="text-lg">💬</span>
              <span className="text-lg">↗️</span>
            </div>

            {/* Caption */}
            <div className="px-4 py-3 text-xs text-foreground line-clamp-4 flex-1">
              <p className="font-semibold mb-1">{post.brand_name}</p>
              <p className="text-muted-foreground">{post.caption}</p>
              {post.hashtags && post.hashtags.length > 0 && (
                <p className="text-primary mt-2">{post.hashtags.join(' ')}</p>
              )}
            </div>

            {/* CTA */}
            {post.cta && (
              <div className="px-4 py-2 border-t border-border/30">
                <p className="text-xs font-semibold text-primary">{post.cta}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isPlatform('facebook') && (
        <div className="rounded-lg border border-border/50 bg-card overflow-hidden shadow-lg" style={{ width: 420, maxWidth: '100%' }}>
          <div className="p-3 border-b border-border/30 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-foreground">{post.brand_name}</p>
              <p className="text-muted-foreground">Just now</p>
            </div>
          </div>
          <div className="p-3 text-sm text-foreground">{post.caption}</div>
          {post.media_url && (
            <div className="bg-secondary/50 aspect-video flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="p-3 flex gap-4 border-t border-border/30 text-xs text-muted-foreground">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>↗️ Share</span>
          </div>
        </div>
      )}

      {isPlatform('linkedin') && (
        <div className="rounded-lg border border-border/50 bg-card overflow-hidden shadow-lg" style={{ width: 420, maxWidth: '100%' }}>
          <div className="p-3 border-b border-border/30 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-foreground">{post.brand_name}</p>
              <p className="text-muted-foreground">Professional content</p>
            </div>
          </div>
          <div className="p-3 text-sm text-foreground">{post.caption}</div>
          {post.media_url && (
            <div className="bg-secondary/50 aspect-video flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="p-3 flex gap-4 border-t border-border/30 text-xs text-muted-foreground">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>↗️ Share</span>
          </div>
        </div>
      )}

      {isPlatform('tiktok') && (
        <div className="rounded-3xl border-8 border-black bg-black overflow-hidden shadow-2xl" style={{ width: 280, height: 500 }}>
          <div className="bg-gradient-to-br from-secondary to-secondary/50 h-full flex flex-col items-center justify-center text-muted-foreground">
            <Video className="w-16 h-16 mb-2" />
            <p className="text-xs text-center px-4">{post.caption}</p>
          </div>
        </div>
      )}

      {isPlatform('youtube') && (
        <div className="rounded-lg border border-border/50 bg-card overflow-hidden shadow-lg" style={{ width: 560, maxWidth: '100%' }}>
          <div className="bg-secondary/50 aspect-video flex items-center justify-center">
            <Video className="w-20 h-20 text-muted-foreground" />
          </div>
          <div className="p-3">
            <p className="font-semibold text-sm text-foreground line-clamp-2">{post.caption}</p>
            <p className="text-xs text-muted-foreground mt-1">{post.brand_name}</p>
          </div>
        </div>
      )}

      {isPlatform('twitter') && (
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg" style={{ width: 420, maxWidth: '100%' }}>
          <div className="p-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm text-foreground">{post.brand_name}</p>
                <span className="text-xs text-muted-foreground">@brand</span>
              </div>
              <p className="text-sm text-foreground mt-2 break-words">{post.caption}</p>
              {post.hashtags && post.hashtags.length > 0 && (
                <p className="text-primary text-sm mt-1">{post.hashtags.slice(0, 3).join(' ')}</p>
              )}
              <div className="flex gap-8 mt-3 text-xs text-muted-foreground border-t border-border/30 pt-2">
                <span>💬 Reply</span>
                <span>🔄 Retweet</span>
                <span>❤️ Like</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}