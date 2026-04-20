import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check which secrets are set
    const platformSecrets = {
      twitter: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_BEARER_TOKEN', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'],
      linkedin: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'],
      youtube: ['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET', 'YOUTUBE_API_KEY'],
      pinterest: ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET'],
      facebook: ['META_APP_ID', 'META_APP_SECRET', 'META_PAGE_ACCESS_TOKEN'],
      instagram: ['META_APP_ID', 'META_APP_SECRET', 'INSTAGRAM_BUSINESS_ACCOUNT_ID'],
      tiktok: ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET'],
      snapchat: ['SNAPCHAT_CLIENT_ID', 'SNAPCHAT_CLIENT_SECRET'],
    };

    const secretStatus = {};

    // Check each platform's secrets
    for (const [platform, secrets] of Object.entries(platformSecrets)) {
      const allSet = secrets.every(secret => {
        const value = Deno.env.get(secret);
        return value && value.length > 0;
      });

      secretStatus[platform] = {
        isComplete: allSet,
        requiredSecrets: secrets,
        missingSecrets: secrets.filter(secret => !Deno.env.get(secret) || Deno.env.get(secret).length === 0),
      };
    }

    return Response.json({ success: true, secretStatus });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});