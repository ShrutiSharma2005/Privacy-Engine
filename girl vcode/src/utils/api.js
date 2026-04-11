/**
 * api.js — Frontend ↔ Backend bridge
 *
 * PRIVACY RULE: Only anonymous category strings are ever sent.
 * No user ID, no session token, no IP, no PII.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let _isOnline = true;

export const checkOnline = async () => {
  try {
    const res = await fetch(`${BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    _isOnline = res.ok;
  } catch {
    _isOnline = false;
  }
  return _isOnline;
};

export const isOnline = () => _isOnline;

/**
 * Track an anonymous category interaction on the backend.
 * Silently fails when offline — data is not lost, just not synced.
 */
export const trackCategory = async (category) => {
  if (!_isOnline) return null;
  try {
    const res = await fetch(`${BASE_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    _isOnline = false;
    return null;
  }
};

/**
 * Fetch global aggregated analytics from backend.
 * Returns { fitness: 120, tech: 95, ... } or null on failure.
 */
export const fetchGlobalAnalytics = async () => {
  if (!_isOnline) return null;
  try {
    const res = await fetch(`${BASE_URL}/analytics`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    _isOnline = false;
    return null;
  }
};

/**
 * Fetch sorted trending categories from backend.
 */
export const fetchTrending = async (limit = 8) => {
  if (!_isOnline) return null;
  try {
    const res = await fetch(`${BASE_URL}/analytics/trending?limit=${limit}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    _isOnline = false;
    return null;
  }
};
