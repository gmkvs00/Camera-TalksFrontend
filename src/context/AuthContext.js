import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
    }

    // Use stored user immediately (so UI isn't empty), if present
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    // If no token, we can't call /auth/me
    if (!storedToken) {
      setLoading(false);
      return;
    }

    // 🔁 Refresh user from backend to get latest role/permissions
    const fetchMe = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        const freshUser = res.data;

        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch (err) {
        console.error('Failed to fetch /auth/me:', err);
        // optional: you could logout() here on 401
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const { token, user } = res.data;

    setToken(token);
    setUser(user);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasPermission = (perm) => {
    if (!perm) return true;
    if (!user?.role?.permissions) return false;
    return user.role.permissions.includes(perm);
  };

  // when a role is updated, reflect it in current user (if same role)
  const updateUserRole = (updatedRole) => {
    setUser((prev) => {
      if (!prev || !prev.role) return prev;

      const prevRoleId = String(prev.role.id || prev.role._id);
      const updatedRoleId = String(updatedRole._id || updatedRole.id);

      if (prevRoleId !== updatedRoleId) return prev;

      const newUser = {
        ...prev,
        role: {
          ...prev.role,
          ...updatedRole,
          id: updatedRoleId,
        },
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        hasPermission,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
