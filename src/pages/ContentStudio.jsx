import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Image, Zap } from 'lucide-react';
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

export default function ContentStudio() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [scheduleTime, setScheduleTime] = useState('');
  const [mode, setMode] = useState('draft'); // draft, schedule, publish
  const queryClient = useQueryClient();

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const addHashtag = () => {
    if (tagInput.trim()) {
      setHashtags([...hashtags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const createPostMutation = useMutation({
    mutationFn: (postData) => base44.entities.SocialPost.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
      setContent('');
      setSelectedPlatforms([]);
      setHashtags([]);
      setMediaUrls([]);
      setScheduleTime('');
    },
  });

  const handlePublish = () => {
    const postData = {
      content,
      platform: selectedPlatforms,
      hashtags,
      media_urls: mediaUrls,
      status: mode === 'draft' ? 'draft' : mode === 'schedule' ? 'scheduled' : 'published',
      scheduled_at: scheduleTime || new Date().toISOString(),
      post_type: 'post',
      organization_id: 'demo-org',
    };
    createPostMutation.mutate(postData);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-foreground mb-6">Content Studio</h1>

            <Card className="p-6 space-y-6">
              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Write your post</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[150px] bg-secondary/50"
                />
                <div className="text-xs text-muted-foreground mt-2">{content.length} characters</div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Select platforms</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map(platform => (
                    <button
                      key={platform.name}
                      onClick={() => togglePlatform(platform.name)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        selectedPlatforms.includes(platform.name)
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-muted text-muted-foreground hover:border-primary'
                      }`}
                      style={
                        selectedPlatforms.includes(platform.name)
                          ? { borderColor: platform.color, backgroundColor: `${platform.color}20` }
                          : {}
                      }
                    >
                      {platform.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media & Hashtags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" /> Media
                  </label>
                  <Input placeholder="Paste media URL..." className="bg-secondary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hashtags</label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                      placeholder="#hashtag"
                      className="bg-secondary/50"
                    />
                    <Button onClick={addHashtag} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hashtags.map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeHashtag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Schedule
                </label>
                <Input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setMode('draft')} className="flex-1">
                  Save Draft
                </Button>
                <Button variant="outline" onClick={() => setMode('schedule')} className="flex-1">
                  Schedule
                </Button>
                <Button onClick={() => { setMode('publish'); handlePublish(); }} className="flex-1 bg-primary">
                  <Zap className="w-4 h-4 mr-2" /> Publish Now
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="sticky top-8 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Preview</h3>
            {selectedPlatforms.length > 0 ? (
              selectedPlatforms.map(platform => (
                <Card key={platform} className="p-4 space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">
                    {PLATFORMS.find(p => p.name === platform)?.label}
                  </div>
                  <p className="text-sm text-foreground break-words">{content.slice(0, 100)}</p>
                  {hashtags.length > 0 && (
                    <p className="text-xs text-primary">{hashtags.join(' ')}</p>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-4 text-center text-muted-foreground">
                Select a platform to preview
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}