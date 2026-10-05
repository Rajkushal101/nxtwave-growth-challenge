const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  const text = await response.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = { detail: text } }
  }

  if (!response.ok) {
    const err = new Error(data?.detail || data?.message || `Request failed (${response.status})`)
    err.status = response.status
    err.data = data
    throw err
  }
  return data
}

async function firstAvailable(paths, options) {
  let lastError
  for (const path of paths) {
    try { return await request(path, options) }
    catch (err) {
      lastError = err
      if (![404, 405].includes(err.status)) throw err
    }
  }
  throw lastError || new Error('No compatible endpoint found')
}

export const api = {
  health: () => firstAvailable(['/api/health', '/health']),

  recommend: (profile) => request('/api/recommend', {
    method: 'POST',
    body: JSON.stringify(profile),
  }),

  switchRecommendation: (payload) => request('/api/recommend/switch', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  async register({ profile, recommendation, form, referralCode }) {
    const canonical = {
      user_id: recommendation?.user_id,
      recommendation_id: recommendation?.id,
      project_id: recommendation?.project_id,
      full_name: form.full_name,
      email: form.email,
      whatsapp: form.whatsapp,
      college: form.college,
      year_of_study: profile.year_of_study,
      branch: profile.branch,
      referral_code: referralCode || null,
      referred_by_code: referralCode || null,
    }

    try {
      return await request('/api/register', {
        method: 'POST',
        body: JSON.stringify(canonical),
      })
    } catch (err) {
      // Compatibility retry only for schema-validation errors. This lets the UI
      // work with either the Phase-2 canonical schema or a common alternate naming.
      if (err.status !== 422) throw err
      const alternate = {
        name: form.full_name,
        email: form.email,
        phone: form.whatsapp,
        whatsapp: form.whatsapp,
        college: form.college,
        year: profile.year_of_study,
        branch: profile.branch,
        user_id: recommendation?.user_id,
        project_id: recommendation?.project_id,
        recommendation_id: recommendation?.id,
        referral_code: referralCode || null,
      }
      return request('/api/register', {
        method: 'POST',
        body: JSON.stringify(alternate),
      })
    }
  },

  referralStats: (code) => firstAvailable([
    `/api/referral/${encodeURIComponent(code)}/stats`,
    `/api/referrals/${encodeURIComponent(code)}/stats`,
    `/api/referral/stats?code=${encodeURIComponent(code)}`,
  ]),

  referralInfo: (code) => firstAvailable([
    `/api/referral/${encodeURIComponent(code)}`,
    `/api/referrals/${encodeURIComponent(code)}`,
  ]),

  analyticsOverview: (simulation = true) => firstAvailable([
    `/api/analytics/overview?simulation=${simulation}`,
    `/api/analytics/overview?is_simulation=${simulation}`,
    '/api/analytics/overview',
  ]),
  analyticsFunnel: (simulation = true) => firstAvailable([
    `/api/analytics/funnel?simulation=${simulation}`,
    `/api/analytics/funnel?is_simulation=${simulation}`,
    '/api/analytics/funnel',
  ]),
  analyticsSources: (simulation = true) => firstAvailable([
    `/api/analytics/sources?simulation=${simulation}`,
    `/api/analytics/sources?is_simulation=${simulation}`,
    '/api/analytics/sources',
  ]),
  analyticsReferrals: (simulation = true) => firstAvailable([
    `/api/analytics/referrals?simulation=${simulation}`,
    `/api/analytics/referrals?is_simulation=${simulation}`,
    '/api/analytics/referrals',
  ]),
  analyticsExperiments: (simulation = true) => firstAvailable([
    `/api/analytics/experiments?simulation=${simulation}`,
    `/api/analytics/experiments?is_simulation=${simulation}`,
    '/api/analytics/experiments',
  ]),
}
