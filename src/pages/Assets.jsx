import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FolderOpen, Upload, Search, Image, FileText, Video, File, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BrandBadge from '@/components/ui-premium/BrandBadge';
import StatusBadge from '@/components/ui-premium/StatusBadge';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';

const typeIcons = {
  image: Image,
  video: Video,
  document: FileText,
  draft: File,
  approved_content: File,
};

export default function Assets() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.ContentAsset.list('-created_date'),
  });

  const queryClient = useQueryClient();
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return base44.entities.ContentAsset.create({
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        file_url,
        status: 'uploaded',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadMutation.mutate(file);
  };

  const filtered = assets.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FolderOpen className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Media Library</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Assets</h1>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search assets..." className="pl-10 bg-secondary border-border" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
            <label>
              <input type="file" className="hidden" onChange={handleUpload} />
              <Button asChild className="bg-primary text-primary-foreground cursor-pointer">
                <span><Upload className="w-4 h-4 mr-2" /> Upload</span>
              </Button>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((asset, i) => {
              const TypeIcon = typeIcons[asset.type] || File;
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-panel rounded-xl overflow-hidden card-hover"
                >
                  {asset.type === 'image' && asset.file_url ? (
                    <div className="h-36 bg-secondary flex items-center justify-center overflow-hidden">
                      <img src={asset.file_url} alt={asset.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-36 bg-secondary/50 flex items-center justify-center">
                      <TypeIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-foreground truncate">{asset.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground capitalize">{asset.type}</span>
                      {asset.brand_name && <BrandBadge name={asset.brand_name} />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full glass-panel rounded-xl p-12 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No assets found</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIInsightPanel
            title="Assets AI Director"
            insights={[
              { title: 'You need more video content', description: 'Only 15% of your assets are videos. Increase to 40% for better engagement.', category: 'content', priority: 'high' },
              { title: 'Organize assets by campaign', description: 'Tag assets with campaign names for faster content production.', category: 'strategy', priority: 'medium' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}