import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DrillDownPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  items = [],
  tabs = [],
  children,
  loading = false,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-[600px] bg-card border-border/50">
        <SheetHeader className="border-b border-border/30 pb-4">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5 text-primary" />}
            <div>
              <SheetTitle className="text-xl">{title}</SheetTitle>
              {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
          {/* Tabs */}
          {tabs.length > 0 && (
            <Tabs defaultValue={tabs[0].id} className="w-full">
              <TabsList className="grid w-full gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(tabs.length, 3)}, 1fr)` }}>
                {tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id} className="space-y-3">
                  {tab.render()}
                </TabsContent>
              ))}
            </Tabs>
          )}

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-2">
              {loading ? (
                <div className="py-8 text-center text-muted-foreground">Loading...</div>
              ) : (
                items.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg bg-secondary/30 border border-border/20 hover:bg-secondary/50 transition-colors cursor-pointer group"
                  >
                    {typeof item === 'string' ? (
                      <p className="text-sm text-foreground">{item}</p>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          {item.title && (
                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          )}
                          {item.metadata && (
                            <div className="flex gap-2 mt-2">
                              {Array.isArray(item.metadata) ? (
                                item.metadata.map((m, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                    {m}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">{item.metadata}</span>
                              )}
                            </div>
                          )}
                        </div>
                        {item.value && (
                          <span className="text-lg font-bold text-primary flex-shrink-0">{item.value}</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Custom Content */}
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}