// ─── Favicon URL ────────────────────────────────────────────────────────────
export function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

// ─── Domain extraction ────────────────────────────────────────────────────────
export function getDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// ─── Normalize URL ────────────────────────────────────────────────────────────
export function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return 'https://' + trimmed;
  }
  return trimmed;
}

// ─── Validate URL ────────────────────────────────────────────────────────────
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ─── Auto-fetch page metadata ─────────────────────────────────────────────────
// Uses Microlink API (free, CORS-enabled)
export async function fetchUrlMetadata(url, signal) {
  try {
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&palette=false&audio=false&video=false&iframe=false`;
    const res = await fetch(apiUrl, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success') return null;
    return {
      title: data.data?.title || null,
      description: data.data?.description || null,
    };
  } catch {
    return null;
  }
}

// ─── Time ago ────────────────────────────────────────────────────────────────
export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'az önce';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}d önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}s önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}g önce`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}h önce`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}ay önce`;
  return `${Math.floor(months / 12)}y önce`;
}
