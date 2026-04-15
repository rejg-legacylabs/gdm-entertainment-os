import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Grid3x3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import ImageAdGenerator from '@/components/ai-creative/ImageAdGenerator';
import CreativeSetBuilder from '@/components/ai-creative/CreativeSetBuilder';
import CreativeLibrary from '@/components/ai-creative/CreativeLibrary';

export default function AICreativeStudio() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  // Auto-select first campaign and brand
  useEffect(() => {
    if (campaigns.length && !selectedCampaign) {
      setSelectedCampaign(campaigns[0]);
    }
    if (brands.length && !selectedBrand) {
      setSelectedBrand(brands[0]);
    }
  }, [campaigns, brands, selectedCampaign, selectedBrand]);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="AI Creative Studio"
        subtitle="Generate branded social graphics, ad creatives, and ready-to-publish content"
      />

      {/* Campaign & Brand Selection */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Campaign
          </label>
          <select
            value={selectedCampaign?.id || ''}
            onChange={(e) => {
              const campaign = campaigns.find(
                (c) => c.id === e.target.value
              );
              setSelectedCampaign(campaign);
            }}
            className="w-full p-3 rounded-lg border border-border bg-secondary/30 text-foreground"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Brand
          </label>
          <select
            value={selectedBrand?.id || ''}
            onChange={(e) => {
              const brand = brands.find((b) => b.id === e.target.value);
              setSelectedBrand(brand);
            }}
            className="w-full p-3 rounded-lg border border-border bg-secondary/30 text-foreground"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCampaign && selectedBrand ? (
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="set" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Creative Set
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <Grid3x3 className="w-4 h-4" />
              Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <ImageAdGenerator
              campaign={selectedCampaign}
              brand={selectedBrand}
              onCreativeGenerated={(creative) => {
                // Could save to database here
              }}
            />
          </TabsContent>

          <TabsContent value="set" className="space-y-6">
            <CreativeSetBuilder
              campaign={selectedCampaign}
              brand={selectedBrand}
              onSetGenerated={(set) => {
                // Could save to database here
              }}
            />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <CreativeLibrary campaignId={selectedCampaign.id} />
          </TabsContent>
        </Tabs>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            No campaigns or brands available. Create one to get started.
          </p>
        </motion.div>
      )}
    </div>
  );
}