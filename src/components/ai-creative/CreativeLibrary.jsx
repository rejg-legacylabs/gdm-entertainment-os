import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Grid3x3, Star, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreativeLibrary({ campaignId }) {
  const [selectedCreative, setSelectedCreative] = useState(null);

  const { data: creatives = [] } = useQuery({
    queryKey: ['generatedCreatives', campaignId],
    queryFn: () =>
      base44.entities.GeneratedCreative.filter({ campaign_id: campaignId }),
  });

  const favorites = creatives.filter((c) => c.is_favorite);
  const drafts = creatives.filter((c) => c.approval_status === 'draft');
  const approved = creatives.filter((c) => c.approval_status === 'approved');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-primary" />
          Creative Library
        </h3>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Favorites ({favorites.length})
          </h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {favorites.map((creative) => (
              <CreativeCard
                key={creative.id}
                creative={creative}
                onSelect={setSelectedCreative}
              />
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Approved ({approved.length})
          </h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {approved.map((creative) => (
              <CreativeCard
                key={creative.id}
                creative={creative}
                onSelect={setSelectedCreative}
              />
            ))}
          </div>
        </div>
      )}

      {/* Drafts */}
      {drafts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Drafts ({drafts.length})
          </h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {drafts.map((creative) => (
              <CreativeCard
                key={creative.id}
                creative={creative}
                onSelect={setSelectedCreative}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {creatives.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No creatives generated yet. Start by generating an image ad or creative set.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCreative && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCreative(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <img
                src={selectedCreative.image_url}
                alt="Creative detail"
                className="w-full rounded-lg"
              />

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {selectedCreative.creative_type}
                  </p>
                </div>

                {selectedCreative.headline && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Headline</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedCreative.headline}
                    </p>
                  </div>
                )}

                {selectedCreative.caption && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Caption</p>
                    <p className="text-sm text-foreground">
                      {selectedCreative.caption}
                    </p>
                  </div>
                )}

                {selectedCreative.hashtag_suggestions?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Hashtags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCreative.hashtag_suggestions.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedCreative(null)}
                >
                  Close
                </Button>
                <Button className="flex-1 bg-primary gap-2">
                  <Download className="w-4 h-4" />
                  Use This Creative
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function CreativeCard({ creative, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={() => onSelect(creative)}
      className="group rounded-lg overflow-hidden border border-border/30 hover:border-primary/50 transition-all"
    >
      <div className="relative h-40 overflow-hidden bg-secondary/30">
        <img
          src={creative.image_url}
          alt={creative.creative_type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="p-3 bg-secondary/20 space-y-2">
        <p className="text-xs font-medium text-foreground capitalize">
          {creative.creative_type.replace('_', ' ')}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded capitalize ${
              creative.approval_status === 'approved'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {creative.approval_status}
          </span>
          {creative.is_favorite && (
            <Star className="w-3 h-3 fill-primary text-primary" />
          )}
        </div>
      </div>
    </motion.button>
  );
}