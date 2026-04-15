import { base44 } from '@/api/base44Client';

export const logAction = async (actionData) => {
  try {
    const user = await base44.auth.me();
    
    const auditLog = {
      user_email: user?.email,
      user_role: user?.role,
      timestamp: new Date().toISOString(),
      ...actionData,
    };

    await base44.entities.AuditLog.create(auditLog);
  } catch (error) {
    console.error('Failed to log action:', error);
    // Don't throw - audit logging shouldn't break the app
  }
};

export const logCampaignAction = async (actionType, campaign, details = {}) => {
  await logAction({
    action_type: actionType,
    entity_type: 'campaign',
    entity_id: campaign.id,
    entity_name: campaign.name,
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    brand_id: campaign.brand_id,
    brand_name: campaign.brand_name,
    details,
    risk_level: 'low',
  });
};

export const logContentAction = async (actionType, post, details = {}) => {
  await logAction({
    action_type: actionType,
    entity_type: 'post',
    entity_id: post.id,
    entity_name: post.caption?.substring(0, 50),
    campaign_id: post.campaign_id,
    campaign_name: post.campaign_name,
    brand_id: post.brand_id,
    brand_name: post.brand_name,
    details,
    risk_level: actionType.includes('published') ? 'high' : 'medium',
  });
};

export const logApprovalAction = async (actionType, entity, approved, details = {}) => {
  await logAction({
    action_type: actionType,
    entity_type: entity.entity_type || 'post',
    entity_id: entity.id,
    entity_name: entity.name || entity.caption?.substring(0, 50),
    campaign_id: entity.campaign_id,
    campaign_name: entity.campaign_name,
    brand_id: entity.brand_id,
    brand_name: entity.brand_name,
    details: {
      approved,
      ...details,
    },
    risk_level: 'high',
  });
};

export const logOverride = async (overrideType, entity, reason) => {
  try {
    const user = await base44.auth.me();
    
    await base44.entities.OverrideLog.create({
      override_type: overrideType,
      entity_type: entity.entity_type || 'post',
      entity_id: entity.id,
      entity_name: entity.name || entity.title,
      campaign_id: entity.campaign_id,
      campaign_name: entity.campaign_name,
      brand_id: entity.brand_id,
      brand_name: entity.brand_name,
      requested_by: user?.email,
      requested_by_role: user?.role,
      reason,
      requested_at: new Date().toISOString(),
      status: 'executed',
      executed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log override:', error);
  }
};