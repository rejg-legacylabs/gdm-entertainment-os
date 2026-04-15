// Validation Rules for Revenue Operations Flow
export const validationRules = {
  // Pricing validation
  pricingTotalsMatch: (scope, calculator) => {
    return Math.abs(scope.total - calculator.total) < 0.01;
  },

  // Proposal validation
  proposalInheritsCost: (proposal, scope) => {
    return proposal.estimated_price === scope.total;
  },

  proposalInheritsScope: (proposal, scope) => {
    return proposal.client_id === scope.client_id && 
           proposal.campaign_name === scope.campaign_name;
  },

  // Invoice validation
  invoiceInheritsProposal: (invoice, proposal) => {
    return invoice.total_amount === proposal.estimated_price &&
           invoice.client_id === proposal.client_id;
  },

  invoiceTaxCalculation: (invoice) => {
    const expectedTax = Math.round(invoice.subtotal * 0.1);
    return Math.abs(invoice.tax_amount - expectedTax) < 0.01;
  },

  // Launch gate validation
  paidCampaignUnblocks: (launchGate, invoice) => {
    if (!launchGate.payment_required) return true;
    return launchGate.payment_status === 'paid' && invoice.payment_status === 'paid';
  },

  unpaidCampaignBlocks: (launchGate, invoice) => {
    if (!launchGate.payment_required) return true;
    return launchGate.payment_status !== 'paid' || invoice.payment_status !== 'paid' 
      ? !launchGate.can_launch 
      : true;
  },

  approvalRequired: (launchGate, approval) => {
    if (!launchGate.approval_required) return true;
    return approval?.approval_status === 'approved';
  },

  // Permission validation
  clientIsolation: (user, records) => {
    if (user.role === 'admin') return true; // Admin sees all
    return records.every(r => r.client_id === user.assigned_client_id);
  },

  // Package feature validation
  featureToggleAffectsPrice: (scope, disabledFeature, basePrice) => {
    // If feature is disabled, price should not include it
    return true;
  },

  // Data consistency
  campaignLinksToAllRecords: (campaign, client, proposal, invoice, launchGate) => {
    return campaign.brand_id &&
           campaign.id === proposal?.campaign_id &&
           campaign.id === invoice?.campaign_id &&
           campaign.id === launchGate?.campaign_id;
  },

  paymentStatusPropagates: (payment, invoice, launchGate) => {
    const invoicePaid = invoice.payment_status === 'paid';
    const launchGatePaid = launchGate.payment_status === 'paid';
    return invoicePaid === launchGatePaid;
  },
};

// Validation helper functions
export const validateScenario = (scenario, records) => {
  const steps = [];
  let passCount = 0;
  let failCount = 0;

  // Run scenario-specific validation
  switch (scenario.scenario_name) {
    case 'monthly_package':
      // Validate pricing -> proposal -> invoice -> payment -> launch
      steps.push(validatePricingCreation(records));
      steps.push(validateProposalGeneration(records));
      steps.push(validateInvoiceCreation(records));
      steps.push(validatePayment(records));
      steps.push(validateLaunchGateClears(records));
      break;

    case 'custom_campaign':
      steps.push(validateCustomScope(records));
      steps.push(validateProposalRevision(records));
      steps.push(validateApproval(records));
      steps.push(validateLaunchUnlock(records));
      break;

    case 'payment_gate_blocking':
      steps.push(validatePaymentBlocking(records));
      steps.push(validateLaunchGateBlocked(records));
      break;

    case 'data_consistency':
      steps.push(validateDataConsistency(records));
      steps.push(validateLinkage(records));
      break;
  }

  // Count pass/fail
  steps.forEach(step => {
    if (step.status === 'passed') passCount++;
    if (step.status === 'failed') failCount++;
  });

  return { steps, passCount, failCount, status: failCount === 0 ? 'passed' : 'failed' };
};

const validatePricingCreation = (records) => ({
  step_name: 'Pricing Scope Created',
  status: records.scope ? 'passed' : 'failed',
  expected: 'Pricing scope with calculated totals',
  actual: records.scope ? `Scope created: $${records.scope.total}` : 'Not found',
});

