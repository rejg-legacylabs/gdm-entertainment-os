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
    name: 'monthly_package',
    label: 'Scenario A: Monthly Package Workflow',
    description: 'Create client → assign package → calculate pricing → generate proposal → approve → invoice → pay → launch',
    steps: [
      'Client Created',
      'Package Assigned',
      'Pricing Scope Calculated',
      'Proposal Generated',
      'Proposal Approved',
      'Invoice Created',
      'Invoice Paid',
      'Launch Gate Clears',
    ],
  },
  {
    name: 'custom_campaign',
    label: 'Scenario B: One-Time Custom Campaign',
    description: 'Custom scope → pricing → proposal → approval → invoice → payment → launch unlock',
    steps: [
      'Custom Scope Created',
      'Multi-Platform Content Mix Set',
      'Pricing Calculated',
      'Proposal Generated',
      'Change Request Sent',
      'Proposal Revised',
      'Proposal Approved',
      'Invoice Created',
      'Invoice Paid',
      'Campaign Unlocked',
    ],
  },
  {
    name: 'payment_gate_blocking',
    label: 'Scenario C: Payment Gate Blocking',
    description: 'Verify unpaid invoices block campaign launch',
    steps: [
      'Proposal Approved',
      'Invoice Created',
      'Payment Status: Unpaid',
      'Launch Gate: Blocked',
      'Campaign Cannot Activate',
      'Payment Received',
      'Launch Gate: Clears',
    ],
  },
  {
    name: 'invoice_conversion',
    label: 'Scenario D: Proposal to Invoice Conversion',
    description: 'Verify eligible proposals convert to invoices with correct data',
    steps: [
      'Proposal Created and Approved',
      'Client Approval Received',
      'Conversion Eligibility Checked',
      'Invoice Created from Proposal',
      'Invoice Number Generated',
      'Totals Match Proposal',
      'Launch Gate Updated',
      'Proposal Status: Invoice Created',
    ],
  },
  {
    name: 'client_isolation',
    label: 'Scenario E: Client Isolation & Permissions',
    description: 'Verify data isolation and permission boundaries',
    steps: [
      'Multiple Clients Created',
      'Client 1 Dashboard Shows Only Own Data',
      'Client 2 Cannot See Client 1 Records',
      'Manager Only Sees Assigned Clients',
      'Super Admin Sees All Records',
    ],
  },
  {
    name: 'approval_flow',
    label: 'Scenario F: Client Approval Flow',
    description: 'Test proposal approval and status propagation',
    steps: [
      'Campaign Created',
      'Proposal Generated',
      'Sent to Client',
      'Client Reviews',
      'Client Approves',
      'Approval Status Updates',
      'Invoice Eligibility Confirmed',
    ],
  },
  {
    name: 'package_features',
    label: 'Scenario G: Package Feature Toggles',
    description: 'Verify feature toggles affect visibility and pricing',
    steps: [
      'Package Created with Features',
      'Feature Disabled for Client',
      'Client Dashboard Reflects Change',
      'Pricing Excludes Disabled Feature',
      'Super Admin Still Sees Control',
    ],
  },
  {
    name: 'data_consistency',
    label: 'Scenario H: Data Consistency Validation',
    description: 'Verify linked records maintain consistency',
    steps: [
      'Proposal Total Matches Scope',
      'Invoice Total Matches Proposal',
      'Payment Status Syncs to Launch Gate',
      'Campaign Links to All Records',
      'Client Data Isolation Maintained',
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
    mutationFn: async (scenarioName) => {
      const existing = validationTests.find(t => t.scenario_name === scenarioName);
      
      if (existing) {
        // Update existing test to running status
        return await base44.entities.ValidationTest.update(existing.id, {
          status: 'running',
          last_run_date: new Date().toISOString(),
        });
      }
      
      // Create new test record
      return await base44.entities.ValidationTest.create({
        scenario_name: scenarioName,
        scenario_label: scenarioDefinitions.find(s => s.name === scenarioName)?.label,
        status: 'running',
        steps: [],
        last_run_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validationTests'] });
      // Simulate test completion after 2 seconds
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['validationTests'] });
      }, 2000);
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
  const totalTests = 8; // Total scenarios defined (updated for invoice conversion)
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
        title="QA & Validation Dashboard"
        subtitle="End-to-end testing for Revenue Operations workflow"
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
          const test = validationTests.find(t => t.scenario_name === scenario.name);
          const testStatus = test?.status || 'pending';
          const isExpanded = expandedScenario === scenario.name;
          const { campaign, invoice, client, proposal, approval, launchGate } = test ? getRelatedRecords(test) : {};

          const statusConfig = {
            pending: { icon: Clock, color: 'slate', label: 'Not Run' },
            running: { icon: Clock, color: 'blue', label: 'Running', spin: true },
            passed: { icon: CheckCircle2, color: 'emerald', label: 'Passed' },
            failed: { icon: AlertCircle, color: 'red', label: 'Failed' },
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

                      {/* Last Run Info */}
                      {test?.last_run_date && (
                        <div className="text-xs text-muted-foreground pt-3 border-t border-border/30">
                          Last run: {new Date(test.last_run_date).toLocaleDateString()} {new Date(test.last_run_date).toLocaleTimeString()}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-3 border-t border-border/30">
                        <Button
                          onClick={() => runValidation.mutate(scenario.name)}
                          disabled={testStatus === 'running'}
                          className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {testStatus === 'running' ? 'Running...' : 'Run Test'}
                        </Button>
                        {scenario.name === 'invoice_conversion' && (
                          <Button
                            onClick={() => {
                              const proposal = proposals.find(p => p.proposal_number === 'PROP-001' && p.status === 'approved');
                              if (proposal) {
                                validateProposalInvoice.mutate(proposal.id);
                              }
                            }}
                            disabled={validateProposalInvoice.isPending}
                            variant="outline"
                            className="gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Validate Conversion
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Validation Rules Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-6 mt-8"
      >
        <h2 className="font-semibold text-foreground mb-4">Validation Rules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Pricing', desc: 'Totals update correctly when quantities change' },
            { title: 'Proposal', desc: 'Inherits scope and totals from calculator' },
            { title: 'Invoice', desc: 'Inherits approved proposal data' },
            { title: 'Payment Gate', desc: 'Unpaid campaigns stay blocked' },
            { title: 'Permissions', desc: 'Client data isolation enforced' },
            { title: 'Features', desc: 'Package toggles affect visibility' },
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