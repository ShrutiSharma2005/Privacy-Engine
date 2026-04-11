/**
 * localStore.js — All sensitive personalization data stays in localStorage.
 *
 * PRIVACY CONTRACT:
 *  - interests, clicks, sensitivity → browser only, never leaves device
 *  - Only anonymous category strings are shared with the backend (via api.js)
 */

const INTERESTS_KEY  = 'pwa_interests';
const CLICKS_KEY     = 'pwa_clicks';
const SENSITIVITY_KEY = 'pwa_sensitivity';
const ANALYTICS_KEY  = 'pwa_analytics';

export const localStore = {
  // ── Interests ────────────────────────────────────────────────────────────
  getInterests: () => {
    try { return JSON.parse(localStorage.getItem(INTERESTS_KEY)) || []; }
    catch { return []; }
  },

  addInterest: (interest) => {
    const interests = localStore.getInterests();
    if (!interests.includes(interest)) {
      const updated = [interest, ...interests].slice(0, 50);
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(updated));
      return updated;
    }
    return interests;
  },

  removeInterest: (interest) => {
    const updated = localStore.getInterests().filter(i => i !== interest);
    localStorage.setItem(INTERESTS_KEY, JSON.stringify(updated));
    return updated;
  },

  clearInterests: () => {
    localStorage.removeItem(INTERESTS_KEY);
    localStorage.removeItem(CLICKS_KEY);
    localStorage.removeItem(ANALYTICS_KEY);
    return [];
  },

  // ── Click Counts per category ─────────────────────────────────────────────
  getClicks: () => {
    try { return JSON.parse(localStorage.getItem(CLICKS_KEY)) || {}; }
    catch { return {}; }
  },

  incrementClick: (category) => {
    const clicks = localStore.getClicks();
    clicks[category] = (clicks[category] || 0) + 1;
    localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
    return clicks;
  },

  // ── Sensitivity ───────────────────────────────────────────────────────────
  getSensitivity: () => {
    const val = localStorage.getItem(SENSITIVITY_KEY);
    return val ? parseInt(val, 10) : 50;
  },

  setSensitivity: (value) => {
    localStorage.setItem(SENSITIVITY_KEY, value.toString());
  },

  // ── Analytics (local engagement log) ─────────────────────────────────────
  getAnalytics: () => {
    try { return JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {}; }
    catch { return {}; }
  },

  recordAnalytics: (category) => {
    const analytics = localStore.getAnalytics();
    analytics[category] = (analytics[category] || 0) + 1;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    return analytics;
  },

  // ── Export / Import ───────────────────────────────────────────────────────
  exportProfile: () => {
    return JSON.stringify({
      interests:   localStore.getInterests(),
      clicks:      localStore.getClicks(),
      sensitivity: localStore.getSensitivity(),
      analytics:   localStore.getAnalytics(),
      exportedAt:  new Date().toISOString(),
    }, null, 2);
  },

  importProfile: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.interests)          localStorage.setItem(INTERESTS_KEY,   JSON.stringify(data.interests));
      if (data.clicks)             localStorage.setItem(CLICKS_KEY,      JSON.stringify(data.clicks));
      if (data.sensitivity != null) localStorage.setItem(SENSITIVITY_KEY, data.sensitivity.toString());
      if (data.analytics)          localStorage.setItem(ANALYTICS_KEY,   JSON.stringify(data.analytics));
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },
};
