import { useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup, getMe, UserInfo } from '@/services/api';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    loading: !!localStorage.getItem('token'),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((user) => {
          setState({ isAuthenticated: true, user, loading: false });
        })
        .catch(() => {
          localStorage.removeItem('token');
          setState({ isAuthenticated: false, user: null, loading: false });
        });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('token', res.access_token);
    const user = await getMe();
    setState({ isAuthenticated: true, user, loading: false });
    return user;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const res = await apiSignup(email, password);
    localStorage.setItem('token', res.access_token);
    const user = await getMe();
    setState({ isAuthenticated: true, user, loading: false });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setState({ isAuthenticated: false, user: null, loading: false });
  }, []);

  return { ...state, login, signup, logout };
}
