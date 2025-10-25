import api from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      username,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  setAuth(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
