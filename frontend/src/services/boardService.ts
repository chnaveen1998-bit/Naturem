import api from './api';

export const boardService = {
  getBoards: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  getBoard: async (id: number) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  createBoard: async (data: { name: string; description?: string; is_public?: boolean }) => {
    const response = await api.post('/boards', data);
    return response.data;
  },

  updateBoard: async (id: number, data: { name?: string; description?: string; is_public?: boolean }) => {
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  deleteBoard: async (id: number) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },

  addRemedy: async (boardId: number, remedyId: number) => {
    const response = await api.post(`/boards/${boardId}/remedies/${remedyId}`);
    return response.data;
  },

  removeRemedy: async (boardId: number, remedyId: number) => {
    const response = await api.delete(`/boards/${boardId}/remedies/${remedyId}`);
    return response.data;
  },
};
