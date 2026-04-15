import { base44 } from '@/api/base44Client';

// Check for duplicate posts (same caption/media published recently)
export const checkDuplicatePost = async (post, hours = 24) => {
  try {
    const posts = await base44.entities.Post.list();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    const duplicates = posts.filter(p => 
      p.id !== post.id &&
      p.platform === post.platform &&
      p.caption === post.caption &&
      new Date(p.created_date) > cutoff
    );

    return {
      isDuplicate: duplicates.length > 0,
      duplicates,
      message: duplicates.length > 0 
        ? `Warning: ${duplicates.length} similar post(s) published in last ${hours} hours`
        : null,
    };
  } catch (error) {
    console.error('Error checking duplicates:', error);
    return { isDuplicate: false, duplicates: [] };
  }
};

// Check if content requires approval before publishing
export const checkApprovalRequired = async (post) => {
  try {
    if (post.status !== 'approved') {
      return {
        requiresApproval: true,
        reason: 'Post status is not approved',
        canPublish: false,
      };
    }

    return {
      requiresApproval: false,
      reason: null,
      canPublish: true,
    };
  } catch (error) {
    console.error('Error checking approval:', error);
    return { requiresApproval: true, reason: 'Unable to verify approval', canPublish: false };
  }
};

// Check for sensitive comment reply safety
export const checkReplyIsSafe = async (comment, reply) => {
  try {
    const unsafeTypes = ['complaint', 'abuse', 'spam'];
    const requiresApproval = unsafeTypes.includes(comment.comment_type);

    return {
      isSafe: !requiresApproval,
      requiresApproval,
      reason: requiresApproval 
        ? `${comment.comment_type} comments require human approval before reply`
        : null,
    };
  } catch (error) {
    console.error('Error checking reply safety:', error);
    return { isSafe: false, requiresApproval: true, reason: 'Unable to verify safety' };
  }
};

// Check for approval lock violations
export const checkApprovalLock = async (post) => {
  try {
    // If post was approved, check if it's been edited since approval
    if (post.status === 'approved' && post.approved_date) {
      const approvalDate = new Date(post.approved_date);
      const lastEdit = new Date(post.updated_date);

      if (lastEdit > approvalDate) {
        return {
          isLocked: true,
          reason: 'Content changed after approval - requires re-approval',
          changedSince: post.approved_date,
        };
      }
    }

    return {
      isLocked: false,
      reason: null,
    };
  } catch (error) {
    console.error('Error checking approval lock:', error);
    return { isLocked: false, reason: null };
  }
};

// Check token/connection health
export const checkConnectionHealth = async (connectedAccount) => {
  try {
    const issues = [];

    if (connectedAccount.status !== 'connected') {
      issues.push({
        type: 'disconnected',
        severity: 'critical',
        message: 'Account is disconnected',
      });
    }

    if (connectedAccount.token_expires_at && new Date(connectedAccount.token_expires_at) < new Date()) {
      issues.push({
        type: 'expired_token',
        severity: 'critical',
        message: 'Authentication token expired',
      });
    }

    if (connectedAccount.missing_scopes && connectedAccount.missing_scopes.length > 0) {
      issues.push({
        type: 'missing_permissions',
        severity: 'high',
        message: `Missing permissions: ${connectedAccount.missing_scopes.join(', ')}`,
      });
    }

    if (connectedAccount.last_sync && new Date(connectedAccount.last_sync) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      issues.push({
        type: 'stale_data',
        severity: 'medium',
        message: 'No sync in 24 hours',
      });
    }

    return {
      isHealthy: issues.length === 0,
      issues,
    };
  } catch (error) {
    console.error('Error checking connection health:', error);
    return { isHealthy: false, issues: [{ type: 'unknown', severity: 'high', message: 'Unable to check health' }] };
  }
};

// Check compliance notes apply
export const getApplicableComplianceNotes = async (campaign, post = null) => {
  try {
    const notes = await base44.entities.ComplianceNote.filter({
      campaign_id: campaign.id,
      is_active: true,
    });

    if (post) {
      return notes.filter(n => 
        (!n.applies_to_platforms || n.applies_to_platforms.includes(post.platform)) &&
        (!n.applies_to_content_types || n.applies_to_content_types.includes(post.content_type))
      );
    }

    return notes;
  } catch (error) {
    console.error('Error fetching compliance notes:', error);
    return [];
  }
};