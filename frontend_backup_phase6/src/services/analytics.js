/**
 * Central Client Analytics, Telemetry & Attribution Service
 */

// Persistent anonymous and session IDs
export function getAnonymousId() {
  let anonId = localStorage.getItem('nxtwave_anon_id');
  if (!anonId) {
    anonId = 'anon_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('nxtwave_anon_id', anonId);
  }
  return anonId;
}

export function getSessionId() {
  let sessionId = localStorage.getItem('nxtwave_session_id');
  if (!sessionId) {
    sessionId = 'ses_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('nxtwave_session_id', sessionId);
  }
  return sessionId;
}

// UTM Persistence Across Entire Browser Journey
export function initCampaignAttribution() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');

    if (utmSource || utmCampaign) {
      const attribution = {
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        utm_content: utmContent || null,
        captured_at: new Date().toISOString()
      };
      // Persist original source (First Touch Policy)
      if (!localStorage.getItem('nxtwave_utm_params')) {
        localStorage.setItem('nxtwave_utm_params', JSON.stringify(attribution));
      }
    }
  } catch (err) {
    console.warn('Error capturing UTM params:', err);
  }
}

export function getStoredAttribution() {
  try {
    const raw = localStorage.getItem('nxtwave_utm_params');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Central Event Ingestion
export async function trackEvent(eventName, metadata = {}, extraParams = {}) {
  const sessionId = getSessionId();
  const anonId = getAnonymousId();
  const utm = getStoredAttribution();
  const referralCode = localStorage.getItem('nxtwave_referred_by') || null;

  const payload = {
    session_id: sessionId,
    anonymous_id: anonId,
    user_id: extraParams.user_id || localStorage.getItem('nxtwave_user_id') || null,
    event_name: eventName,
    utm_source: extraParams.utm_source || utm.utm_source || null,
    utm_medium: extraParams.utm_medium || utm.utm_medium || null,
    utm_campaign: extraParams.utm_campaign || utm.utm_campaign || null,
    utm_content: extraParams.utm_content || utm.utm_content || null,
    referral_code: extraParams.referral_code || referralCode,
    experiment_id: extraParams.experiment_id || null,
    variant: extraParams.variant || null,
    referrer_url: document.referrer || null,
    metadata: metadata || null,
    is_simulation: false
  };

  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // Non-blocking telemetry
    console.debug('Telemetry ingestion error:', err);
  }
}

// Lifecycle Telemetry Convenience Methods
export function trackPageView(pageTitle = 'Home') {
  trackEvent('page_view', { title: pageTitle, url: window.location.pathname });
}

export function trackQuizStarted() {
  trackEvent('quiz_started', { started_at: new Date().toISOString() });
}

export function trackQuizQuestionViewed(questionIdx, totalQuestions) {
  trackEvent('quiz_question_viewed', { step: questionIdx + 1, total: totalQuestions });
}

export function trackQuizQuestionCompleted(questionIdx, answer) {
  trackEvent('quiz_question_completed', { step: questionIdx + 1, selected_answer: answer });
}

export function trackQuizCompleted(answers) {
  trackEvent('quiz_completed', answers);
}

export function trackProjectViewed(project) {
  trackEvent('project_viewed', {
    project_id: project.project_id || project.id,
    project_title: project.project_title || project.name,
    category: project.category
  });
}

export function trackProjectSwitched(targetId) {
  trackEvent('project_switched', { target_project_id: targetId });
}

export function trackRegistrationStarted(projectTitle) {
  trackEvent('registration_started', { project_title: projectTitle });
}

export function trackRegistrationCompleted(regData) {
  if (regData.user_id) {
    localStorage.setItem('nxtwave_user_id', regData.user_id);
  }
  trackEvent('registration_completed', {
    full_name: regData.full_name,
    referral_code: regData.referral_code,
    college: regData.college_name
  }, { referral_code: regData.referral_code, user_id: regData.user_id });
}

export function trackReferralLinkCopied(code) {
  trackEvent('referral_link_copied', { referral_code: code }, { referral_code: code });
}

export function trackWhatsAppShareClicked(code) {
  trackEvent('whatsapp_share_clicked', { referral_code: code }, { referral_code: code });
}

export function trackProjectCardDownloaded(code) {
  trackEvent('project_card_downloaded', { referral_code: code }, { referral_code: code });
}

// ==========================================
// Phase 4 Analytics Dashboard API Fetchers
// ==========================================

export async function fetchOverview(isSimulation = false, days = null) {
  const params = new URLSearchParams({ is_simulation: isSimulation });
  if (days) params.append('days', days);
  const res = await fetch(`/api/analytics/overview?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch overview metrics');
  return await res.json();
}

export async function fetchFunnel(isSimulation = false, days = null) {
  const params = new URLSearchParams({ is_simulation: isSimulation });
  if (days) params.append('days', days);
  const res = await fetch(`/api/analytics/funnel?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch funnel metrics');
  return await res.json();
}

export async function fetchSources(isSimulation = false) {
  const res = await fetch(`/api/analytics/sources?is_simulation=${isSimulation}`);
  if (!res.ok) throw new Error('Failed to fetch source metrics');
  return await res.json();
}

export async function fetchSegments(isSimulation = false) {
  const res = await fetch(`/api/analytics/segments?is_simulation=${isSimulation}`);
  if (!res.ok) throw new Error('Failed to fetch segment metrics');
  return await res.json();
}

export async function fetchProjects(isSimulation = false) {
  const res = await fetch(`/api/analytics/projects?is_simulation=${isSimulation}`);
  if (!res.ok) throw new Error('Failed to fetch project metrics');
  return await res.json();
}

export async function fetchReferrals(isSimulation = false) {
  const res = await fetch(`/api/analytics/referrals?is_simulation=${isSimulation}`);
  if (!res.ok) throw new Error('Failed to fetch referral metrics');
  return await res.json();
}

export async function fetchExperimentsReport(isSimulation = false) {
  const res = await fetch(`/api/analytics/experiments?is_simulation=${isSimulation}`);
  if (!res.ok) throw new Error('Failed to fetch experiment metrics');
  return await res.json();
}

export async function fetchGrowthInsights(isSimulation = false) {
  const res = await fetch(`/api/analytics/insights?is_simulation=${isSimulation}`);
  if (!res.ok) throw new Error('Failed to fetch growth insights');
  return await res.json();
}

export async function askGrowthAssistant(question, isSimulation = false) {
  const res = await fetch('/api/analytics/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, is_simulation: isSimulation })
  });
  if (!res.ok) throw new Error('Failed to query growth assistant');
  return await res.json();
}

export async function seedDemoScenario() {
  const res = await fetch('/api/analytics/seed-demo', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed simulated campaign');
  return await res.json();
}

export async function resetDemoScenario() {
  const res = await fetch('/api/analytics/reset-demo', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset simulated campaign');
  return await res.json();
}

// CSV Export Generator
export function exportMetricsAsCSV(filename = 'nxtwave_growth_report.csv', data = {}) {
  const { overview, funnel, sources, segments, experiments } = data;
  let csv = '=== NXTWAVE GROWTH & FUNNEL REPORT ===\n\n';

  csv += `Data Mode,${overview?.data_label || 'Report'}\n`;
  csv += `Generated At,${new Date().toISOString()}\n\n`;

  // 1. KPIs
  csv += '--- KPI SCORECARDS ---\n';
  csv += 'Metric,Value\n';
  csv += `Total Visitors,${overview?.total_visitors || 0}\n`;
  csv += `Total Registrations,${overview?.total_registrations || 0}\n`;
  csv += `Registration Conversion Rate,${overview?.registration_conversion_pct || 0}%\n`;
  csv += `Referred Registrations,${overview?.total_referred_registrations || 0}\n`;
  csv += `Referral Conversion Rate,${overview?.referral_conversion_pct || 0}%\n`;
  csv += `Viral Coefficient (K),${overview?.viral_coefficient || 0}\n`;
  csv += `Goal Progress (Target 500),${overview?.goal_completion_pct || 0}%\n\n`;

  // 2. Funnel
  if (funnel?.stages) {
    csv += '--- CANONICAL GROWTH FUNNEL ---\n';
    csv += 'Stage,Count,Conversion From Previous %,Conversion From Top %,Drop-Off Count,Drop-Off %\n';
    funnel.stages.forEach(s => {
      csv += `"${s.stage_name}",${s.count},${s.conversion_from_previous}%,${s.conversion_from_top}%,${s.drop_off_count},${s.drop_off_pct}%\n`;
    });
    csv += `Biggest Bottleneck,"${funnel.drop_off_analysis?.biggest_drop_off_stage}",Drop: ${funnel.drop_off_analysis?.drop_off_count} (${funnel.drop_off_analysis?.drop_off_pct}%)\n\n`;
  }

  // 3. Channels & Budget
  if (sources?.sources) {
    csv += '--- ACQUISITION CHANNELS & BUDGET EFFICIENCY ---\n';
    csv += 'Source,Visitors,Registrations,Conversion %,Planned Spend (INR),Actual Spend (INR),Cost Per Reg (INR),Quality Category\n';
    sources.sources.forEach(src => {
      csv += `"${src.source}",${src.visitors},${src.registrations},${src.conversion_rate}%,${src.planned_spend},${src.actual_spend},${src.cost_per_registration},"${src.quality_category}"\n`;
    });
    csv += `Total Spend (INR),${sources.total_spent},Total Budget (INR),${sources.total_campaign_budget}\n\n`;
  }

  // 4. Experiments
  if (experiments?.experiments) {
    csv += '--- A/B GROWTH EXPERIMENTS ---\n';
    csv += 'Experiment,Variant,Exposures,Conversions,Conversion %,Leader,Signal Confidence\n';
    experiments.experiments.forEach(exp => {
      exp.variants.forEach(v => {
        csv += `"${exp.name}","${v.label}",${v.exposures},${v.conversions},${v.conversion_rate}%,"${exp.leader_variant || 'None'}","${exp.signal_confidence}"\n`;
      });
    });
    csv += '\n';
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
