/**
 * Public Directory API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchFromEndpoint(endpoint, { search = '', category = '', locality = '', page = 1, limit = 20, signal } = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);

  if (search && search.trim()) url.searchParams.set('search', search.trim());
  if (category && category !== 'all') url.searchParams.set('category', category);
  if (locality && locality !== 'all') url.searchParams.set('locality', locality);
  if (page) url.searchParams.set('page', page.toString());
  if (limit) url.searchParams.set('limit', limit.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || `Failed to fetch from ${endpoint}`);
  }

  return {
    items: json.data || [],
    pagination: json.pagination || { total: json.data?.length || 0, page: 1, limit: 20, totalPages: 1 },
  };
}

export function fetchPlaces(params) {
  return fetchFromEndpoint('/places', params);
}

export function fetchHospitals(params) {
  return fetchFromEndpoint('/hospitals', params);
}

export function fetchAtms(params) {
  return fetchFromEndpoint('/atms', params);
}

export function fetchContacts(params) {
  return fetchFromEndpoint('/contacts', params);
}

export default {
  fetchPlaces,
  fetchHospitals,
  fetchAtms,
  fetchContacts,
};

