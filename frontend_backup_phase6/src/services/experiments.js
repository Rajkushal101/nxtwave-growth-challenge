/**
 * Client Experimentation Service: Deterministic Variant Assignment & Exposure Logging
 */

import { getSessionId, getAnonymousId } from './analytics.js';

// Pre-configured default experiments for zero-latency client rendering
export const EXPERIMENT_CONFIGS = {
  exp_project_cta: {
    id: 'exp_project_cta',
    name: 'Project-Focused CTA Copy',
    variants: [
      { id: 'var_cta_a', name: 'Variant A', label: 'Register Now', button_text: 'Register Now', subtext: 'Free 60-Minute Live Build', weight: 50 },
      { id: 'var_cta_b', name: 'Variant B', label: 'Build My Project', button_text: 'Build My Project', subtext: 'Claim Your Seat & Verified Repo', weight: 50 }
    ]
  },
  exp_hero_headline: {
    id: 'exp_hero_headline',
    name: 'Landing Hero Headline Strategy',
    variants: [
      { 
        id: 'var_head_a', 
        name: 'Variant A (Direct)', 
        label: 'Build Your First AI Project in 60 Minutes',
        part1: 'Build Your First',
        highlight: 'AI Project in 60 Minutes',
        weight: 34 
      },
      { 
        id: 'var_head_b', 
        name: 'Variant B (Curiosity-Driven)', 
        label: 'What AI Project Should You Build?',
        part1: 'What AI Project',
        highlight: 'Should You Build?',
        weight: 33 
      },
      { 
        id: 'var_head_c', 
        name: 'Variant C (Challenge)', 
        label: 'Stop Watching AI Tutorials. Build Something.',
        part1: 'Stop Watching AI Tutorials.',
        highlight: 'Build Something.',
        weight: 33 
      }
    ]
  }
};

/**
 * Simple string hash function returning 0-99
 */
function hashToBucket(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
}

/**
 * Deterministically assigns a variant to the student based on session_id + experiment_id.
 * Variant is persisted in localStorage so user sees identical variant upon page refresh.
 */
export function getAssignedVariant(experimentId) {
  const config = EXPERIMENT_CONFIGS[experimentId];
  if (!config) return null;

  const storageKey = `nxtwave_exp_${experimentId}`;
  let variantId = localStorage.getItem(storageKey);

  if (!variantId) {
    const sessionId = getSessionId();
    const bucket = hashToBucket(`${sessionId}:${experimentId}`);

    let cumulative = 0;
    for (const v of config.variants) {
      cumulative += v.weight;
      if (bucket < cumulative) {
        variantId = v.id;
        break;
      }
    }
    if (!variantId) variantId = config.variants[0].id;
    localStorage.setItem(storageKey, variantId);
  }

  const assigned = config.variants.find(v => v.id === variantId) || config.variants[0];
  return assigned;
}

/**
 * Logs experiment exposure to backend (deduplicated per session)
 */
export async function trackExperimentExposure(experimentId, variantId) {
  const sessionKey = `nxtwave_exp_exposed_${experimentId}_${variantId}`;
  if (sessionStorage.getItem(sessionKey)) return; // already exposed in this browser tab

  sessionStorage.setItem(sessionKey, 'true');

  const payload = {
    experiment_id: experimentId,
    variant_id: variantId,
    session_id: getSessionId(),
    anonymous_id: getAnonymousId(),
    user_id: localStorage.getItem('nxtwave_user_id') || null,
    is_simulation: false
  };

  try {
    await fetch('/api/experiments/exposure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.debug('Exposure tracking non-blocking error:', err);
  }
}
