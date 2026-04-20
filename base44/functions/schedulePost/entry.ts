import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, platforms, mediaUrls, hashtags, scheduledAt, campaignId } = await req.json();

    const postData = {
      content,
      platform: platforms,
      media_urls: mediaUrls || [],
      hashtags: hashtags || [],
      scheduled_at: scheduledAt,
      status: 'scheduled',
      post_type: 'post',
      campaign_id: campaignId,
      created_by: user.email,
      organization_id: user.organization_id || 'demo-org',
    };

    const post = await base44.entities.SocialPost.create(postData);

    return Response.json({ success: true, post_id: post.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});