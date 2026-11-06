/**
 * Government Directory API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch list of verified government offices with search and filtering
 */
export async function fetchGovernmentOffices({
  search = '',
  category = '',
  locality = '',
  page = 1,
  limit = 12,
  signal,
} = {}) {
  const url = new URL(`${API_BASE_URL}/government`, window.location.origin);

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

  if (!response.ok) {
    let errorMessage = `Government directory request failed with HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorMessage = errJson.error.message;
      }
    } catch {
      // Non-JSON fallback
    }
    throw new Error(errorMessage);
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error('Malformed response from government directory API.');
  }

  return {
    offices: json.data || [],
    pagination: json.pagination || {},
    sourceAttribution: json.sourceAttribution,
  };
}

/**
 * Fetch single government office details
 */
export async function fetchGovernmentOfficeById(id, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/government/${encodeURIComponent(id)}`, {
    headers: { 'Accept': 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Office not found (HTTP ${response.status})`);
  }

  const json = await response.json();
  return json.data;
}

export default { fetchGovernmentOffices, fetchGovernmentOfficeById };

