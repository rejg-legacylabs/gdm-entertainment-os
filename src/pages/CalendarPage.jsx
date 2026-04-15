import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import BrandBadge from '@/components/ui-premium/BrandBadge';
import StatusBadge from '@/components/ui-premium/StatusBadge';
import AIInsightPanel from '@/components/ui-premium/AIInsightPanel';

const platformColors = {
  instagram: 'bg-pink-500/20 text-pink-400',
  facebook: 'bg-blue-500/20 text-blue-400',
  linkedin: 'bg-sky-500/20 text-sky-400',
  tiktok: 'bg-purple-500/20 text-purple-400',
  youtube: 'bg-red-500/20 text-red-400',
  twitter: 'bg-gray-500/20 text-gray-400',
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list(),
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad to start on Sunday
  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(days);

  const getPostsForDay = (day) => {
    if (!day) return [];
    return posts.filter(p => {
      const date = p.scheduled_date || p.published_date;
      return date && isSameDay(new Date(date), day);
    });
  };

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">Publishing Calendar</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground font-display">Content Calendar</h1>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="glass-panel rounded-xl p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-foreground">{format(currentMonth, 'MMMM yyyy')}</h2>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {paddedDays.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} />;
                const dayPosts = getPostsForDay(day);
                const isSelected = selectedDay && isSameDay(day, selectedDay);

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[80px] p-2 rounded-lg text-left transition-all ${
                      isSelected ? 'bg-primary/10 border border-primary/30' :
                      isToday(day) ? 'bg-secondary/70 border border-primary/20' :
                      'hover:bg-secondary/50 border border-transparent'
                    }`}
                  >
                    <span className={`text-xs font-medium ${
                      isToday(day) ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayPosts.slice(0, 3).map((post, j) => (
                        <div key={j} className={`text-[9px] px-1.5 py-0.5 rounded truncate ${platformColors[post.platform] || 'bg-secondary text-secondary-foreground'}`}>
                          {post.platform}
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <span className="text-[9px] text-muted-foreground">+{dayPosts.length - 3} more</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Detail */}
          {selectedDay && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-5 mt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">{format(selectedDay, 'EEEE, MMMM d, yyyy')}</h3>
              {selectedDayPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No posts scheduled for this day</p>
              ) : (
                <div className="space-y-2">
                  {selectedDayPosts.map(post => (
                    <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${platformColors[post.platform] || ''} capitalize`}>{post.platform}</span>
                      <BrandBadge name={post.brand_name} />
                      <p className="text-sm text-foreground truncate flex-1">{post.caption}</p>
                      <StatusBadge status={post.status} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <AIInsightPanel
            title="Calendar AI Director"
            insights={[
              { title: 'Gap detected: Wednesday has no posts', description: 'Fill mid-week slots to maintain consistent presence across all brands.', category: 'warning', priority: 'high' },
              { title: 'Optimal posting window: Tue & Thu 6-8 PM', description: 'Schedule high-priority content in these windows for maximum engagement.', category: 'strategy', priority: 'high' },
              { title: 'Consider weekend storytelling posts', description: 'Audiences are more receptive to longer-form content on weekends.', category: 'content', priority: 'medium' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}