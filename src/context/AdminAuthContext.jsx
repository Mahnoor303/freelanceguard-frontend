import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { adminApi } from '../adminApi';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const fetchAdmin = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminApi('/me');
      setAdmin(data);
    } catch {
      logout();
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAdmin();
  }, [token, fetchAdmin]);

  const login = async (email, password) => {
    const data = await adminApi('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);