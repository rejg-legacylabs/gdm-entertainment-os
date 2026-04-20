import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId } = await req.json();

    // Get campaign
    const campaigns = await base44.entities.SocialCampaign.list({ id: campaignId });

    if (campaigns.length === 0) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaign = campaigns[0];

    // Get all posts in campaign
    const posts = await base44.entities.SocialPost.filter({
      campaign_id: campaignId,
    });

    // Aggregate metrics
    const totalLikes = posts.reduce((sum, p) => sum + (p.engagement_likes || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.engagement_comments || 0), 0);
    const totalShares = posts.reduce((sum, p) => sum + (p.engagement_shares || 0), 0);
    const totalViews = posts.reduce((sum, p) => sum + (p.engagement_views || 0), 0);
    const totalEngagement = totalLikes + totalComments + totalShares;

    const performance = {
      campaign_id: campaignId,
      total_posts: posts.length,
      total_reach: totalViews,
      total_impressions: totalViews,
      total_engagement: totalEngagement,
      total_likes: totalLikes,
      total_comments: totalComments,
      total_shares: totalShares,
      engagement_rate: posts.length > 0 ? ((totalEngagement / totalViews) * 100).toFixed(2) : 0,
      progress_toward_goal: (campaign.current_amount / campaign.goal_amount * 100).toFixed(1),
      posts: posts.map(p => ({
        id: p.id,
        content: p.content,
        likes: p.engagement_likes,
        comments: p.engagement_comments,
        shares: p.engagement_shares,
      })),
    };

    return Response.json({ success: true, performance });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});