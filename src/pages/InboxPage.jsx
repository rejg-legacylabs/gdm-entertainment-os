import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Inbox, MessageSquare, Filter, Sparkles, Send, Flag, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BrandBadge from '@/components/ui-premium/BrandBadge';
import StatusBadge from '@/components/ui-premium/StatusBadge';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';

const sentimentColors = {
  positive: 'text-emerald-400',
  neutral: 'text-muted-foreground',
  negative: 'text-red-400',
  urgent: 'text-amber-400',
};

export default function InboxPage() {
  const queryClient = useQueryClient();
  const [brandFilter, setBrandFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => base44.entities.InboxItem.list('-created_date'),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.InboxItem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const filtered = items.filter(item => {
    const matchBrand = brandFilter === 'all' || item.brand_name === brandFilter;
    const matchSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
    return matchBrand && matchSentiment;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Inbox className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Engagement Hub</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Inbox</h1>
        <p className="text-muted-foreground mt-1">Unified engagement center across all brands</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border"><SelectValue placeholder="All Brands" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border"><SelectValue placeholder="Sentiment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* List */}
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
              {filtered.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(item)}
                  className={`w-full text-left glass-panel rounded-lg p-4 card-hover ${
                    selected?.id === item.id ? 'border-primary/30 bg-primary/5' : ''
                  } ${item.status === 'new' ? 'border-l-2 border-l-primary' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{item.author_name}</span>
                    <StatusBadge status={item.priority} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.message}</p>
                  <div className="flex items-center gap-2">
                    <BrandBadge name={item.brand_name} />
                    <span className={`text-xs capitalize ${sentimentColors[item.sentiment]}`}>{item.sentiment}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Detail */}
            {selected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl p-5 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{selected.author_name}</h3>
                    <span className="text-xs text-muted-foreground">@{selected.author_handle}</span>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={selected.type} />
                    <StatusBadge status={selected.sentiment} />
                  </div>
                </div>

                <BrandBadge name={selected.brand_name} size="md" />

                <div className="mt-4 p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-foreground">{selected.message}</p>
                </div>

                {selected.suggested_reply && (
                  <div className="mt-4">
                    <p className="text-xs text-primary flex items-center gap-1 mb-2">
                      <Sparkles className="w-3 h-3" /> AI Suggested Reply
                    </p>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-foreground">
                      {selected.suggested_reply}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-primary text-primary-foreground flex-1" onClick={() => updateMutation.mutate({ id: selected.id, data: { status: 'replied' } })}>
                    <Send className="w-3.5 h-3.5 mr-1" /> Mark Replied
                  </Button>
                  <Button size="sm" variant="outline" className="border-border" onClick={() => updateMutation.mutate({ id: selected.id, data: { status: 'flagged' } })}>
                    <Flag className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-border" onClick={() => updateMutation.mutate({ id: selected.id, data: { status: 'archived' } })}>
                    <Archive className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel rounded-xl p-8 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIInsightPanel
            title="Engagement AI Director"
            insights={[
              { title: '5 urgent messages need attention', description: 'Prioritize responses to negative sentiment and lead inquiries.', category: 'warning', priority: 'critical' },
              { title: 'Response time is above average', description: 'Aim to respond within 2 hours to maintain brand reputation.', category: 'strategy', priority: 'high' },
              { title: '3 potential leads detected', description: 'Messages from interested prospects. Send personalized follow-ups.', category: 'growth', priority: 'high' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}