import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, LogOut, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const PLATFORMS = [
  {
    name: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    instructions: 'Create a Meta Developer App at developers.facebook.com. Get pages_manage_posts permission.',
    difficulty: 'medium',
  },
  {
    name: 'instagram',
    label: 'Instagram',
    color: '#E4405F',
    instructions: 'Use same Meta Developer App with instagram_content_publish permission.',
    difficulty: 'medium',
  },
  {
    name: 'twitter',
    label: 'Twitter/X',
    color: '#000000',
    instructions: 'Create app at developer.twitter.com. Enable OAuth 2.0 and tweet.write scope.',
    difficulty: 'easy',
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    color: '#0A66C2',
    instructions: 'Create app at developer.linkedin.com. Get w_member_social permission.',
    difficulty: 'easy',
  },
  {
    name: 'tiktok',
    label: 'TikTok',
    color: '#FF0050',
    instructions: 'Set up TikTok for Business account. Request video.publish permission.',
    difficulty: 'medium',
  },
  {
    name: 'youtube',
    label: 'YouTube',
    color: '#FF0000',
    instructions: 'Enable YouTube API in Google Cloud Console. Use youtube.upload scope.',
    difficulty: 'easy',
  },
  {
    name: 'pinterest',
    label: 'Pinterest',
    color: '#E60023',
    instructions: 'Create app at developers.pinterest.com. Get boards:write and pins:write permissions.',
    difficulty: 'easy',
  },
  {
    name: 'snapchat',
    label: 'Snapchat',
    color: '#FFFC00',
    instructions: 'Apply for Snap Kit Developer approval. Get Creative Kit permissions.',
    difficulty: 'hard',
  },
];

export default function PlatformConnections() {
  const { data: accounts = [] } = useQuery({
    queryKey: ['socialAccounts'],
    queryFn: () => base44.entities.SocialAccount.list(),
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400';
      case 'hard':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-secondary text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <AlertCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Platform Connections</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLATFORMS.map((platform, idx) => {
            const account = accounts.find(a => a.platform === platform.name);
            return (
              <motion.div key={platform.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                <Card className="p-6 space-y-4 border-l-4" style={{ borderLeftColor: platform.color }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{platform.label}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{platform.difficulty} setup</p>
                    </div>
                    <Badge className={getDifficultyColor(platform.difficulty)} variant="outline">
                      {platform.difficulty}
                    </Badge>
                  </div>

                  {account && (
                    <div className="bg-secondary/50 p-3 rounded-lg space-y-1">
                      <div className="text-sm text-foreground">
                        <span className="font-semibold">Account:</span> {account.account_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {account.follower_count.toLocaleString()} followers
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Token expires: {new Date(account.token_expires_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">{platform.instructions}</p>

                  <div className="flex gap-2">
                    {account ? (
                      <>
                        <Button size="sm" variant="outline" className="flex-1 gap-2 text-xs">
                          <RefreshCw className="w-3 h-3" /> Sync Now
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-2 text-xs text-destructive">
                          <LogOut className="w-3 h-3" /> Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full gap-2 text-xs"
                        style={{ backgroundColor: platform.color }}
                      >
                        <LogIn className="w-3 h-3" /> Connect
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}