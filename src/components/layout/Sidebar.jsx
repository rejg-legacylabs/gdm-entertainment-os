import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Megaphone, PenTool, Video, Calendar,
  Inbox, BarChart3, FolderOpen, Brain, Settings, ChevronLeft, ChevronRight,
  Sparkles, Crown, DollarSign, FileText, Lock, Zap, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Command Center' },
  { path: '/brands', icon: Building2, label: 'Brands' },
  { path: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { path: '/content-studio', icon: PenTool, label: 'Content Studio' },
  { path: '/video-studio', icon: Video, label: 'Video Studio' },
  { path: '/ai-creative-studio', icon: Sparkles, label: 'AI Creative Studio' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/inbox', icon: Inbox, label: 'Inbox' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/assets', icon: FolderOpen, label: 'Assets' },
  { path: '/ai-strategy', icon: Brain, label: 'AI Strategy' },
];

const revenueOpsItems = [
  { path: '/pricing-studio', icon: DollarSign, label: 'Pricing Studio' },
  { path: '/proposal-studio', icon: FileText, label: 'Proposal Studio' },
  { path: '/approval-center', icon: CheckCircle2, label: 'Approvals' },
  { path: '/invoice-center', icon: BarChart3, label: 'Invoice Center' },
  { path: '/launch-gate', icon: Lock, label: 'Launch Gate' },
  { path: '/qa-dashboard', icon: Zap, label: 'QA & Validation' },
];

const executionOpsItems = [
  { path: '/publishing-queue', icon: PenTool, label: 'Publishing Queue' },
  { path: '/failed-posts', icon: AlertCircle, label: 'Failed Posts' },
  { path: '/comment-ops', icon: Inbox, label: 'Comment Ops' },
  { path: '/audit-dashboard', icon: Zap, label: 'Audit Dashboard' },
];

const allNavItems = [...navItems, ...revenueOpsItems, ...executionOpsItems, { path: '/settings', icon: Settings, label: 'Settings' }];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 gold-glow">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-sm font-bold text-foreground tracking-tight">GDM Entertainment</span>
                <span className="text-[10px] text-primary font-medium tracking-widest uppercase">OS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {allNavItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          // Add divider before sections
          const isRevenueOpsStart = item.path === '/pricing-studio';
          const isExecutionOpsStart = item.path === '/publishing-queue';
          
          return (
            <div key={item.path}>
              {isRevenueOpsStart && !collapsed && (
                <div className="px-3 py-2 mt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Revenue Ops</p>
                </div>
              )}
              {isExecutionOpsStart && !collapsed && (
                <div className="px-3 py-2 mt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Execution Ops</p>
                </div>
              )}
              <Link to={item.path}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-[3px] h-8 bg-primary rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* AI Assistant Badge */}
      <div className="px-3 pb-3">
        <div className={cn(
          'rounded-lg p-3 glass-panel',
          collapsed ? 'flex justify-center' : ''
        )}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            {!collapsed && (
              <span className="text-xs text-muted-foreground">AI Director Active</span>
            )}
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}