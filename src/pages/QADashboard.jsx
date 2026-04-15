import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, Play, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionHeader from '@/components/ui-premium/SectionHeader';
import { cn } from '@/lib/utils';

const scenarioDefinitions = [
  {
    id: 'A',
    name: 'onboarding_completion',
    label: 'Scenario A: Client Onboarding Completion',
    description: 'Create client → complete onboarding checklist → assign package → connect accounts → confirm ready',
    steps: [
      'Create Client',
      'Start Onboarding Session',
      'Complete Brand Info',
      'Connect Social Accounts',
      'Upload Assets',
      'Assign Package',
      'Mark All Checklist Items Complete',
      'Confirm Client Ready for Campaigns',
    ],
  },
  {
    id: 'B',
    name: 'pricing_proposal_invoice',
    label: 'Scenario B: Pricing to Proposal to Invoice Flow',
    description: 'Build pricing scope → generate proposal → approve → convert to invoice → confirm linking',
    steps: [
      'Create Pricing Scope',
      'Calculate Pricing',
      'Generate Proposal',
      'Send to Client',
      'Client Approves Proposal',
      'Verify Approval Data',
      'Convert to Invoice',
      'Confirm Invoice Links to Proposal',
    ],
  },
  {
    id: 'C',
    name: 'payment_gate_blocking',
    label: 'Scenario C: Payment-Gated Launch Blocking',
    description: 'Create unpaid invoice → confirm campaign blocked → mark paid → confirm launch unblocks',
    steps: [
      'Create Campaign',
      'Create Unpaid Invoice',
      'Attempt Campaign Launch',
      'Confirm Launch Blocked',
      'Verify Blocker Reason Visible',
      'Mark Invoice Paid',
      'Retry Campaign Launch',
      'Confirm Launch Now Works',
    ],
  },
  {
    id: 'D',
    name: 'social_account_health',
    label: 'Scenario D: Social Account Connection Health',
    description: 'Connect account → verify healthy → simulate token expiry → confirm reconnect warning',
    steps: [
      'Connect Social Account',
      'Check Account Health Score',
      'Verify All Sync Status Green',
      'Simulate Token Expiry',
      'Confirm Expiration Alert',
      'Show Reconnect Warning',
      'Refresh Token',
      'Verify Health Restored',
    ],
  },
  {
    id: 'E',
    name: 'ai_creative_generation',
    label: 'Scenario E: AI Creative Generation',
    description: 'Generate image ad from video/transcript → create caption → create post → send for approval',
    steps: [
      'Select Campaign',
      'Choose Creative Source (Video/Transcript/URL)',
      'Generate Image Ad',
      'Generate Caption',
      'Generate Hashtags',
      'Create Draft Post',
      'Send for Approval',
      'Verify Approval Workflow',
    ],
  },
  {
    id: 'F',
    name: 'publishing_workflow',
    label: 'Scenario F: Publishing Workflow',
    description: 'Approved post → publish to account → confirm status → test failure handling',
    steps: [
      'Create Approved Post',
      'Verify Ready to Publish',
      'Execute Publish Action',
      'Confirm Publishing Status Updated',
      'Create Publishing Log Entry',
      'Simulate Publish Failure',
      'Verify Failure Log Created',
      'Confirm Retry Queue Available',
    ],
  },
  {
    id: 'G',
    name: 'comment_ops_safety',
    label: 'Scenario G: Comment Ops Safety',
    description: 'Ingest comments → classify sentiment → generate replies → verify safety checks',
    steps: [
      'Ingest Test Comments',
      'Classify Comment Type',
      'Analyze Sentiment',
      'Flag Sensitive Comments',
      'Generate Reply Suggestions',
      'Verify Risky Comments Need Approval',
      'Approve Safe Reply',
      'Send Reply to Platform',
    ],
  },
  {
    id: 'H',
    name: 'client_permissions_isolation',
    label: 'Scenario H: Client Permissions Isolation',
    description: 'Create users → verify data isolation → confirm role-based access control',
    steps: [
      'Create Multiple Test Clients',
      'Create Manager User',
      'Create Super Admin User',
      'Client Only Sees Own Content',
      'Manager Only Sees Assigned Clients',
      'Super Admin Sees All Data',
      'Test Cross-Client Data Blocked',
      'Verify Admin Override Works',
    ],
  },
  {
    id: 'I',
    name: 'content_performance_learning',
    label: 'Scenario I: Content Performance Learning',
    description: 'Create posts with metrics → analyze patterns → generate recommendations',
    steps: [
      'Create Campaign',
      'Create Multiple Posts',
      'Log Performance Metrics',
      'Analyze Post Performance',
      'Identify Top Performers',
      'Generate AI Recommendations',
      'Show "What Worked" Insights',
      'Verify Recommendation Panel Updates',
    ],
  },
  {
    id: 'J',
    name: 'audit_and_hardening',
    label: 'Scenario J: Audit and Hardening',
    description: 'Verify approval locks → audit history → override logging → duplicate prevention',
    steps: [
      'Create and Approve Post',
      'Verify Approval Lock Active',
      'Attempt to Edit Approved Post',
      'Verify Edit Blocked',
      'Check Audit Log Entry',
      'Request Approval Override',
      'Verify Override Logged',
      'Prevent Duplicate Publish Attempt',
    ],
  },
];

