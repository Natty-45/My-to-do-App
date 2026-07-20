import api from './api';
import type { AuthResponse } from '../types';

const TOKEN_KEY = 'todo_token';
const USER_ID_KEY = 'todo_user_id';

export const login = async (password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signin', { password });
  const { token, userId, authenticated } = response.data;

  if (authenticated && token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/signout');
  } catch {
    // Ignore errors on logout — always clear local state
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;

  try {
    // Decode JWT payload (base64) to check expiry
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (!exp) return false;
    return Date.now() / 1000 < exp;
  } catch {
    return false;
  }
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getUserId = (): string | null => localStorage.getItem(USER_ID_KEY);

export const getSecurityQuestion = async (): Promise<{ question: string }> => {
  const response = await api.get('/auth/security-question');
  return response.data;
};

export const resetPassword = async (answer: string, newPassword: string): Promise<{ message: string }> => {
  const response = await api.post('/auth/reset-password', { answer, newPassword });
  return response.data;
};
