/**
 * Bank Branch Finder API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch bank branches with search, bank filter, locality filter, and pagination
 */
export async function fetchBankBranches({
  search = '',
  bank = '',
  locality = '',
  page = 1,
  limit = 15,
  signal,
} = {}) {
  const url = new URL(`${API_BASE_URL}/banks`, window.location.origin);

  if (search && search.trim()) url.searchParams.set('search', search.trim());
  if (bank && bank !== 'all') url.searchParams.set('bank', bank);
  if (locality && locality !== 'all') url.searchParams.set('locality', locality);
  if (page) url.searchParams.set('page', page.toString());
  if (limit) url.searchParams.set('limit', limit.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal,
  });

  if (!response.ok) {
    let errorMessage = `Bank directory request failed with HTTP ${response.status}`;
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
    throw new Error('Malformed response from bank directory API.');
  }

  return {
    branches: json.data || [],
    pagination: json.pagination || {},
    sourceAttribution: json.sourceAttribution,
  };
}

/**
 * Fetch single bank branch details by ID or IFSC
 */
export async function fetchBankBranchById(id, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/banks/${encodeURIComponent(id)}`, {
    headers: { 'Accept': 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Bank branch not found (HTTP ${response.status})`);
  }

  const json = await response.json();
  return json.data;
}

export default { fetchBankBranches, fetchBankBranchById };

