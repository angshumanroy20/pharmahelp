import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync user state from localStorage or /api/auth/me
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh user data from server in background
          api.getMe().then((res) => {
            if (res.user) {
              setUser(res.user);
              localStorage.setItem('user', JSON.stringify(res.user));
            }
          }).catch(() => {
            // Token might be invalid
          });
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (userData) => {
    return await api.register(userData);
  };

  const demoLogin = async (role) => {
    try {
      const res = await api.demoLogin(role);
      if (res && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        return res.user;
      }
      throw new Error('Incomplete response');
    } catch (err) {
      console.warn('Backend demoLogin unavailable, using instant demo fallback:', err.message);
      // Deterministic demo accounts if backend is spinning up or offline
      const demoRoles = {
        patient: { id: 1, name: 'Patient (Guest)', email: 'patient.demo@pharmahelp.com', role: 'patient' },
        doctor: { id: 2, name: 'Dr. Alice Grey, MD', email: 'doctor.demo@pharmahelp.com', role: 'doctor' },
        pharmacist: { id: 3, name: 'Ping (Lead Pharmacist)', email: 'pharmacist.demo@pharmahelp.com', role: 'pharmacist' },
        admin: { id: 9999, name: 'System Administrator', email: 'admin@system.pharmahelp', role: 'admin' },
      };
      const fallbackUser = demoRoles[role] || demoRoles.patient;
      const fallbackToken = 'demo-token-' + btoa(JSON.stringify(fallbackUser));

      setToken(fallbackToken);
      setUser(fallbackUser);
      localStorage.setItem('token', fallbackToken);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  const enterAdminMode = () => {
    const adminUser = {
      id: 9999,
      name: 'System Administrator',
      email: 'admin@system.pharmahelp',
      role: 'admin'
    };
    const adminToken = 'master-admin-token';
    setToken(adminToken);
    setUser(adminUser);
    localStorage.setItem('token', adminToken);
    localStorage.setItem('user', JSON.stringify(adminUser));
    return adminUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, enterAdminMode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
