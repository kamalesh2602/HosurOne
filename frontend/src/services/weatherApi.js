/**
 * Weather API Client Service
 * Encapsulates all backend communication for weather telemetry
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch real-time weather telemetry for Hosur from the backend API
 * @param {Object} options
 * @param {boolean} [options.refresh=false] - Force bypass server cache
 * @param {AbortSignal} [options.signal] - Abort controller signal
 * @returns {Promise<Object>} Formatted weather data
 */
export async function fetchHosurWeather({ refresh = false, signal } = {}) {
  const url = new URL(`${API_BASE_URL}/weather`, window.location.origin);
  if (refresh) {
    url.searchParams.set('refresh', 'true');
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMessage = `Weather service request failed with HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorMessage = errJson.error.message;
      }
    } catch {
      // Non-JSON error body fallback
    }
    throw new Error(errorMessage);
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error('Malformed response received from HosurOne weather API.');
  }

  return json.data;
}

/**
 * Check backend health status
 * @param {Object} options
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Object>}
 */
export async function checkApiHealth({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/health`, {
    headers: { 'Accept': 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Health check failed with HTTP ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

export default { fetchHosurWeather, checkApiHealth };

