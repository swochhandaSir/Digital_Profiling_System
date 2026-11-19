import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(true);
  const load = async () => { try { const { data } = await api.get('/auth/me'); setUser(data.user); } catch { setUser(null); } finally { setLoading(false); } };
  useEffect(() => { load(); const clear = () => setUser(null); window.addEventListener('session-expired', clear); return () => window.removeEventListener('session-expired', clear); }, []);
  const login = async credentials => { const { data } = await api.post('/auth/login', credentials); setUser(data.user); return data.user; };
  const logout = async () => { try { await api.post('/auth/logout'); } finally { setUser(null); } };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
