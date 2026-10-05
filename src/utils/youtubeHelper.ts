/**
 * Helper utility to extract YouTube ID and build thumbnail URLs
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Raw 11-char ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Pattern 1: youtu.be/<id>
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // Pattern 2: youtube.com/watch?v=<id> (handles query parameters before and after v)
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Pattern 3: youtube.com/shorts/<id>
  const shortsMatch = cleanUrl.match(/\/(?:shorts|reel|reels)\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Pattern 4: youtube.com/embed/<id> or /v/<id>
  const embedMatch = cleanUrl.match(/\/(?:embed|v)\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // Pattern 5: youtube.com/live/<id>
  const liveMatch = cleanUrl.match(/\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch && liveMatch[1]) return liveMatch[1];

  return null;
}

export function getYouTubeThumbnail(url: string, quality: 'hq' | 'mq' | 'max' = 'hq'): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  if (quality === 'max') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (quality === 'mq') {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  // hqdefault.jpg is guaranteed to exist for all YouTube videos and shorts
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
