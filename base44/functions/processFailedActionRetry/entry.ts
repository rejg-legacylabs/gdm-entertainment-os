import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { retryId, manualRetry = false } = await req.json();

    // Get the failed action record
    const retry = await base44.entities.FailedActionRetry.read(retryId);
    if (!retry) {
      return Response.json({ error: 'Retry record not found' }, { status: 404 });
    }

    // Check if max retries exceeded
    if (retry.retry_count >= retry.max_retries && !manualRetry) {
      return Response.json({
        success: false,
        message: 'Max retries exceeded',
        status: 'failed_permanently',
        requiresManualIntervention: true,
      }, { status: 400 });
    }

    // Check if issue is resolved (e.g., token refreshed)
    const health = await base44.entities.ConnectorHealth.filter({
      connected_account_id: retry.connected_account_id,
    });

    if (health.length > 0 && health[0].token_status === 'valid' && health[0].permissions_valid) {
      // Account is now healthy, can retry
      return Response.json({
        success: true,
        message: 'Account is now healthy. Retry can proceed.',
        canRetry: true,
        nextStep: 'retry_action',
      });
    }

    // Account still has issues
    if (retry.error_type === 'token_expired') {
      return Response.json({
        success: false,
        message: 'Token is still invalid',
        requiredAction: 'reconnect_account',
        nextStep: 'redirect_to_reconnect',
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      message: 'Account still has issues',
      blockedReason: retry.error_type,
      requiredAction: retry.required_action,
    }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});