export default function QADashboard() {
  const queryClient = useQueryClient();
  const [expandedScenario, setExpandedScenario] = useState(null);

  const { data: validationTests = [] } = useQuery({
    queryKey: ['validationTests'],
    queryFn: () => base44.entities.ValidationTest.list(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list(),
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['approvals'],
    queryFn: () => base44.entities.ClientApproval.list(),
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => base44.entities.Proposal.list(),
  });

  const { data: launchGates = [] } = useQuery({
    queryKey: ['launchGates'],
    queryFn: () => base44.entities.LaunchGate.list(),
  });

  const runValidation = useMutation({
    mutationFn: async (scenarioId) => {
      return await base44.functions.invoke('runValidationTests', {
        scenarioId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validationTests'] });
    },
  });

  const validateProposalInvoice = useMutation({
    mutationFn: async (proposalId) => {
      const response = await base44.functions.invoke('validateProposalInvoiceConversion', {
        proposalId,
      });
      return response.data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['validationTests'] });
    },
  });

  const getScenarioStatus = (scenarioName) => {
    const test = validationTests.find(t => t.scenario_name === scenarioName);
    return test?.status || 'pending';
  };

  const getRelatedRecords = (test) => {
    const campaign = campaigns.find(c => c.id === test.related_campaign_id);
    const invoice = invoices.find(i => i.id === test.related_invoice_id);
    const client = clients.find(c => c.id === test.related_client_id);
    const proposal = proposals.find(p => p.id === test.related_proposal_id);
    const approval = approvals.find(a => a.id === test.related_approval_id);
    const launchGate = launchGates.find(lg => lg.id === test.related_launch_gate_id);

    return { campaign, invoice, client, proposal, approval, launchGate };
  };

  // Link demo scenarios to real data
  const scenarioDataLinks = {
    monthly_package: () => {
      const client = clients.find(c => c.name === 'TechStart Inc.');
      return client ? {
        client_id: client.id,
        campaign_id: campaigns.find(c => c.brand_id === client.id)?.id,
        proposal_id: proposals.find(p => p.proposal_number === 'PROP-001')?.id,
        invoice_id: invoices.find(i => i.invoice_number === 'INV-001')?.id,
      } : {};
    },
    custom_campaign: () => {
      const client = clients.find(c => c.name === 'Creative Agency Plus');
      return client ? {
        client_id: client.id,
        campaign_id: campaigns.find(c => c.brand_id === client.id)?.id,
        proposal_id: proposals.find(p => p.proposal_number === 'PROP-003')?.id,
      } : {};
    },
    payment_gate_blocking: () => {
      const client = clients.find(c => c.name === 'LocalNews Media');
      return client ? {
        client_id: client.id,
        campaign_id: campaigns.find(c => c.brand_id === client.id)?.id,
        proposal_id: proposals.find(p => p.proposal_number === 'PROP-002')?.id,
        invoice_id: invoices.find(i => i.invoice_number === 'INV-002')?.id,
      } : {};
    },
    invoice_conversion: () => {
      const client = clients.find(c => c.name === 'TechStart Inc.');
      const proposal = proposals.find(p => p.proposal_number === 'PROP-001' && p.status === 'approved');
      return client && proposal ? {
        client_id: client.id,
        campaign_id: campaigns.find(c => c.brand_id === client.id)?.id,
        proposal_id: proposal.id,
        invoice_id: invoices.find(i => i.proposal_id === proposal.id)?.id,
      } : {};
    },
  };

  // Calculate metrics from actual test records - separated by state
  const totalTests = 10; // Total scenarios defined (A-J)
  const notRunTests = validationTests.filter(t => t.status === 'pending').length;
  const runningTests = validationTests.filter(t => t.status === 'running').length;
  const completedTests = validationTests.filter(t => t.status === 'passed' || t.status === 'failed');
  const passedTests = validationTests.filter(t => t.status === 'passed').length;
  const failedTests = validationTests.filter(t => t.status === 'failed').length;
  const passRate = completedTests.length > 0
    ? Math.round((passedTests / completedTests.length) * 100)
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <SectionHeader
        title="End-to-End Validation Dashboard"
        subtitle="Full-platform QA across all 10 core workflows (Onboarding, Pricing, Publishing, Creative, Learning, Hardening, Ops)"
        icon={CheckCircle2}
      />

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total Tests', value: totalTests, color: 'blue', subtitle: 'Defined' },
          { label: 'Not Run', value: notRunTests, color: 'slate', subtitle: 'Pending' },
          { label: 'Running', value: runningTests, color: 'amber', subtitle: 'In Progress' },
          { label: 'Completed', value: completedTests.length, color: 'purple', subtitle: `${passedTests}✓ ${failedTests}✗` },
          { label: 'Passed', value: passedTests, color: 'emerald', subtitle: completedTests.length > 0 ? `${passRate}% rate` : 'N/A' },
          { label: 'Pass Rate', value: `${passRate}%`, color: passRate >= 80 ? 'emerald' : passRate > 0 ? 'amber' : 'slate', subtitle: completedTests.length > 0 ? `${completedTests.length}/${totalTests}` : '0 completed' },
        ].map((stat, idx) => {
          const colors = {
            blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            red: 'bg-red-500/10 text-red-400 border-red-500/30',
            amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
            slate: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          };

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-panel rounded-xl p-4 border ${colors[stat.color]}`}
            >
              <p className="text-xs font-medium opacity-75 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
              {stat.subtitle && <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p>}
            </motion.div>
          );
        })}
      </div>

      {/* Test Scenarios */}
      <div className="space-y-4">
        {scenarioDefinitions.map((scenario, idx) => {
          const test = validationTests.find(t => t.scenario_id === scenario.id);
          const testStatus = test?.status || 'not_run';
          const isExpanded = expandedScenario === scenario.name;
          const { campaign, invoice, client, proposal, approval, launchGate } = test ? getRelatedRecords(test) : {};

          const statusConfig = {
            not_run: { icon: Clock, color: 'slate', label: 'Not Run' },
            running: { icon: Clock, color: 'blue', label: 'Running', spin: true },
            passed: { icon: CheckCircle2, color: 'emerald', label: 'Passed' },
            failed: { icon: AlertCircle, color: 'red', label: 'Failed' },
            incomplete: { icon: AlertCircle, color: 'amber', label: 'Incomplete' },
          };

          const config = statusConfig[testStatus];
          const Icon = config.icon;

          return (
            <motion.div
              key={scenario.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel rounded-xl overflow-hidden border-border/50"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedScenario(isExpanded ? null : scenario.name)}
                className="w-full p-6 hover:bg-secondary/30 transition-colors text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">{scenario.label}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                        testStatus === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                        testStatus === 'failed' ? 'bg-red-500/20 text-red-400' :
                        testStatus === 'running' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {testStatus === 'running' && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />}
                        {config.label}
                        {test && (
                          <span className="text-xs opacity-75 ml-1">
                            ({test.pass_count}✓ {test.fail_count}✗)
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Icon className={`w-6 h-6 ${
                      testStatus === 'passed' ? 'text-emerald-400' :
                      testStatus === 'failed' ? 'text-red-400' :
                      testStatus === 'running' ? 'text-blue-400 animate-spin' :
                      'text-slate-400'
                    }`} />
                    <ChevronDown className={cn(
                      'w-5 h-5 text-muted-foreground transition-transform',
                      isExpanded && 'rotate-180'
                    )} />
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border/30"
                  >
                    <div className="p-6 space-y-6">
                      {/* Steps */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground mb-3">Test Steps ({test?.pass_count || 0}✓ {test?.fail_count || 0}✗)</p>
                        {scenario.steps.map((step, stepIdx) => {
                          const stepStatus = test?.steps?.[stepIdx]?.status || 'pending';
                          const stepIcon = stepStatus === 'passed' ? CheckCircle2 : stepStatus === 'failed' ? AlertCircle : Clock;
                          const StepIcon = stepIcon;
                          const stepColor = stepStatus === 'passed' ? 'text-emerald-400' : stepStatus === 'failed' ? 'text-red-400' : 'text-slate-400';

                          return (
                            <motion.div
                              key={stepIdx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stepIdx * 0.05 }}
                              className="flex items-center gap-3 p-2 rounded"
                            >
                              <StepIcon className={`w-4 h-4 flex-shrink-0 ${stepColor}`} />
                              <span className="text-sm text-foreground">{step}</span>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Related Records */}
                      {test && (
                        <div className="space-y-3 pt-4 border-t border-border/30">
                          <p className="text-sm font-semibold text-foreground">Linked Records</p>
                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            {client && (
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-xs text-muted-foreground mb-1">Client</p>
                                <p className="font-medium text-foreground">{client.name}</p>
                              </div>
                            )}
                            {campaign && (
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-xs text-muted-foreground mb-1">Campaign</p>
                                <p className="font-medium text-foreground">{campaign.name}</p>
                              </div>
                            )}
                            {proposal && (
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-xs text-muted-foreground mb-1">Proposal</p>
                                <p className="font-medium text-foreground">{proposal.proposal_number}</p>
                              </div>
                            )}
                            {invoice && (
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-xs text-muted-foreground mb-1">Invoice</p>
                                <p className="font-medium text-foreground">{invoice.invoice_number}</p>
                                <p className="text-xs text-muted-foreground mt-1">${invoice.total_amount?.toLocaleString()}</p>
                              </div>
                            )}
                            {approval && (
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-xs text-muted-foreground mb-1">Approval</p>
                                <p className="font-medium text-foreground capitalize">{approval.approval_status}</p>
                              </div>
                            )}
                            {launchGate && (
                              <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="text-xs text-muted-foreground mb-1">Launch Gate</p>
                                <p className={`font-medium ${launchGate.can_launch ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {launchGate.can_launch ? 'Ready' : 'Blocked'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Validation Results for Invoice Conversion */}
                      {scenario.name === 'invoice_conversion' && validateProposalInvoice.data && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-3 border-t border-border/30 space-y-3"
                        >
                          <p className="text-sm font-semibold text-foreground">Validation Results</p>
                          <div className={`p-3 rounded-lg ${
                            validateProposalInvoice.data.pass_count === validateProposalInvoice.data.total_tests
                              ? 'bg-emerald-500/10 border border-emerald-500/30'
                              : 'bg-red-500/10 border border-red-500/30'
                          }`}>
                            <p className="text-sm font-medium mb-2">
                              {validateProposalInvoice.data.pass_count}/{validateProposalInvoice.data.total_tests} Tests Passed
                            </p>
                            <div className="space-y-2">
                              {Object.entries(validateProposalInvoice.data.tests).map(([key, test]) => (
                                <div key={key} className="flex items-start gap-2 text-xs">
                                  {test.passed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                  )}
                                  <div>
                                    <p className={`font-medium ${test.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                      {test.name}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5">
                                      Expected: {test.expected}
                                    </p>
                                    <p className="text-muted-foreground">
                                      Actual: {test.actual}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Summary Stats */}
                      {test && (
                        <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-border/30">
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-1">Passed</p>
                            <p className="text-lg font-bold text-emerald-400">{test.validations_passed}/{test.validations_passed + test.validations_failed}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-1">Duration</p>
                            <p className="text-lg font-bold text-foreground">{(test.duration_ms / 1000).toFixed(1)}s</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-1">Run By</p>
                            <p className="text-xs font-medium text-foreground truncate">{test.run_by}</p>
                          </div>
                        </div>
                      )}

                      {/* Last Run Info */}
                      {test?.completed_at && (
                        <div className="text-xs text-muted-foreground pt-3 border-t border-border/30">
                          Last run: {new Date(test.completed_at).toLocaleDateString()} {new Date(test.completed_at).toLocaleTimeString()}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-3 border-t border-border/30">
                        <Button
                          onClick={() => runValidation.mutate(scenario.id)}
                          disabled={testStatus === 'running' || runValidation.isPending}
                          className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {testStatus === 'running' ? 'Running...' : 'Run Test'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Validation Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-6 mt-8"
      >
        <h2 className="font-semibold text-foreground mb-4">Platform Coverage</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Client Onboarding (A)', desc: 'Complete onboarding workflow & checklist' },
            { title: 'Revenue Ops (B-C)', desc: 'Pricing → Proposal → Invoice → Payment gate' },
            { title: 'Connectors (D)', desc: 'Account health, token expiry, sync status' },
            { title: 'AI Creative Studio (E)', desc: 'Asset generation & approval workflow' },
            { title: 'Publishing (F)', desc: 'Publishing workflow & failure handling' },
            { title: 'Comment Ops (G)', desc: 'Comment classification & safety' },
            { title: 'Permissions (H)', desc: 'Client isolation & role-based access' },
            { title: 'Learning & Hardening (I-J)', desc: 'Performance learning & audit logs' },
          ].map((rule, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-secondary/30">
              <p className="font-medium text-foreground text-sm">{rule.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{rule.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}