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
      brandId,
      brandName,
      creativeType,
      format,
      platform,
      objective,
      cta,
      audience,
      sourceUrl,
      sourceMaterial,
      style = 'balanced',
    } = await req.json();

    if (!campaignId || !creativeType || !format) {
      return Response.json(
        { error: 'campaignId, creativeType, and format required' },
        { status: 400 }
      );
    }

    // Build AI prompt for image generation
    const imagePrompt = buildImagePrompt({
      creativeType,
      format,
      platform,
      brandName,
      objective,
      cta,
      audience,
      sourceUrl,
      sourceMaterial,
      style,
    });

    // Generate image using AI
    const imageResult = await base44.integrations.Core.GenerateImage({
      prompt: imagePrompt,
    });

    const imageUrl = imageResult.url;

    // Generate text/captions using AI
    const textPrompt = buildTextPrompt({
      creativeType,
      platform,
      objective,
      cta,
      audience,
      sourceMaterial,
    });

    const textResult = await base44.integrations.Core.InvokeLLM({
      prompt: textPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          subheadline: { type: 'string' },
          cta_line: { type: 'string' },
          caption: { type: 'string' },
          short_caption: { type: 'string' },
          long_caption: { type: 'string' },
          hashtag_suggestions: {
            type: 'array',
            items: { type: 'string' },
          },
          text_overlay: { type: 'string' },
        },
      },
    });

    // Create and persist GeneratedCreative record
    const savedCreative = await base44.entities.GeneratedCreative.create({
      campaign_id: campaignId,
      campaign_name: campaignName,
      brand_id: brandId,
      brand_name: brandName,
      creative_type: creativeType,
      format,
      platform,
      image_url: imageUrl,
      image_prompt: imagePrompt,
      headline: textResult.headline,
      subheadline: textResult.subheadline,
      cta_line: textResult.cta_line,
      caption: textResult.caption,
      short_caption: textResult.short_caption,
      long_caption: textResult.long_caption,
      hashtag_suggestions: textResult.hashtag_suggestions,
      text_overlay: textResult.text_overlay,
      approval_status: 'draft',
      ready_to_publish: false,
      source_material: {
        source_type: sourceUrl ? 'url' : 'campaign_brief',
        source_url: sourceUrl,
        summary: sourceMaterial,
      },
    });

    return Response.json({
      success: true,
      creative: savedCreative,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function buildImagePrompt({
  creativeType,
  format,
  platform,
  brandName,
  objective,
  cta,
  audience,
  sourceUrl,
  sourceMaterial,
  style,
}) {
  let prompt = `Create a professional ${style} ${creativeType} for ${brandName}. `;

  if (objective) prompt += `Campaign objective: ${objective}. `;
  if (cta) prompt += `Call-to-action: ${cta}. `;
  if (audience) prompt += `Target audience: ${audience}. `;
  if (format) prompt += `Format: ${format}. `;
  if (platform) prompt += `Platform: ${platform}. `;
  if (sourceMaterial) prompt += `Context: ${sourceMaterial}. `;

  prompt += `Style: ${style}. Design should be premium, on-brand, and ready for immediate use. `;
  prompt += `Include brand colors and maintain professional luxury aesthetic.`;

  return prompt;
}

function buildTextPrompt({
  creativeType,
  platform,
  objective,
  cta,
  audience,
  sourceMaterial,
}) {
  let prompt = `Generate compelling marketing copy for a ${creativeType} on ${platform}. `;

  if (objective) prompt += `Campaign goal: ${objective}. `;
  if (cta) prompt += `Call-to-action: ${cta}. `;
  if (audience) prompt += `Audience: ${audience}. `;
  if (sourceMaterial) prompt += `Context: ${sourceMaterial}. `;

  prompt += `
Generate:
- A compelling headline (under 10 words)
- A subheadline (under 20 words)
- A CTA line (2-3 words, action-oriented)
- A full caption suitable for ${platform}
- A short caption (under 50 characters)
- A long caption (150-200 characters)
- 5 relevant hashtags for ${platform}
- A text overlay suggestion for the image (max 5 words)

Make it engaging, professional, and brand-appropriate.`;

  return prompt;
}