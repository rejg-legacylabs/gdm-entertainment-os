import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { campaignId, clientId } = await req.json();

    // Fetch campaign posts
    const posts = await base44.entities.Post.filter({ campaign_id: campaignId });
    
    if (posts.length === 0) {
      return Response.json({ error: 'No posts found for campaign' }, { status: 404 });
    }

    // Fetch existing performance metrics
    const metrics = await base44.entities.PerformanceMetric.filter({ campaign_id: campaignId });

    // Analyze patterns
    const platformPerformance = {};
    const postTypePerformance = {};
    const ctaPerformance = {};
    const hookPerformance = {};
    const timingPerformance = { days: {}, hours: {} };

    metrics.forEach(m => {
      // Platform analysis
      if (!platformPerformance[m.platform]) {
        platformPerformance[m.platform] = { rates: [], count: 0 };
      }
      platformPerformance[m.platform].rates.push(m.engagement_rate || 0);
      platformPerformance[m.platform].count++;

      // Post type analysis
      if (!postTypePerformance[m.post_type]) {
        postTypePerformance[m.post_type] = { rates: [], count: 0 };
      }
      postTypePerformance[m.post_type].rates.push(m.engagement_rate || 0);
      postTypePerformance[m.post_type].count++;

      // CTA analysis
      if (m.cta_used) {
        if (!ctaPerformance[m.cta_used]) {
          ctaPerformance[m.cta_used] = { rates: [], count: 0 };
        }
        ctaPerformance[m.cta_used].rates.push(m.engagement_rate || 0);
        ctaPerformance[m.cta_used].count++;
      }

      // Hook analysis
      if (m.hook_used) {
        if (!hookPerformance[m.hook_used]) {
          hookPerformance[m.hook_used] = { rates: [], count: 0 };
        }
        hookPerformance[m.hook_used].rates.push(m.engagement_rate || 0);
        hookPerformance[m.hook_used].count++;
      }

      // Timing analysis
      if (m.publish_day) {
        if (!timingPerformance.days[m.publish_day]) {
          timingPerformance.days[m.publish_day] = { rates: [] };
        }
        timingPerformance.days[m.publish_day].rates.push(m.engagement_rate || 0);
      }

      if (m.publish_hour !== undefined) {
        if (!timingPerformance.hours[m.publish_hour]) {
          timingPerformance.hours[m.publish_hour] = { rates: [] };
        }
        timingPerformance.hours[m.publish_hour].rates.push(m.engagement_rate || 0);
      }
    });

    // Calculate averages
    const calculateAvg = (rates) => rates.length > 0 ? (rates.reduce((a, b) => a + b, 0) / rates.length * 100).toFixed(2) : 0;

    const analysis = {
      totalPosts: metrics.length,
      platformAnalysis: Object.entries(platformPerformance).map(([platform, data]) => ({
        platform,
        avgEngagementRate: calculateAvg(data.rates),
        postCount: data.count,
      })),
      postTypeAnalysis: Object.entries(postTypePerformance).map(([type, data]) => ({
        type,
        avgEngagementRate: calculateAvg(data.rates),
        postCount: data.count,
      })),
      ctaAnalysis: Object.entries(ctaPerformance).map(([cta, data]) => ({
        cta,
        avgEngagementRate: calculateAvg(data.rates),
        postCount: data.count,
      })),
      hookAnalysis: Object.entries(hookPerformance).map(([hook, data]) => ({
        hook,
        avgEngagementRate: calculateAvg(data.rates),
        postCount: data.count,
      })),
      timingAnalysis: {
        days: Object.entries(timingPerformance.days).map(([day, data]) => ({
          day,
          avgEngagementRate: calculateAvg(data.rates),
        })),
        hours: Object.entries(timingPerformance.hours).map(([hour, data]) => ({
          hour: parseInt(hour),
          avgEngagementRate: calculateAvg(data.rates),
        })),
      },
    };

    return Response.json(analysis);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});