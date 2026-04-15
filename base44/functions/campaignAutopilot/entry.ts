import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignData } = await req.json();

    // Create campaign
    const campaign = await base44.entities.Campaign.create({
      name: campaignData.basics.name,
      brand_name: campaignData.basics.brand,
      type: 'storytelling',
      objective: campaignData.analysis?.summary || campaignData.basics.goal,
      target_audience: campaignData.basics.targetAudience,
      platforms: campaignData.publishing.channels,
      start_date: new Date().toISOString().split('T')[0],
      status: campaignData.basics.mode === 'autopilot' ? 'active' : 'draft',
      content_frequency: campaignData.schedule.cadence,
      theme: campaignData.analysis?.contentPillars?.[0] || 'general',
      health_score: 75,
      total_posts: campaignData.content.length,
    });

    // Create posts from content pieces
    const posts = [];
    for (const piece of campaignData.content) {
      const post = await base44.entities.Post.create({
        brand_name: campaignData.basics.brand,
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        platform: piece.platform || 'instagram',
        content_type: piece.type || 'caption',
        caption: piece.caption || piece.description,
        cta: piece.cta,
        hashtags: piece.hashtags || [],
        status: campaignData.basics.mode === 'autopilot' ? 'scheduled' : 'draft',
      });
      posts.push(post);
    }

    // If autopilot mode, auto-schedule all posts
    if (campaignData.basics.mode === 'autopilot') {
      const startDate = new Date();
      const duration = campaignData.basics.duration;
      const postsToSchedule = posts.length;
      const daysBetweenPosts = Math.ceil(duration / postsToSchedule);

      for (let i = 0; i < posts.length; i++) {
        const scheduledDate = new Date(startDate.getTime() + i * daysBetweenPosts * 24 * 60 * 60 * 1000);
        
        await base44.entities.Post.update(posts[i].id, {
          scheduled_date: scheduledDate.toISOString(),
          status: 'scheduled',
        });
      }
    }

    // Create source ingestion records
    for (const source of campaignData.sources) {
      await base44.entities.SourceIngestion.create({
        brand_name: campaignData.basics.brand,
        source_type: source.type,
        source_url: source.type === 'url' ? source.content : null,
        title: source.content.substring(0, 100),
        raw_content: source.content,
        status: 'processed',
      });
    }

    return Response.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        posts: posts.length,
      },
      message: `Campaign "${campaign.name}" launched successfully!`,
    });
  } catch (error) {
    console.error('Campaign autopilot error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});