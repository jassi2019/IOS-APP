const getPlanAppleProductId = (plan) => {
  if (!plan) return null;

  // Prefer the explicit DB value.
  const explicitRaw = plan.appleProductId ?? plan?.dataValues?.appleProductId;
  const explicit = typeof explicitRaw === 'string' ? explicitRaw.trim() : explicitRaw;
  if (explicit) {
    // Backward-compat: earlier seeds used bundle-like IDs which are no longer used.
    if (explicit === 'com.taiyarineetki.educationapp.neet2026') return 'neet_2026_plan';
    if (explicit === 'com.taiyarineetki.educationapp.neet2027') return 'neet_2027_plan';
    return explicit;
  }

  const name = String(plan.name || plan?.dataValues?.name || '').trim();
  if (!name) return null;

  // Fallback mapping for legacy DB rows where appleProductId wasn't stored yet.
  // Keep this intentionally simple and deterministic.
  const lowered = name.toLowerCase();
  if (lowered.includes('neet') && lowered.includes('2026')) return 'neet_2026_plan';
  if (lowered.includes('neet') && lowered.includes('2027')) return 'neet_2027_plan';

  return null;
};

module.exports = {
  getPlanAppleProductId,
};
