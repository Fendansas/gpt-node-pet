import { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/users/me');
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/users', { name, email, password });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const logoutAll = async () => {
    try {
      await api.post('/users/logout-all');
    } finally {
      logout();
    }
  };

  const updateProfile = async (userData) => {
    const { data } = await api.patch('/users/me', userData);
    setUser(data);
    return data;
  };

  const deactivateAccount = async () => {
    await api.delete('/users/me');
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        logoutAll,
        updateProfile,
        deactivateAccount,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
