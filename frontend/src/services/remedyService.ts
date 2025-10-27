import api from './api';
import { Remedy } from '../types';

export const remedyService = {
  getRemedies: async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    category?: string;
  }) => {
    const response = await api.get('/remedies', { params });
    return response.data;
  },

  getRemedy: async (id: number) => {
    const response = await api.get(`/remedies/${id}`);
    return response.data;
  },

  createRemedy: async (data: Partial<Remedy>) => {
    const response = await api.post('/remedies', data);
    return response.data;
  },

  updateRemedy: async (id: number, data: Partial<Remedy>) => {
    const response = await api.put(`/remedies/${id}`, data);
    return response.data;
  },

  deleteRemedy: async (id: number) => {
    const response = await api.delete(`/remedies/${id}`);
    return response.data;
  },

  searchRemedies: async (query: string, limit?: number) => {
    const response = await api.get('/remedies/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  likeRemedy: async (id: number) => {
    const response = await api.post(`/remedies/${id}/like`);
    return response.data;
  },
};
