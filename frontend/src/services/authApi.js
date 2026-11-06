/**
 * Authentication API Client for HosurOne
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'hosurone_auth_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function removeStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Register a new member
 */
export async function registerUser({ name, email, password, locality }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ name, email, password, locality }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Registration failed.');
  }

  if (json.data?.token) {
    setStoredToken(json.data.token);
  }

  return json.data;
}

/**
 * Login user
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.success) {
    throw new Error(json?.error?.message || json?.message || 'Login failed.');
  }

  if (json.data?.token) {
    setStoredToken(json.data.token);
  }

  return json.data;
}

/**
 * Fetch authenticated profile
 */
export async function fetchMe(token) {
  const activeToken = token || getStoredToken();
  if (!activeToken) return null;

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${activeToken}`,
    },
  });

  if (!response.ok) {
    removeStoredToken();
    return null;
  }

  const json = await response.json();
  return json.data;
}

export default {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  registerUser,
  loginUser,
  fetchMe,
};
