import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MessageSquare, CheckCircle2, Flag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const typeConfig = {
  praise: { color: 'bg-emerald-500/20 text-emerald-400', label: '👍 Praise' },
  question: { color: 'bg-blue-500/20 text-blue-400', label: '❓ Question' },
  complaint: { color: 'bg-red-500/20 text-red-400', label: '⚠️ Complaint' },
  lead: { color: 'bg-amber-500/20 text-amber-400', label: '🔥 Lead' },
  spam: { color: 'bg-slate-500/20 text-slate-400', label: '🚫 Spam' },
  abuse: { color: 'bg-red-600/20 text-red-500', label: '🔴 Abuse' },
  neutral: { color: 'bg-slate-500/20 text-slate-400', label: 'Neutral' },
  unclassified: { color: 'bg-slate-500/20 text-slate-400', label: 'Unclassified' },
};

export default function CommentCard({ comment, onReply, onEscalate, onModerate, onAssign }) {
  const typeConfig_val = typeConfig[comment.comment_type] || typeConfig.unclassified;
  const sentimentColor = {
    positive: 'text-emerald-400',
    neutral: 'text-slate-400',
    negative: 'text-red-400',
  }[comment.sentiment] || 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-lg p-4 border border-border/50"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.commenter_avatar_url} />
          <AvatarFallback>{comment.commenter_name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-foreground text-sm">{comment.commenter_name}</p>
            <span className="text-xs text-muted-foreground">@{comment.commenter_handle}</span>
            <Badge className={`text-xs ${typeConfig_val.color}`}>{typeConfig_val.label}</Badge>
            {comment.is_spam && (
              <Badge className="text-xs bg-red-500/20 text-red-400">Flagged</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{comment.comment_text}</p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {new Date(comment.comment_timestamp).toLocaleString()}
          </p>
        </div>

        {comment.is_sensitive && (
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        )}
      </div>

      <div className="flex gap-2 flex-wrap pt-3 border-t border-border/30">
        <Button
          size="sm"
          className="flex-1 min-w-[120px] bg-primary/20 hover:bg-primary/30"
          onClick={() => onReply(comment.id)}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Draft Reply
        </Button>
        {!comment.is_spam && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAssign(comment.id)}
          >
            <ArrowRight className="w-3 h-3" />
            Assign
          </Button>
        )}
        {comment.comment_type === 'complaint' && (
          <Button
            size="sm"
            variant="outline"
            className="text-red-400 hover:bg-red-500/10"
            onClick={() => onEscalate(comment.id)}
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Escalate
          </Button>
        )}
        {!comment.is_spam && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onModerate(comment.id)}
          >
            <Flag className="w-3 h-3" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}