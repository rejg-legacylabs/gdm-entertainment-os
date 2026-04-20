import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    // Fetch safe context data only
    const campaigns = await base44.entities.Campaign.filter({ status: 'active' }, '-created_date', 5);
    const recentContent = await base44.entities.ContentAsset.filter({}, '-created_date', 5);
    const upcomingDeadlines = await base44.entities.Campaign.filter({}, '-created_date', 10);

    const contextSummary = `
You are an internal creative and campaign assistant for GDM Entertainment OS.

SAFE DATA AVAILABLE:
- Active campaigns: ${campaigns.length}
- Recent content created: ${recentContent.length}
- Upcoming campaign deadlines: ${upcomingDeadlines.map(c => c.name || 'Unnamed').join(', ')}

YOUR SCOPE:
You help with content creation, campaign planning, donor outreach messaging, social media strategy, and storytelling for HOH and partner organizations.

STRICT BOUNDARIES:
- You have ZERO access to client HIPAA data, case notes, or operational system data
- You cannot access Pathways Hub, Legacy Properties, or MRT data
- If asked about client data, politely decline and explain you only have access to public-facing content and campaign data
- Never attempt to access, retrieve, or reference private client information

TONE: Professional, creative, strategic, donor-focused.
    `.trim();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: contextSummary,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || 'API error' },
        { status: response.status }
      );
    }

    const assistantMessage = data.content[0]?.text || '';
    return Response.json({ message: assistantMessage });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});