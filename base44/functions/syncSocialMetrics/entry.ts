import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, accountId } = await req.json();

    // Get the account
    const account = await base44.entities.SocialAccount.list({
      id: accountId,
    });

    if (account.length === 0) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    const socialAccount = account[0];

    // In production, fetch from platform API using access_token
    const today = new Date().toISOString().split('T')[0];
    const analyticsData = {
      platform,
      account_id: accountId,
      date: today,
      followers_count: socialAccount.follower_count || 0,
      new_followers: Math.floor(Math.random() * 50),
      impressions: Math.floor(Math.random() * 1000),
      reach: Math.floor(Math.random() * 800),
      engagement_rate: (Math.random() * 10).toFixed(2),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      organization_id: user.organization_id || 'demo-org',
    };

    const analytic = await base44.entities.SocialAnalytics.create(analyticsData);

    // Update the social account last_synced
    await base44.entities.SocialAccount.update(accountId, {
      last_synced: new Date().toISOString(),
    });

    return Response.json({ success: true, analytics_id: analytic.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});