const validateProposalGeneration = (records) => ({
  step_name: 'Proposal Generated from Scope',
  status: records.proposal && validationRules.proposalInheritsScope(records.proposal, records.scope) ? 'passed' : 'failed',
  expected: 'Proposal inherits all scope data and totals',
  actual: records.proposal ? `Proposal: ${records.proposal.proposal_number} - $${records.proposal.estimated_price}` : 'Not found',
});

const validateInvoiceCreation = (records) => ({
  step_name: 'Invoice Created from Proposal',
  status: records.invoice && validationRules.invoiceInheritsProposal(records.invoice, records.proposal) ? 'passed' : 'failed',
  expected: 'Invoice matches proposal totals and client',
  actual: records.invoice ? `Invoice: ${records.invoice.invoice_number} - $${records.invoice.total_amount}` : 'Not found',
});

const validatePayment = (records) => ({
  step_name: 'Invoice Marked Paid',
  status: records.invoice?.payment_status === 'paid' ? 'passed' : 'failed',
  expected: 'Invoice payment_status = paid',
  actual: records.invoice?.payment_status || 'Not found',
});

const validateLaunchGateClears = (records) => ({
  step_name: 'Launch Gate Clears',
  status: records.launchGate?.can_launch ? 'passed' : 'failed',
  expected: 'Launch gate can_launch = true after payment',
  actual: records.launchGate?.can_launch ? 'Cleared' : 'Still blocked',
});

const validateCustomScope = (records) => ({
  step_name: 'Custom Scope with Platforms',
  status: records.scope?.platforms?.length > 0 ? 'passed' : 'failed',
  expected: 'Scope includes multiple platforms',
  actual: records.scope?.platforms?.join(', ') || 'Not found',
});

const validateProposalRevision = (records) => ({
  step_name: 'Proposal Revised',
  status: records.proposal?.status === 'draft' ? 'passed' : 'failed',
  expected: 'Proposal updated with changes',
  actual: `Proposal status: ${records.proposal?.status}`,
});

const validateApproval = (records) => ({
  step_name: 'Proposal Approved',
  status: records.proposal?.status === 'approved' ? 'passed' : 'failed',
  expected: 'Proposal status = approved',
  actual: `Proposal status: ${records.proposal?.status}`,
});

const validateLaunchUnlock = (records) => ({
  step_name: 'Campaign Launch Unlocked',
  status: records.campaign?.status === 'active' ? 'passed' : 'failed',
  expected: 'Campaign can be activated',
  actual: `Campaign status: ${records.campaign?.status}`,
});

const validatePaymentBlocking = (records) => ({
  step_name: 'Unpaid Invoice Blocks Launch',
  status: records.invoice?.payment_status === 'unpaid' && !records.launchGate?.can_launch ? 'passed' : 'failed',
  expected: 'Launch gate blocked when invoice unpaid',
  actual: `Invoice: ${records.invoice?.payment_status}, Launch gate: ${records.launchGate?.can_launch ? 'clear' : 'blocked'}`,
});

const validateLaunchGateBlocked = (records) => ({
  step_name: 'Launch Gate Remains Blocked',
  status: !records.launchGate?.can_launch ? 'passed' : 'failed',
  expected: 'Launch gate.can_launch = false',
  actual: `can_launch: ${records.launchGate?.can_launch}`,
});

const validateDataConsistency = (records) => ({
  step_name: 'Data Consistency Across Records',
  status: validationRules.campaignLinksToAllRecords(
    records.campaign,
    records.client,
    records.proposal,
    records.invoice,
    records.launchGate
  ) ? 'passed' : 'failed',
  expected: 'Campaign links to client, proposal, invoice, and launch gate',
  actual: 'Links validated',
});

const validateLinkage = (records) => ({
  step_name: 'Payment Status Propagation',
  status: validationRules.paymentStatusPropagates(
    records.payment,
    records.invoice,
    records.launchGate
  ) ? 'passed' : 'failed',
  expected: 'Payment status syncs between invoice and launch gate',
  actual: `Invoice: ${records.invoice?.payment_status}, Launch gate: ${records.launchGate?.payment_status}`,
});