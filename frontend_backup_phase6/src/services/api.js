/**
 * API client service for NxtWave AI Project Matcher & Viral Growth Engine
 */

// Generate or retrieve persistent browser session ID
function getSessionId() {
  let sessionId = localStorage.getItem('nxtwave_session_id');
  if (!sessionId) {
    sessionId = 'ses_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('nxtwave_session_id', sessionId);
  }
  return sessionId;
}

// Referral Attribution Helper - First Valid Referral Policy
export function storeReferralAttribution(code) {
  if (!code) return;
  const clean = code.trim().toUpperCase();
  // Attribution policy: FIRST VALID REFERRAL
  // Only set if not already attributed in this browser journey
  const existing = localStorage.getItem('nxtwave_referred_by');
  if (!existing) {
    localStorage.setItem('nxtwave_referred_by', clean);
  }
}

export function getReferralAttribution() {
  return localStorage.getItem('nxtwave_referred_by');
}

export function storeUserReferralCode(code) {
  if (code) {
    localStorage.setItem('nxtwave_my_referral_code', code.trim().toUpperCase());
  }
}

export function getUserReferralCode() {
  return localStorage.getItem('nxtwave_my_referral_code');
}

export function buildReferralUrl(code) {
  const origin = window.location.origin;
  return `${origin}/?ref=${encodeURIComponent(code)}`;
}

export async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Backend health check failed');
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return { status: 'offline' };
  }
}

export async function fetchCatalog() {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to load project catalog');
  return await res.json();
}

export async function submitQuizAnswers(answers) {
  const payload = {
    session_id: getSessionId(),
    year_of_study: parseInt(answers.year_of_study, 10),
    branch: answers.branch,
    coding_level: answers.coding_level,
    interest_area: answers.interest_area,
    primary_goal: answers.primary_goal,
    preferred_tech: answers.preferred_tech || 'Python'
  };

  console.log("[QUIZ FINAL PROFILE]", payload);

  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to generate recommendation');
  }

  return await res.json();
}

export async function switchProject(userId, targetProjectId) {
  const res = await fetch(`/api/recommend/switch/${userId}/${targetProjectId}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to switch project');
  }
  return await res.json();
}

export async function registerForWorkshop(regData) {
  // Pull attribution from localStorage if not explicitly supplied
  const referredBy = regData.referred_by_code || getReferralAttribution() || null;

  const payload = {
    session_id: getSessionId(),
    user_id: regData.user_id,
    full_name: regData.full_name,
    email: regData.email,
    whatsapp_number: regData.whatsapp_number,
    college_name: regData.college_name,
    referred_by_code: referredBy
  };

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Registration failed. Please check your details.');
  }

  const result = await res.json();
  // Store newly issued referral code for Growth Hub
  if (result.referral_code) {
    storeUserReferralCode(result.referral_code);
  }

  return result;
}

// ==========================================
// Phase 3: Viral Referral APIs
// ==========================================

export async function getReferralContext(code) {
  if (!code) return { valid: false };
  try {
    const res = await fetch(`/api/referrals/${encodeURIComponent(code)}`);
    if (!res.ok) return { valid: false };
    return await res.json();
  } catch (err) {
    console.warn('Error resolving referral context:', err);
    return { valid: false };
  }
}

export async function recordReferralClick(code, utmSource = null, referrerUrl = null) {
  if (!code) return;
  try {
    const payload = {
      session_id: getSessionId(),
      referral_code: code.trim().toUpperCase(),
      utm_source: utmSource,
      referrer_url: referrerUrl || document.referrer || null
    };

    await fetch('/api/referrals/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Failed to record referral click:', err);
  }
}

export async function getReferralHub(code) {
  if (!code) throw new Error('Referral code required');
  const res = await fetch(`/api/referrals/${encodeURIComponent(code)}/hub`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to load referral hub');
  }
  return await res.json();
}

export { getSessionId };
