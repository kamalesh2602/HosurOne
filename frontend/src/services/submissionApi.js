/**
 * Submission & Community Contribution API Client
 */

import { getStoredToken } from './authApi.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getHeaders(token) {
  const activeToken = token || getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
}

/**
 * Submit a new contribution or suggestion
 */
export async function createSubmission(payload, token) {
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Failed to submit contribution.');
  }

  return json;
}

/**
 * Fetch submissions submitted by currently logged-in user
 */
export async function getMySubmissions(token) {
  const response = await fetch(`${API_BASE_URL}/submissions/mine`, {
    method: 'GET',
    headers: getHeaders(token),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Failed to load your submissions.');
  }

  return json.data || [];
}

/**
 * Update a submission
 */
export async function updateSubmission(id, updates, token) {
  const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Failed to update submission.');
  }

  return json.data;
}

/**
 * Admin: Get all submissions with filters
 */
export async function adminGetSubmissions({ status, category, page = 1, limit = 20 } = {}, token) {
  const url = new URL(`${API_BASE_URL}/admin/submissions`, window.location.origin);
  if (status && status !== 'all') url.searchParams.set('status', status);
  if (category && category !== 'all') url.searchParams.set('category', category);
  if (page) url.searchParams.set('page', page.toString());
  if (limit) url.searchParams.set('limit', limit.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(token),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Failed to fetch admin submissions.');
  }

  return json;
}

/**
 * Admin: Review submission (approve, publish, reject, request_info, unpublish)
 */
export async function adminReviewSubmission(id, { action, reason = '', edits = {} }, token) {
  const response = await fetch(`${API_BASE_URL}/admin/submissions/${id}/review`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ action, reason, edits }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Failed to submit review.');
  }

  return json;
}

/**
 * Admin: Update user verification status
 */
export async function adminUpdateVerification(userId, { isVerified, categories = [] }, token) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/verification`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ isVerified, categories }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Failed to update user verification.');
  }

  return json.data;
}

export default {
  createSubmission,
  getMySubmissions,
  updateSubmission,
  adminGetSubmissions,
  adminReviewSubmission,
  adminUpdateVerification,
};
