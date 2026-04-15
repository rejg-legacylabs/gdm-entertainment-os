import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      campaignId,
      campaignName,
      brandName,
      objective,
      cta,
      audience,
      platforms = ['instagram', 'facebook'],
      sourceMaterial,
    } = await req.json();

    if (!campaignId || !campaignName || !brandName) {
      return Response.json(
        { error: 'campaignId, campaignName, and brandName required' },
        { status: 400 }
      );
    }

    const creatives = [];

    // Generate hero image
    const heroPrompt = `Create a hero ad image for ${brandName}'s "${campaignName}" campaign. 
Objective: ${objective || 'general awareness'}. 
CTA: ${cta || 'Learn More'}. 
Context: ${sourceMaterial || 'professional campaign creative'}.
Style: premium, luxury, engaging. Format: landscape. Make it eye-catching and brand-aligned.`;

    console.log('Generating hero image...');
    const heroImage = await base44.integrations.Core.GenerateImage({
      prompt: heroPrompt,
    });

    creatives.push({
      type: 'hero_ad',
      platform: 'multi',
      image_url: heroImage.url,
      image_prompt: heroPrompt,
    });

    // Generate 3 supporting post graphics
    const postTypes = [
      'motivational quote card',
      'benefit-focused graphic',
      'community impact graphic',
    ];

    for (const postType of postTypes) {
      const postPrompt = `Create a ${postType} for ${brandName}'s ${campaignName}. 
Context: ${sourceMaterial || 'campaign support'}. 
Style: modern, engaging, brand-consistent. Format: square.`;

      console.log(`Generating ${postType}...`);
      const postImage = await base44.integrations.Core.GenerateImage({
        prompt: postPrompt,
      });

      creatives.push({
        type: 'supporting_post',
        platform: 'instagram',
        image_url: postImage.url,
        image_prompt: postPrompt,
      });
    }

    // Generate text for all creatives
    const textPrompt = `Generate marketing copy variants for ${brandName}'s campaign.
Campaign: ${campaignName}
Objective: ${objective || 'general awareness'}
CTA: ${cta || 'Learn More'}
Audience: ${audience || 'general audience'}

Provide 5 different caption variants (each 100-150 chars) suitable for social media.
Each should be unique in tone and approach.`;

    console.log('Generating captions...');
    const captionResult = await base44.integrations.Core.InvokeLLM({
      prompt: textPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          captions: {
            type: 'array',
            items: { type: 'string' },
          },
          hashtags: {
            type: 'array',
            items: { type: 'string' },
          },
          cta_variants: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    });

    return Response.json({
      success: true,
      creative_set: {
        campaign_id: campaignId,
        campaign_name: campaignName,
        brand_name: brandName,
        total_creatives: creatives.length,
        creatives,
        captions: captionResult.captions || [],
        hashtags: captionResult.hashtags || [],
        cta_variants: captionResult.cta_variants || [],
      },
    });
  } catch (error) {
    console.error('Error generating creative set:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});