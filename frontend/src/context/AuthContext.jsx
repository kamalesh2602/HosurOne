import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  loginUser as apiLogin,
  registerUser as apiRegister,
  fetchMe,
} from '../services/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on initialization if token exists
  useEffect(() => {
    let mounted = true;

    async function loadInitialUser() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const userData = await fetchMe(storedToken);
        if (mounted) {
          if (userData) {
            setUser(userData);
            setToken(storedToken);
          } else {
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.warn('Failed restoring user session:', err);
        if (mounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadInitialUser();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiLogin({ email, password });
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password, locality }) => {
    setIsLoading(true);
    try {
      const data = await apiRegister({ name, email, password, locality });
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeStoredToken();
    setUser(null);
    setToken(null);
  }, []);

  // Preset quick-switcher for demo testing
  const quickLoginAs = useCallback(async (role) => {
    const creds = {
      admin: { email: 'admin@hosurone.in', password: 'Admin@HosurOne2026' },
      contributor: { email: 'contributor@hosurone.in', password: 'Contributor@2026' },
      member: { email: 'member@hosurone.in', password: 'Member@HosurOne2026' },
    };
    if (creds[role]) {
      return login(creds[role].email, creds[role].password);
    }
  }, [login]);

  const value = {
    user,
    token,
    isLoading,
    isLoggedIn: !!user,
    isMember: user?.role === 'member' || user?.role === 'verified_contributor' || user?.role === 'admin',
    isVerifiedContributor: user?.role === 'verified_contributor' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    quickLoginAs,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

