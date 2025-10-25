import api from './api';
import type { Remedy, PaginatedResponse } from '../types';

export const remedyService = {
  async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Remedy>> {
    const response = await api.get<PaginatedResponse<Remedy>>('/api/remedies', {
      params: { page, limit },
    });
    return response.data;
  },

  async getById(id: string): Promise<Remedy> {
    const response = await api.get<Remedy>(`/api/remedies/${id}`);
    return response.data;
  },

  async create(data: Partial<Remedy>): Promise<Remedy> {
    const response = await api.post<Remedy>('/api/remedies', data);
    return response.data;
  },

  async update(id: string, data: Partial<Remedy>): Promise<Remedy> {
    const response = await api.put<Remedy>(`/api/remedies/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/remedies/${id}`);
  },

  async search(query: string, limit = 20): Promise<{ results: Remedy[]; count: number }> {
    const response = await api.get('/api/search', {
      params: { q: query, limit },
    });
    return response.data;
  },
};
