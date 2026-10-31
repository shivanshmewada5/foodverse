import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('foodverse_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Token validation error:", err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { access_token, user: userData } = res.data;
    localStorage.setItem('foodverse_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, fullName) => {
    const res = await authAPI.register(email, password, fullName);
    const { access_token, user: userData } = res.data;
    localStorage.setItem('foodverse_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const demoLogin = async () => {
    const res = await authAPI.demoLogin();
    const { access_token, user: userData } = res.data;
    localStorage.setItem('foodverse_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('foodverse_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await authAPI.updateProfile(profileData);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
