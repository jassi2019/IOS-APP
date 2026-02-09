type PlanLike = {
  name?: string | null;
  appleProductId?: string | null;
};

export const getPlanAppleProductId = (plan?: PlanLike | null): string | null => {
  if (!plan) return null;

  const explicit = typeof plan.appleProductId === 'string' ? plan.appleProductId.trim() : '';
  if (explicit) {
    // Backward-compat: earlier seeds used bundle-like IDs.
    if (explicit === 'com.taiyarineetki.educationapp.neet2026') return 'neet_2026_plan';
    // 2027 is intentionally NOT auto-mapped unless explicitly configured.
    if (explicit === 'com.taiyarineetki.educationapp.neet2027') return null;
    return explicit;
  }

  const name = typeof plan.name === 'string' ? plan.name.trim() : '';
  if (!name) return null;

  const lowered = name.toLowerCase();
  if (lowered.includes('neet') && lowered.includes('2026')) return 'neet_2026_plan';

  return null;
};
