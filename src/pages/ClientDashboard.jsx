import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, AlertCircle, DollarSign, FileText, Calendar, Eye, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import InteractiveMetricCard from '@/components/command-center/InteractiveMetricCard';
import DrillDownPanel from '@/components/command-center/DrillDownPanel';

export default function ClientDashboard() {
  const [drillDownState, setDrillDownState] = useState({ type: null, isOpen: false });
  const user = React.useRef(null);

  React.useEffect(() => {
    base44.auth.me().then(u => { user.current = u; });
  }, []);

  const { data: currentClient = null } = useQuery({
    queryKey: ['currentClient'],
    queryFn: async () => {
      const u = await base44.auth.me();
      return await base44.entities.Client.filter({ contact_email: u.email }).then(c => c[0]);
    },
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['clientCampaigns', currentClient?.id],
    queryFn: () => currentClient ? base44.entities.Campaign.filter({ brand_id: currentClient.id }) : [],
    enabled: !!currentClient,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['clientPosts', currentClient?.id],
    queryFn: () => currentClient ? base44.entities.Post.filter({ brand_name: currentClient.name }) : [],
    enabled: !!currentClient,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['clientInvoices', currentClient?.id],
    queryFn: () => currentClient ? base44.entities.Invoice.filter({ client_id: currentClient.id }) : [],
    enabled: !!currentClient,
  });

  const { data: launchGates = [] } = useQuery({
    queryKey: ['launchGates', currentClient?.id],
    queryFn: () => currentClient ? base44.entities.LaunchGate.filter({ client_id: currentClient.id }) : [],
    enabled: !!currentClient,
  });

  if (!currentClient) {
    return (
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading client dashboard...</p>
        </div>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const pendingApprovals = posts.filter(p => p.status === 'ready_for_review').length;
  const totalEngagement = posts.reduce((sum, p) => sum + (p.engagement || 0), 0);
  const unpaidInvoices = invoices.filter(i => i.payment_status !== 'paid').length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-display">{currentClient.name}</h1>
        <p className="text-muted-foreground mt-1">Client Account Dashboard</p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InteractiveMetricCard
          title="Active Campaigns"
          value={activeCampaigns}
          icon={Calendar}
          onClick={() => setDrillDownState({ type: 'campaigns', isOpen: true })}
        />
        <InteractiveMetricCard
          title="Pending Approvals"
          value={pendingApprovals}
          icon={Eye}
          onClick={() => setDrillDownState({ type: 'approvals', isOpen: true })}
        />
        <InteractiveMetricCard
          title="Total Engagement"
          value={totalEngagement.toLocaleString()}
          icon={TrendingUp}
          onClick={() => setDrillDownState({ type: 'analytics', isOpen: true })}
        />
        <InteractiveMetricCard
          title="Payment Status"
          value={unpaidInvoices}
          icon={DollarSign}
          onClick={() => setDrillDownState({ type: 'invoices', isOpen: true })}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="space-y-3">
            {campaigns.length > 0 ? (
              campaigns.map((campaign, idx) => {
                const launchGate = launchGates.find(lg => lg.campaign_id === campaign.id);
                const isBlocked = launchGate && !launchGate.can_launch;

                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-panel rounded-xl p-6 border-border/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{campaign.objective}</p>
                        <div className="flex gap-2 mt-3">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary capitalize">
                            {campaign.status}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                            {campaign.type}
                          </span>
                        </div>
                      </div>

                      {/* Launch Gate Indicator */}
                      {isBlocked && (
                        <div className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                          <p className="text-xs font-medium text-amber-400 text-center">
                            {launchGate.blocked_reason || 'Payment Pending'}
                          </p>
                        </div>
                      )}

                      {campaign.status === 'draft' && (
                        <Button variant="outline">Review</Button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="glass-panel rounded-xl p-12 text-center">
                <p className="text-muted-foreground">No campaigns yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="space-y-3">
            {posts.length > 0 ? (
              posts.slice(0, 5).map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel rounded-xl p-4 border-border/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-2">{post.caption}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                          {post.platform}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                          {post.status}
                        </span>
                      </div>
                    </div>
                    {post.status === 'ready_for_review' && (
                      <Button size="sm" variant="default">Approve</Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-panel rounded-xl p-12 text-center">
                <p className="text-muted-foreground">No posts scheduled</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-6 border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Total Impressions</p>
              <p className="text-3xl font-bold text-foreground">
                {posts.reduce((sum, p) => sum + (p.impressions || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Total Reach</p>
              <p className="text-3xl font-bold text-foreground">
                {posts.reduce((sum, p) => sum + (p.reach || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Total Engagement</p>
              <p className="text-3xl font-bold text-foreground">{totalEngagement.toLocaleString()}</p>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <div className="glass-panel rounded-xl p-6 border-border/50 mb-4">
            <h3 className="font-semibold text-foreground mb-3">Current Package</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-lg font-bold text-foreground capitalize">{currentClient.package_tier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Budget</p>
                <p className="text-lg font-bold text-foreground">${currentClient.monthly_budget?.toLocaleString() || '—'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Recent Invoices</h3>
            {invoices.length > 0 ? (
              invoices.slice(0, 5).map((invoice, idx) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel rounded-xl p-4 border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">{invoice.campaign_name || invoice.client_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${invoice.total_amount.toLocaleString()}</p>
                      <p className={`text-xs font-medium capitalize ${
                        invoice.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {invoice.payment_status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-panel rounded-xl p-12 text-center">
                <p className="text-muted-foreground">No invoices</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Drill-Down Panels */}
      <DrillDownPanel
        isOpen={drillDownState.isOpen && drillDownState.type === 'campaigns'}
        onClose={() => setDrillDownState({ type: null, isOpen: false })}
        title="Active Campaigns"
        icon={Calendar}
        items={campaigns.filter(c => c.status === 'active').map(c => ({
          id: c.id,
          title: c.name,
          description: c.objective,
          metadata: [c.type, c.platforms?.length ? `${c.platforms.length} platforms` : ''],
        }))}
      />

      <DrillDownPanel
        isOpen={drillDownState.isOpen && drillDownState.type === 'invoices'}
        onClose={() => setDrillDownState({ type: null, isOpen: false })}
        title="Invoices"
        icon={FileText}
        items={invoices.map(i => ({
          id: i.id,
          title: i.invoice_number,
          description: i.campaign_name,
          value: `$${i.total_amount}`,
          metadata: i.payment_status,
        }))}
      />
    </div>
  );
}