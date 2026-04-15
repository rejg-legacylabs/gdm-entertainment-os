// Date utility functions for proper handling of null/undefined/epoch dates

export const formatDate = (dateString, fallback = 'Not set') => {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    
    // Check for epoch/default dates (1969-12-31 or 1970-01-01)
    if (date.getFullYear() <= 1970) {
      return fallback;
    }
    
    // Check if date is in the future (invalid)
    if (date.getTime() > Date.now() + 30 * 24 * 60 * 60 * 1000) {
      return fallback;
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return fallback;
  }
};

export const formatDateTime = (dateString, fallback = 'Not set') => {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    
    // Check for epoch/default dates
    if (date.getFullYear() <= 1970) {
      return fallback;
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return fallback;
  }
};

export const formatRelativeDate = (dateString, fallback = 'Not set') => {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    
    // Check for epoch/default dates
    if (date.getFullYear() <= 1970) {
      return fallback;
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    return formatDate(dateString, fallback);
  } catch {
    return fallback;
  }
};

export const statusDateLabel = (status, dateString) => {
  if (!dateString) {
    if (status === 'pending') return 'Not requested';
    if (status === 'approved') return 'Not yet approved';
    if (status === 'changes_requested') return 'Pending revision';
    if (status === 'rejected') return 'Not rejected';
    return 'Not set';
  }
  return formatDate(dateString);
};

export const isPastDate = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    return date.getTime() < Date.now();
  } catch {
    return false;
  }
};

export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    return date.getTime() > Date.now();
  } catch {
    return false;
  }
};