import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Link2, FileText, Youtube, Plus, Trash2 } from 'lucide-react';

export default function InformationSources({ onNext }) {
  const [sources, setSources] = useState([]);
  const [currentSource, setCurrentSource] = useState({ type: 'website', value: '' });

  const sourceTypes = [
    { id: 'website', label: 'Website URL', icon: Link2, placeholder: 'https://example.com' },
    { id: 'video', label: 'Video URL (YouTube)', icon: Youtube, placeholder: 'https://youtube.com/watch?v=...' },
    { id: 'transcript', label: 'Transcript / Script', icon: FileText, placeholder: 'Paste transcript text here...' },
    { id: 'document', label: 'Upload Document', icon: Upload, placeholder: 'PDF, Word, Text' },
    { id: 'notes', label: 'Campaign Notes', icon: FileText, placeholder: 'Key messages, talking points, ideas...' },
  ];

  const addSource = () => {
    if (currentSource.value.trim()) {
      setSources([...sources, { ...currentSource, id: Date.now() }]);
      setCurrentSource({ type: 'website', value: '' });
    }
  };

  const removeSource = (id) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const handleSubmit = () => {
    onNext({ sources });
  };

  const currentSourceConfig = sourceTypes.find(s => s.id === currentSource.type);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">Information Sources</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Provide content and details. AI will analyze and extract campaign ideas.
        </p>

        {/* Source Type Selector */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-foreground mb-3 block">What type of content do you have?</Label>
          <div className="grid grid-cols-2 gap-2">
            {sourceTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setCurrentSource({ ...currentSource, type: type.id })}
                  className={`p-3 rounded-lg border-2 text-left transition-all flex items-center gap-2 ${
                    currentSource.type === type.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Field */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-foreground mb-2 block">
            {currentSourceConfig?.label}
          </Label>
          {currentSource.type === 'notes' || currentSource.type === 'transcript' ? (
            <Textarea
              placeholder={currentSourceConfig?.placeholder}
              value={currentSource.value}
              onChange={(e) => setCurrentSource({ ...currentSource, value: e.target.value })}
              className="resize-none h-32"
            />
          ) : (
            <Input
              placeholder={currentSourceConfig?.placeholder}
              value={currentSource.value}
              onChange={(e) => setCurrentSource({ ...currentSource, value: e.target.value })}
            />
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {currentSource.type === 'website' && 'Paste your website or landing page URL'}
            {currentSource.type === 'video' && 'YouTube links will be analyzed for video content'}
            {currentSource.type === 'transcript' && 'Paste the full transcript or script'}
            {currentSource.type === 'document' && 'Upload PDFs, documents, or images'}
            {currentSource.type === 'notes' && 'Add campaign notes, talking points, or key messages'}
          </p>
        </div>

        <Button
          onClick={addSource}
          variant="outline"
          className="w-full gap-2 mb-8"
          disabled={!currentSource.value.trim()}
        >
          <Plus className="w-4 h-4" />
          Add Source
        </Button>

        {/* Added Sources */}
        {sources.length > 0 && (
          <div className="mb-8">
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Added Sources ({sources.length})
            </Label>
            <div className="space-y-2">
              {sources.map((source) => {
                const config = sourceTypes.find(t => t.id === source.type);
                const Icon = config?.icon;
                return (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">{config?.label}</p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2 break-words">
                          {source.value.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSource(source.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full" disabled={sources.length === 0}>
          Continue to AI Analysis
        </Button>
      </div>

      <div className="bg-secondary/30 border border-border rounded-xl p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">💡 Tip</p>
        <p>
          Add as much information as you can. AI will analyze all sources to create better content ideas and campaign recommendations.
        </p>
      </div>
    </motion.div>
  );
}