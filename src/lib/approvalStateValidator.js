/**
 * Approval State Validation
 * Ensures approval records never show contradictory states
 */

export const ApprovalSource = {
  CLIENT_DRIVEN: 'client_driven',
  INTERNAL_OVERRIDE: 'internal_override',
  ADMIN_APPROVAL: 'admin_approval',
};

/**
 * Normalize approval state to ensure logical consistency
 */
export function normalizeApprovalState(approval) {
  if (!approval) return null;

  const normalized = { ...approval };

  // Determine approval source
  if (!normalized.approval_source) {
    // Infer from available data
    if (normalized.requested_date && normalized.approval_status === 'approved') {
      normalized.approval_source = ApprovalSource.CLIENT_DRIVEN;
    } else if (normalized.approval_status === 'approved' && !normalized.requested_date) {
      normalized.approval_source = ApprovalSource.INTERNAL_OVERRIDE;
    } else {
      normalized.approval_source = ApprovalSource.CLIENT_DRIVEN;
    }
  }

  // Client-driven approval must have request date
  if (normalized.approval_source === ApprovalSource.CLIENT_DRIVEN) {
    if (!normalized.requested_date) {
      // If approval exists but no request date, mark as internal override
      normalized.approval_source = ApprovalSource.INTERNAL_OVERRIDE;
    }
  }

  // Validate state consistency
  const issues = [];

  // If rejected, cannot be approved
  if (normalized.approval_status === 'rejected' && normalized.approved_date) {
    normalized.approved_date = null; // Clear conflicting date
    issues.push('Rejected approval cannot have approval date');
  }

  // If pending, should not have approval date
  if (normalized.approval_status === 'pending' && normalized.approved_date) {
    normalized.approved_date = null;
    issues.push('Pending approval cannot have approval date');
  }

  // If changes requested, should not have approval date
  if (normalized.approval_status === 'changes_requested' && normalized.approved_date) {
    normalized.approved_date = null;
    issues.push('Changes requested approval cannot have approval date');
  }

  // Client-driven approval without request date should be marked internal
  if (
    normalized.approval_source === ApprovalSource.CLIENT_DRIVEN &&
    !normalized.requested_date &&
    normalized.approval_status === 'approved'
  ) {
    normalized.approval_source = ApprovalSource.INTERNAL_OVERRIDE;
  }

  return { normalized, issues };
}

/**
 * Determine if approval is eligible for invoice conversion
 */
export function isApprovalEligibleForInvoice(approval) {
  if (!approval) return true; // No approval required
  return approval.approval_status === 'approved';
}

/**
 * Get human-readable approval status with source context
 */
export function getApprovalStatusLabel(approval) {
  if (!approval) {
    return { label: 'Not Required', icon: 'CheckCircle2', color: 'emerald' };
  }

  const sourceLabel = {
    [ApprovalSource.CLIENT_DRIVEN]: 'Client Approval',
    [ApprovalSource.INTERNAL_OVERRIDE]: 'Internal Approval',
    [ApprovalSource.ADMIN_APPROVAL]: 'Admin Approval',
  }[approval.approval_source] || 'Approval';

  const statusConfig = {
    pending: {
      label: `${sourceLabel}: Pending`,
      icon: 'Clock',
      color: 'amber',
      description: 'Awaiting approval',
    },
    approved: {
      label: `${sourceLabel}: Approved`,
      icon: 'CheckCircle2',
      color: 'emerald',
      description: 'Approved and ready for next step',
    },
    changes_requested: {
      label: `${sourceLabel}: Changes Requested`,
      icon: 'AlertCircle',
      color: 'blue',
      description: 'Client requested revisions',
    },
    rejected: {
      label: `${sourceLabel}: Rejected`,
      icon: 'AlertCircle',
      color: 'red',
      description: 'Proposal was rejected',
    },
  };

  return statusConfig[approval.approval_status] || statusConfig.pending;
}

/**
 * Validate approval can be moved to new status
 */
export function validateApprovalTransition(currentStatus, newStatus, source) {
  // Valid transitions
  const validTransitions = {
    pending: ['approved', 'rejected', 'changes_requested'],
    approved: [], // Cannot transition from approved
    rejected: [], // Cannot transition from rejected
    changes_requested: ['approved', 'pending', 'rejected'],
  };

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    return {
      valid: false,
      reason: `Cannot transition from ${currentStatus} to ${newStatus}`,
    };
  }

  // Additional validation for internal approvals
  if (source === ApprovalSource.INTERNAL_OVERRIDE && newStatus === 'rejected') {
    return {
      valid: false,
      reason: 'Internal approvals cannot be rejected',
    };
  }

  return { valid: true };
}

/**
 * Build approval timeline events from approval record
 */
export function buildApprovalTimeline(approval) {
  if (!approval) return [];

  const events = [];

  if (approval.requested_date) {
    events.push({
      type: 'requested',
      label: 'Sent for Approval',
      date: approval.requested_date,
      icon: 'Send',
      color: 'blue',
      user: approval.requested_by,
    });
  }

  if (approval.viewed_date) {
    events.push({
      type: 'viewed',
      label: 'Viewed by Client',
      date: approval.viewed_date,
      icon: 'Eye',
      color: 'cyan',
    });
  }

  if (approval.approval_status === 'changes_requested' && approval.feedback) {
    events.push({
      type: 'changes_requested',
      label: 'Changes Requested',
      date: approval.updated_date || approval.requested_date,
      icon: 'MessageSquare',
      color: 'blue',
      details: approval.feedback,
    });
  }

  if (approval.approval_status === 'approved' && approval.approved_date) {
    events.push({
      type: 'approved',
      label: 'Approved',
      date: approval.approved_date,
      icon: 'CheckCircle2',
      color: 'emerald',
      user: approval.approved_by,
    });
  }

  if (approval.approval_status === 'rejected' && approval.approved_date) {
    events.push({
      type: 'rejected',
      label: 'Rejected',
      date: approval.approved_date,
      icon: 'AlertCircle',
      color: 'red',
      user: approval.approved_by,
      details: approval.feedback,
    });
  }

  return events;
}