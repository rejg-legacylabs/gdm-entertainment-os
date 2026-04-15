import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { proposalId } = await req.json();

    // Fetch proposal
    const proposal = await base44.entities.Proposal.filter({ id: proposalId });
    if (!proposal || proposal.length === 0) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const prop = proposal[0];

    // Check eligibility
    const eligibility = await checkProposalEligibility(base44, prop);
    if (!eligibility.eligible) {
      return Response.json({ 
        error: 'Proposal not eligible for conversion',
        reason: eligibility.reason 
      }, { status: 400 });
    }

    // Get related approval
    const approval = await base44.entities.ClientApproval.filter({ 
      proposal_id: proposalId 
    });
    const approvalRecord = approval && approval.length > 0 ? approval[0] : null;

    // Create invoice
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const invoiceData = {
      invoice_number: invoiceNumber,
      client_id: prop.client_id,
      client_name: prop.client_name,
      campaign_id: prop.campaign_id,
      campaign_name: prop.campaign_name,
      invoice_type: 'campaign',
      subtotal: Math.round((prop.price_breakdown?.subtotal || prop.estimated_price * 0.9)),
      tax_amount: Math.round((prop.price_breakdown?.tax || prop.estimated_price * 0.1)),
      total_amount: prop.estimated_price,
      line_items: [
        {
          description: `${prop.campaign_name} - Campaign Creation & Management`,
          quantity: 1,
          unit_price: Math.round((prop.price_breakdown?.subtotal || prop.estimated_price * 0.9)),
          amount: Math.round((prop.price_breakdown?.subtotal || prop.estimated_price * 0.9)),
        },
      ],
      status: 'draft',
      payment_status: 'unpaid',
      due_date: dueDate.toISOString().split('T')[0],
      issued_date: new Date().toISOString().split('T')[0],
      payment_terms: prop.payment_terms || 'Net 30',
      client_notes: `Please remit payment to activate campaign launch for ${prop.campaign_name}.`,
    };

    const invoice = await base44.entities.Invoice.create(invoiceData);

    // Update proposal
    await base44.entities.Proposal.update(proposalId, {
      status: 'invoice_created',
    });

    // Create or update launch gate
    const launchGate = await base44.entities.LaunchGate.filter({
      campaign_id: prop.campaign_id,
    });

    if (launchGate && launchGate.length > 0) {
      await base44.entities.LaunchGate.update(launchGate[0].id, {
        invoice_id: invoice.id,
        payment_required: true,
        payment_status: 'pending',
        total_due: invoice.total_amount,
        amount_paid: 0,
      });
    } else {
      // Create launch gate if it doesn't exist
      await base44.entities.LaunchGate.create({
        campaign_id: prop.campaign_id,
        campaign_name: prop.campaign_name,
        client_id: prop.client_id,
        invoice_id: invoice.id,
        total_due: invoice.total_amount,
        amount_paid: 0,
        payment_required: true,
        payment_status: 'pending',
        approval_required: !!approvalRecord,
        approval_status: approvalRecord?.approval_status || 'pending',
        can_launch: false,
      });
    }

    return Response.json({
      success: true,
      invoice: invoice,
      message: `Invoice ${invoiceNumber} created successfully`,
    });
  } catch (error) {
    console.error('Error converting proposal to invoice:', error);
    return Response.json({ 
      error: 'Failed to convert proposal',
      details: error.message 
    }, { status: 500 });
  }
});

async function checkProposalEligibility(base44, proposal) {
  // Must not already be converted
  if (proposal.status === 'invoice_created') {
    return { eligible: false, reason: 'Proposal already converted to invoice' };
  }

  // Must not be rejected
  if (proposal.status === 'rejected') {
    return { eligible: false, reason: 'Rejected proposals cannot be converted' };
  }

  // Must be approved
  if (proposal.status !== 'approved') {
    return { eligible: false, reason: `Proposal must be approved (currently ${proposal.status})` };
  }

  // Check if approval exists and is approved
  const approval = await base44.entities.ClientApproval.filter({
    proposal_id: proposal.id,
  });

  if (approval && approval.length > 0) {
    const approvalRecord = approval[0];
    if (approvalRecord.approval_status !== 'approved') {
      return { 
        eligible: false, 
        reason: `Awaiting approval (status: ${approvalRecord.approval_status})` 
      };
    }
  }

  return { eligible: true };
}