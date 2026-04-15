import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId, commentText, commentType } = await req.json();

    // Get comment
    const comment = await base44.entities.Comment.read(commentId);
    if (!comment) {
      return Response.json({ error: 'Comment not found' }, { status: 404 });
    }

    // AI Draft Reply based on comment type
    let draftReply = '';
    let requiresApproval = false;

    if (commentType === 'praise') {
      draftReply = `Thank you so much for the kind words! 🙌 We really appreciate your support.`;
      requiresApproval = false;
    } else if (commentType === 'question') {
      draftReply = `Great question! We'd love to help. Could you share a bit more detail so we can provide the best answer?`;
      requiresApproval = true;
    } else if (commentType === 'complaint') {
      draftReply = `We're sorry to hear you had this experience. We'd like to make it right. Please reach out to us directly so we can resolve this.`;
      requiresApproval = true;
    } else if (commentType === 'lead') {
      draftReply = `Thanks for your interest! We'd love to chat more. DM us or visit our site to get started.`;
      requiresApproval = true;
    } else if (commentType === 'spam' || commentType === 'abuse') {
      draftReply = null;
      requiresApproval = true;
    } else {
      draftReply = `Thanks for reaching out! We appreciate your engagement.`;
      requiresApproval = true;
    }

    // Create reply record
    if (draftReply) {
      const reply = await base44.entities.CommentReply.create({
        comment_id: commentId,
        platform: comment.platform,
        reply_text: draftReply,
        ai_draft: draftReply,
        suggested_by_ai: true,
        status: 'draft',
        requires_approval: requiresApproval,
      });

      return Response.json({
        reply,
        draftReply,
        requiresApproval,
        message: requiresApproval ? 'Reply drafted - requires approval' : 'Reply drafted - ready to send',
      });
    } else {
      return Response.json({
        error: 'Cannot auto-reply to this comment type',
        commentType,
      }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});