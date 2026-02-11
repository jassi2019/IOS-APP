const parseAwsDateToMs = (value: string): number | null => {
  // Example: 20251013T160303Z
  const match = value.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/
  );
  if (!match) return null;

  const [, y, mo, d, h, mi, s] = match;
  const ms = Date.UTC(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(s)
  );

  return Number.isFinite(ms) ? ms : null;
};

const getSignedUrlExpiryMs = (url: URL): number | null => {
  // Canva URLs commonly contain this param.
  const responseExpiresRaw = url.searchParams.get('response-expires');
  if (responseExpiresRaw) {
    const parsed = Date.parse(responseExpiresRaw);
    if (Number.isFinite(parsed)) return parsed;
  }

  // Generic AWS signed URL fallback.
  const amzDateRaw = url.searchParams.get('X-Amz-Date');
  const amzExpiresRaw = url.searchParams.get('X-Amz-Expires');
  if (!amzDateRaw || !amzExpiresRaw) return null;

  const startMs = parseAwsDateToMs(amzDateRaw);
  const expiresSeconds = Number(amzExpiresRaw);
  if (!startMs || !Number.isFinite(expiresSeconds)) return null;

  return startMs + expiresSeconds * 1000;
};

export const getRenderableThumbnailUrl = (
  rawUrl?: string | null
): string | null => {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:') {
    return null;
  }

  const expiryMs = getSignedUrlExpiryMs(parsed);
  if (expiryMs && expiryMs <= Date.now()) {
    return null;
  }

  return parsed.toString();
};

