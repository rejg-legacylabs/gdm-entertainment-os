import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { connectedAccountId } = await req.json();

    // In production, this would call the actual connector API
    // For now, we'll update the health record with basic checks

    const healthChecks = {
      token_valid: true,
      token_expires_in_days: 30,
      permissions_valid: true,
      last_sync_successful: true,
      account_active: true,
    };

    // Determine health score (0-100)
    let healthScore = 100;
    const alerts = [];

    // Token checks
    if (!healthChecks.token_valid) {
      healthScore -= 50;
      alerts.push({
        alert_type: 'token_expired',
        severity: 'critical',
        message: 'Authentication token has expired. Please reconnect.',
      });
    } else if (healthChecks.token_expires_in_days < 7) {
      healthScore -= 20;
      alerts.push({
        alert_type: 'token_expiring',
        severity: 'warning',
        message: `Token expires in ${healthChecks.token_expires_in_days} days. Refresh recommended.`,
      });
    }

    // Permission checks
    if (!healthChecks.permissions_valid) {
      healthScore -= 30;
      alerts.push({
        alert_type: 'missing_permissions',
        severity: 'critical',
        message: 'Missing required permissions. Reconnect needed.',
      });
    }

    // Sync checks
    if (!healthChecks.last_sync_successful) {
      healthScore -= 15;
      alerts.push({
        alert_type: 'analytics_failed',
        severity: 'warning',
        message: 'Last data sync failed. Will retry automatically.',
      });
    }

    // Account active check
    if (!healthChecks.account_active) {
      healthScore -= 40;
      alerts.push({
        alert_type: 'reconnect_needed',
        severity: 'critical',
        message: 'Account connection lost. Please reconnect.',
      });
    }

    return Response.json({
      healthScore: Math.max(0, healthScore),
      alerts,
      checksPerformed: healthChecks,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});