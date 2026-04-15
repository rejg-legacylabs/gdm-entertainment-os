import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId, clientId } = await req.json();

    // Get campaign
    const campaign = await base44.entities.Campaign.read(campaignId);
    if (!campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get performance metrics for this client
    const metrics = await base44.entities.PerformanceMetric.filter({ client_id: clientId });
    
    if (metrics.length === 0) {
      return Response.json({
        message: 'Not enough data yet',
        recommendations: [],
      });
    }

    // Find top performing elements
    const topHooks = {};
    const topCTAs = {};
    const topFormats = {};
    const topPostTypes = {};

    metrics.forEach(m => {
      if (m.hook_used) {
        topHooks[m.hook_used] = (topHooks[m.hook_used] || 0) + (m.engagement_rate || 0);
      }
      if (m.cta_used) {
        topCTAs[m.cta_used] = (topCTAs[m.cta_used] || 0) + (m.engagement_rate || 0);
      }
      if (m.creative_format) {
        topFormats[m.creative_format] = (topFormats[m.creative_format] || 0) + (m.engagement_rate || 0);
      }
      if (m.post_type) {
        topPostTypes[m.post_type] = (topPostTypes[m.post_type] || 0) + (m.engagement_rate || 0);
      }
    });

    // Use AI to generate recommendations
    const recommendations = await base44.integrations.Core.InvokeLLM({
      prompt: `Based on the following client performance data, generate content recommendations.

Client Performance Data:
- Total posts analyzed: ${metrics.length}
- Top performing hooks: ${JSON.stringify(topHooks)}
- Top performing CTAs: ${JSON.stringify(topCTAs)}
- Top performing formats: ${JSON.stringify(topFormats)}
- Top performing post types: ${JSON.stringify(topPostTypes)}

Campaign: ${campaign.name}
Objective: ${campaign.objective}

Provide:
1. Top 3 hooks to use in next posts
2. Best CTA style for this client
3. Recommended post format by platform
4. Content themes to avoid
5. Optimal posting windows (day and time ranges)
6. Next campaign direction recommendation

Format as JSON with keys: hooks, cta_recommendation, format_by_platform, themes_to_avoid, posting_windows, next_campaign_direction`,
      response_json_schema: {
        type: 'object',
        properties: {
          hooks: { type: 'array', items: { type: 'string' } },
          cta_recommendation: { type: 'string' },
          format_by_platform: { type: 'object' },
          themes_to_avoid: { type: 'array', items: { type: 'string' } },
          posting_windows: { type: 'object' },
          next_campaign_direction: { type: 'string' },
        },
      },
    });

    return Response.json({
      recommendations,
      dataPoints: metrics.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});