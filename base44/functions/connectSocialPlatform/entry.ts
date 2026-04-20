import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, authCode, accountName, accountHandle, platformAccountId } = await req.json();

    // Create or update SocialAccount record
    const accountData = {
      platform,
      account_name: accountName,
      account_handle: accountHandle,
      platform_account_id: platformAccountId,
      access_token: authCode, // In production, exchange authCode for actual token
      status: 'connected',
      organization_id: user.organization_id || 'demo-org',
    };

    const account = await base44.entities.SocialAccount.create(accountData);

    return Response.json({ success: true, account_id: account.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});