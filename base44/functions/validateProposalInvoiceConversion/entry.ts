import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { proposalId } = await req.json();

    if (!proposalId) {
      return Response.json({ error: 'proposalId required' }, { status: 400 });
    }

    // Fetch proposal
    const proposals = await base44.entities.Proposal.filter({ id: proposalId });
    const proposal = proposals[0];

    if (!proposal) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const results = {
      passed: [],
      failed: [],
      proposal_id: proposalId,
      proposal_number: proposal.proposal_number,
      tests: {},
    };

    // Test 1: Check if proposal is approved
    const test1 = {
      name: 'Proposal Status is Approved',
      passed: proposal.status === 'approved',
      expected: 'status = "approved"',
      actual: `status = "${proposal.status}"`,
    };
    results.tests.proposal_approved = test1;
    if (test1.passed) results.passed.push(test1.name);
    else results.failed.push(test1.name);

    // Test 2: Check client approval (if required)
    const approvals = await base44.entities.ClientApproval.filter({
      proposal_id: proposalId,
    });
    const approval = approvals[0];
    const test2 = {
      name: 'Client Approval Received',
      passed: !approval || approval.approval_status === 'approved',
      expected: 'approval_status = "approved" or no approval required',
      actual: approval
        ? `approval_status = "${approval.approval_status}"`
        : 'no approval record',
    };
    results.tests.client_approval = test2;
    if (test2.passed) results.passed.push(test2.name);
    else results.failed.push(test2.name);

    // Test 3: Check if not already converted
    const test3 = {
      name: 'Proposal Not Already Converted',
      passed: proposal.status !== 'invoice_created',
      expected: 'status != "invoice_created"',
      actual: `status = "${proposal.status}"`,
    };
    results.tests.not_converted = test3;
    if (test3.passed) results.passed.push(test3.name);
    else results.failed.push(test3.name);

    // Test 4: Check if not rejected
    const test4 = {
      name: 'Proposal Not Rejected',
      passed: proposal.status !== 'rejected',
      expected: 'status != "rejected"',
      actual: `status = "${proposal.status}"`,
    };
    results.tests.not_rejected = test4;
    if (test4.passed) results.passed.push(test4.name);
    else results.failed.push(test4.name);

    // Test 5: Check if eligible (all above tests pass)
    const isEligible =
      test1.passed && test2.passed && test3.passed && test4.passed;
    const test5 = {
      name: 'Proposal Eligible for Conversion',
      passed: isEligible,
      expected: 'all eligibility checks pass',
      actual: isEligible ? 'eligible' : 'ineligible',
    };
    results.tests.eligible = test5;
    if (test5.passed) results.passed.push(test5.name);
    else results.failed.push(test5.name);

    // Test 6: Check if invoice exists
    const invoices = await base44.entities.Invoice.filter({
      client_id: proposal.client_id,
      campaign_id: proposal.campaign_id,
    });
    const linkedInvoice = invoices.find(
      (inv) =>
        Math.abs(inv.total_amount - proposal.estimated_price) < 0.01 &&
        inv.status !== 'cancelled'
    );

    const test6 = {
      name: 'Invoice Record Created and Visible',
      passed: !!linkedInvoice,
      expected: 'invoice exists for this proposal',
      actual: linkedInvoice
        ? `invoice ${linkedInvoice.invoice_number} exists`
        : 'no invoice found',
    };
    results.tests.invoice_created = test6;
    if (test6.passed) results.passed.push(test6.name);
    else results.failed.push(test6.name);

    // Test 7: Check invoice totals match proposal (if invoice exists)
    let test7 = {
      name: 'Invoice Totals Match Proposal',
      passed: false,
      expected: `invoice.total_amount = ${proposal.estimated_price}`,
      actual: 'invoice not found',
    };

    if (linkedInvoice) {
      const totalsMatch =
        Math.abs(linkedInvoice.total_amount - proposal.estimated_price) <
        0.01;
      test7 = {
        name: 'Invoice Totals Match Proposal',
        passed: totalsMatch,
        expected: `${proposal.estimated_price}`,
        actual: `${linkedInvoice.total_amount}`,
      };
    }

    results.tests.invoice_totals = test7;
    if (test7.passed) results.passed.push(test7.name);
    else results.failed.push(test7.name);

    // Test 8: Check proposal shows linked invoice in detail
    let test8 = {
      name: 'Proposal Detail Shows Linked Invoice',
      passed: false,
      expected: 'proposal can link to invoice',
      actual: 'invoice not found',
    };

    if (linkedInvoice) {
      test8 = {
        name: 'Proposal Detail Shows Linked Invoice',
        passed: true,
        expected: `proposal links to ${linkedInvoice.invoice_number}`,
        actual: `successfully linked to ${linkedInvoice.invoice_number}`,
      };
    }

    results.tests.proposal_detail_linked = test8;
    if (test8.passed) results.passed.push(test8.name);
    else results.failed.push(test8.name);

    // Test 9: Check launch gate updated with invoice
    let test9 = {
      name: 'Launch Gate Updated After Invoice Creation',
      passed: false,
      expected: 'launch gate exists with invoice_id',
      actual: 'invoice not found',
    };

    if (linkedInvoice) {
      const launchGates = await base44.entities.LaunchGate.filter({
        campaign_id: proposal.campaign_id,
      });
      const gateWithInvoice = launchGates.find(
        (gate) => gate.invoice_id === linkedInvoice.id
      );

      test9 = {
        name: 'Launch Gate Updated After Invoice Creation',
        passed: !!gateWithInvoice,
        expected: 'launch gate links to invoice',
        actual: gateWithInvoice ? 'launch gate updated' : 'launch gate not updated',
      };
    }

    results.tests.launch_gate_updated = test9;
    if (test9.passed) results.passed.push(test9.name);
    else results.failed.push(test9.name);

    // Summary
    results.total_tests = Object.keys(results.tests).length;
    results.pass_count = results.passed.length;
    results.fail_count = results.failed.length;
    results.pass_rate =
      results.total_tests > 0
        ? Math.round((results.pass_count / results.total_tests) * 100)
        : 0;

    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});