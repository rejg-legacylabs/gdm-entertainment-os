import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, X, Plus, Loader2 } from 'lucide-react';

const sourceTypes = [
  { value: 'url', label: 'Website URL', icon: '🌐', placeholder: 'https://example.com' },
  { value: 'document', label: 'Document/PDF', icon: '📄', placeholder: 'Upload or paste text...' },
  { value: 'transcript', label: 'Video Transcript', icon: '📝', placeholder: 'Paste video transcript...' },
  { value: 'notes', label: 'Campaign Notes', icon: '📋', placeholder: 'Any notes or ideas...' },
];

export default function InformationSources({ data, onNext }) {
  const [sources, setSources] = useState(data.sources || []);
  const [newSource, setNewSource] = useState({ type: 'url', content: '' });
  const [analyzing, setAnalyzing] = useState(false);

  const addSource = () => {
    if (newSource.content.trim()) {
      setSources([...sources, { ...newSource, id: Date.now() }]);
      setNewSource({ type: 'url', content: '' });
    }
  };

  const removeSource = (id) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const handleAnalyze = async () => {
    if (sources.length === 0) return;
    
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(r => setTimeout(r, 2000));
    
    // Create analysis from sources
    const analysis = {
      summary: `Found ${sources.length} sources with key insights about the campaign topic.`,
      contentPillars: ['Storytelling', 'Community Impact', 'Call to Action'],
      storyAngles: [
        'Personal transformation story',
        'Behind-the-scenes perspective',
        'Impact metrics and results',
        'Team member spotlight',
        'Community feedback highlight',
      ],
      themes: sources.map(s => s.type.toUpperCase()).join(', '),
    };

    onNext({
      sources,
      analysis,
    });
    setAnalyzing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Information Sources</h2>
        <p className="text-muted-foreground">Add websites, documents, videos, or notes. AI will analyze and extract insights.</p>
      </div>

      <div className="space-y-6">
        {/* Add New Source */}
        <div className="bg-secondary/30 border border-border rounded-lg p-6 space-y-4">
          <div>
            <Label className="text-foreground font-medium mb-3 block">Source Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {sourceTypes.map(t => (
                <button
                  key={t.value}
                  onClick={() => setNewSource(p => ({ ...p, type: t.value }))}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    newSource.type === t.value
                      ? 'bg-primary/20 border-primary/50'
                      : 'bg-transparent border-border hover:border-border/70'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <p className="text-xs font-medium text-foreground mt-1">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-foreground font-medium">Content</Label>
            {newSource.type === 'url' ? (
              <Input
                className="mt-2 bg-background border-border"
                placeholder={sourceTypes.find(t => t.value === newSource.type)?.placeholder}
                value={newSource.content}
                onChange={(e) => setNewSource(p => ({ ...p, content: e.target.value }))}
              />
            ) : (
              <Textarea
                className="mt-2 bg-background border-border"
                placeholder={sourceTypes.find(t => t.value === newSource.type)?.placeholder}
                value={newSource.content}
                onChange={(e) => setNewSource(p => ({ ...p, content: e.target.value }))}
                rows={4}
              />
            )}
          </div>

          <Button
            onClick={addSource}
            disabled={!newSource.content.trim()}
            variant="outline"
            className="gap-2 w-full"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </Button>
        </div>

        {/* Sources List */}
        {sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-foreground">{sources.length} source{sources.length !== 1 ? 's' : ''} added</p>
            {sources.map((source, idx) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg border border-border"
              >
                <span className="text-lg flex-shrink-0">
                  {sourceTypes.find(t => t.value === source.type)?.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase">{source.type}</p>
                  <p className="text-sm text-foreground mt-1 line-clamp-2">{source.content}</p>
                </div>
                <button
                  onClick={() => removeSource(source.id)}
                  className="text-muted-foreground hover:text-destructive transition flex-shrink-0 mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-xs font-medium text-blue-300">💡 Pro Tip</p>
          <p className="text-xs text-muted-foreground mt-1">
            The more sources you add, the better AI can understand your campaign's context and generate relevant content.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleAnalyze}
          disabled={sources.length === 0 || analyzing}
          className="gap-2"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Sources
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}