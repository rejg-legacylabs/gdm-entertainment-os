import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROMPT_CHIPS = [
  'Draft a campaign',
  'Social media ideas',
  'Donor outreach',
];

export default function AppAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your GDM Entertainment OS assistant. I can help you with content creation, campaign planning, donor outreach messaging, and social media strategy. How can I help today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setLoading(true);

    try {
      const response = await base44.functions.invoke('aiAssistant', {
        messages: [...messages, { role: 'user', content: messageText }],
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-500 hover:bg-violet-600 text-white shadow-lg flex items-center justify-center z-40 transition-all"
        style={{ backgroundColor: '#A78BFA' }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50 flex flex-col"
          >
            <Card className="h-full bg-card border-violet-500/30 flex flex-col glass-panel">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-violet-500/20">
                <div>
                  <h3 className="text-sm font-bold text-foreground">GDM Assistant</h3>
                  <p className="text-xs text-muted-foreground">Campaign & content helper</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-violet-500/40 text-foreground'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-foreground px-3 py-2 rounded-lg text-sm">
                      <span className="inline-flex gap-1">
                        <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Chips */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 border-t border-violet-500/20 space-y-2">
                  <p className="text-xs text-muted-foreground">Suggested:</p>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_CHIPS.map(chip => (
                      <Button
                        key={chip}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(chip)}
                        className="text-xs h-8"
                      >
                        {chip}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-violet-500/20 flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="text-sm bg-secondary/50"
                  disabled={loading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="h-10 w-10 bg-violet-500 hover:bg-violet-600"
                  style={{ backgroundColor: '#A78BFA' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}