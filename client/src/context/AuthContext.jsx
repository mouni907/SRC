import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, getMeApi, logoutApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('digiclear_token') || null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Rehydrate user on initial load if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('digiclear_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          if (res && res.user) {
            setUser(res.user);
          } else {
            // Invalid token
            localStorage.removeItem('digiclear_token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid');
          localStorage.removeItem('digiclear_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoadingAuth(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('digiclear_token', res.token);
      return res.user;
    }
    throw new Error(res.message || 'Authentication failed');
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('digiclear_token');
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updatedFields };
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!user && !!token,
      loadingAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
