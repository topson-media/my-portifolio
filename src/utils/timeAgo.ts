/**
 * Accurate relative time formatter to tell viewers how much time since video/feedback was uploaded
 */
export function formatTimeAgo(timestamp?: string | number): string {
  if (!timestamp) return 'Just now';

  let timeMs: number;
  if (typeof timestamp === 'number') {
    timeMs = timestamp;
  } else if (!isNaN(Number(timestamp))) {
    timeMs = Number(timestamp);
  } else {
    // If it's a relative string already (like "Just now", "2 days ago")
    if (
      timestamp.toLowerCase().includes('ago') ||
      timestamp.toLowerCase().includes('just now') ||
      timestamp.toLowerCase().includes('today') ||
      timestamp.toLowerCase().includes('yesterday')
    ) {
      return timestamp;
    }

    const parsed = Date.parse(timestamp);
    if (isNaN(parsed)) return timestamp;
    timeMs = parsed;
  }

  const diffMs = Date.now() - timeMs;
  if (diffMs <= 0 || isNaN(diffMs)) return 'Just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export function formatUploadedTimeAgo(timestamp?: string | number): string {
  const ago = formatTimeAgo(timestamp);
  if (ago.toLowerCase().includes('just now')) return 'Uploaded just now';
  if (ago.toLowerCase().startsWith('uploaded')) return ago;
  return `Uploaded ${ago}`;
}

export function formatFeedbackTimeAgo(timestamp?: string | number): string {
  const ago = formatTimeAgo(timestamp);
  if (ago.toLowerCase().includes('just now')) return 'Posted just now';
  if (ago.toLowerCase().startsWith('posted')) return ago;
  return `Posted ${ago}`;
}
