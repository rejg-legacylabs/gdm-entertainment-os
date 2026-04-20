import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Heart, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_ITEMS = [
  {
    id: 1,
    platform: 'instagram',
    username: 'john_doe',
    message: 'Love what you\'re doing for the community!',
    timestamp: '2 hours ago',
    type: 'comment',
    status: 'unread',
  },
  {
    id: 2,
    platform: 'linkedin',
    username: 'jane_smith',
    message: 'Great campaign! Would love to collaborate.',
    timestamp: '4 hours ago',
    type: 'mention',
    status: 'read',
  },
  {
    id: 3,
    platform: 'twitter',
    username: 'supporter_mike',
    message: '@organization Amazing initiative!',
    timestamp: '6 hours ago',
    type: 'mention',
    status: 'unread',
  },
];

export default function SocialInbox() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all' ? items : items.filter(item => item.status === filter);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Social Inbox</h1>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({items.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({items.filter(i => i.status === 'unread').length})</TabsTrigger>
            <TabsTrigger value="read">Read ({items.filter(i => i.status === 'read').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card className={`p-4 transition-all ${item.status === 'unread' ? 'bg-primary/5 border-primary/30' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
                        {item.username.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">@{item.username}</span>
                          <Badge variant="outline" className="text-xs capitalize">{item.platform}</Badge>
                          {item.status === 'unread' && <div className="w-2 h-2 rounded-full bg-primary ml-auto" />}
                        </div>
                        <p className="text-foreground text-sm mb-2">{item.message}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No messages</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}