import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (limit?: number, offset?: number) => {
    const response = await api.get('/admin/users', { params: { limit, offset } });
    return response.data;
  },

  updateUser: async (id: number, data: { role?: string; is_active?: boolean }) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getRemedies: async (params?: { limit?: number; offset?: number; status?: string }) => {
    const response = await api.get('/admin/remedies', { params });
    return response.data;
  },

  updateRemedy: async (id: number, data: { status?: string; is_featured?: boolean }) => {
    const response = await api.put(`/admin/remedies/${id}`, data);
    return response.data;
  },

  getSubmissions: async (params?: { limit?: number; offset?: number; status?: string }) => {
    const response = await api.get('/admin/submissions', { params });
    return response.data;
  },
};
