import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId, clientData } = await req.json();

    // Get client info
    const client = await base44.entities.Client.read(clientId);
    if (!client) {
      return Response.json({ error: 'Client not found' }, { status: 404 });
    }

    // AI generate recommendations based on client profile
    const recommendations = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI strategist for a social media marketing agency. Based on the following client profile, provide recommendations:

Client: ${client.name}
Industry: ${client.industry}
Target Audience: ${client.target_audience}
Website: ${client.website}
Goals: ${client.campaign_objectives}

Provide:
1. A 2-3 sentence brand summary
2. Recommended package level (starter, growth, premium, elite)
3. 3-4 recommended campaign types to start with
4. Key risks or gaps in their setup
5. A brief strategy summary (2-3 sentences)

Format as JSON with keys: brand_summary, recommended_package, recommended_campaigns (array), risks (array), strategy_summary`,
      response_json_schema: {
        type: 'object',
        properties: {
          brand_summary: { type: 'string' },
          recommended_package: { type: 'string' },
          recommended_campaigns: { type: 'array', items: { type: 'string' } },
          risks: { type: 'array', items: { type: 'string' } },
          strategy_summary: { type: 'string' },
        },
      },
    });

    // Calculate missing items
    const missingItems = [];
    if (!client.website) missingItems.push('Website URL');
    if (!client.brand_voice) missingItems.push('Brand voice definition');
    if (!client.target_audience) missingItems.push('Target audience');
    if (!client.contact_email) missingItems.push('Billing contact');
    if (!client.onboarding_completed) missingItems.push('Asset upload');

    const result = {
      brand_summary: recommendations.brand_summary,
      recommended_package: recommendations.recommended_package,
      recommended_campaigns: recommendations.recommended_campaigns || [],
      risks: recommendations.risks || [],
      missing_items: missingItems,
      strategy_summary: recommendations.strategy_summary,
      generated_at: new Date().toISOString(),
    };

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});