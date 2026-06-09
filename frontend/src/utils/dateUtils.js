/**
 * Format an ISO date string or Date to a readable format
 * e.g. "2024-01-15" → "Jan 15, 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Return today's date as YYYY-MM-DD string (local time)
 */
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Sort an array of objects by a date field, descending (newest first)
 */
export const sortByDateDesc = (arr, field = 'checkin_date') => {
  return [...arr].sort(
    (a, b) => new Date(b[field]) - new Date(a[field])
  );
};

/**
 * Relative time label — e.g. "2 days ago"
 */
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
};
