type PlanLike = {
  name?: string | null;
  appleProductId?: string | null;
};

const LEGACY_APPLE_PRODUCT_ID_MAP: Record<string, string> = {
  // Backward-compat: earlier seeds used bundle-like IDs.
  'com.taiyarineetki.educationapp.neet2026': 'neet_2026_plan',
  'com.taiyarineetki.educationapp.neet2027': 'neet_2027_plan',
};

export const getPlanAppleProductId = (plan?: PlanLike | null): string | null => {
  if (!plan) return null;

  const explicit = typeof plan.appleProductId === 'string' ? plan.appleProductId.trim() : '';
  if (explicit) return LEGACY_APPLE_PRODUCT_ID_MAP[explicit] ?? explicit;

  const name = typeof plan.name === 'string' ? plan.name.trim() : '';
  if (!name) return null;

  const lowered = name.toLowerCase();
  if (lowered.includes('neet') && lowered.includes('2026')) return 'neet_2026_plan';
  if (lowered.includes('neet') && lowered.includes('2027')) return 'neet_2027_plan';

  return null;
};

