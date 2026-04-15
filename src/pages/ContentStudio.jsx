import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool } from 'lucide-react';
import { toast } from 'sonner';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';
import ContentGeneratorForm from '@/components/content-studio/ContentGeneratorForm';
import GeneratedContentCard from '@/components/content-studio/GeneratedContentCard';

export default function ContentStudio() {
  const [brand, setBrand] = useState('');
  const [platform, setPlatform] = useState('');
  const [contentType, setContentType] = useState('');
  const [tone, setTone] = useState('');
  const [topic, setTopic] = useState('');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const selectedBrand = brands.find(b => b.name === brand);

  const generateContent = async () => {
    if (!brand || !platform || !topic) return;
    setLoading(true);
    const prompt = `You are an elite social media strategist and content director with 20 years of experience. Generate a ${contentType || 'caption'} for ${platform}.

Brand: ${brand}
Brand tone: ${selectedBrand?.tone || tone || 'professional'}
Content pillars: ${(selectedBrand?.content_pillars || []).join(', ')}
Platform: ${platform}
Content type: ${(contentType || 'caption').replace(/_/g, ' ')}
Desired tone: ${tone || 'premium'}
Topic/Brief: ${topic}

Generate a premium, engaging, platform-optimized post. Include relevant hashtags and a strong CTA. Make it feel world-class and professional.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setGenerated(result);
    setLoading(false);
  };

  const refineContent = async (instruction) => {
    if (!generated) return;
    setLoading(true);
    const prompt = `Take this social media post and ${instruction}. Keep it platform-optimized for ${platform}. Brand: ${brand}. Tone: ${tone || 'premium'}.

Original:\n${generated}`;
    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setGenerated(result);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    toast.success('Copied to clipboard');
  };

  const aiInsights = [
    { title: 'Video content outperforms static by 3x', description: 'Consider creating reel ideas and video-first content for maximum reach.', category: 'content', priority: 'high' },
    { title: 'Best-performing hook style: Questions', description: 'Posts starting with a question get 2.4x more engagement for your brands.', category: 'strategy', priority: 'medium' },
    { title: 'Content gap: Testimonial posts', description: 'You haven\'t posted testimonial content in 2 weeks. This content type drives trust.', category: 'warning', priority: 'high' },
  ];

  const refineOptions = [
    { label: 'Rewrite Stronger', instruction: 'rewrite it to be more powerful, compelling, and attention-grabbing' },
    { label: 'More Emotional', instruction: 'make it more emotionally compelling and heartfelt' },
    { label: 'More Premium', instruction: 'elevate the tone to feel more luxury and premium' },
    { label: 'More Urgent', instruction: 'add urgency and a sense of time-sensitivity' },
    { label: 'More Viral', instruction: 'make it more shareable, relatable, and viral-worthy' },
    { label: 'Shorten', instruction: 'make it shorter and punchier while keeping the core message' },
    { label: 'Expand', instruction: 'expand it with more detail, storytelling, and depth' },
    { label: 'Donor-Focused', instruction: 'make it appeal to donors and supporters with impact language' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <PenTool className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Creative Engine</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Content Studio</h1>
        <p className="text-muted-foreground mt-1">AI-powered content creation for all your brands</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Generator */}
        <div className="lg:col-span-2 space-y-6">
          <ContentGeneratorForm
            brand={brand}
            setBrand={setBrand}
            platform={platform}
            setPlatform={setPlatform}
            contentType={contentType}
            setContentType={setContentType}
            tone={tone}
            setTone={setTone}
            topic={topic}
            setTopic={setTopic}
            onGenerate={generateContent}
            loading={loading}
            brands={brands}
            selectedBrand={selectedBrand}
          />

          {/* Output */}
          <AnimatePresence>
            {generated && (
              <GeneratedContentCard
                content={generated}
                platform={platform}
                brand={brand}
                tone={tone}
                onRegenerate={generateContent}
                onRefine={refineContent}
                loading={loading}
              />
            )}
          </AnimatePresence>
        </div>

        {/* AI Panel */}
        <div className="lg:col-span-1">
          <AIInsightPanel title="Content AI Director" insights={aiInsights} />
        </div>
      </div>
    </div>
  );
}