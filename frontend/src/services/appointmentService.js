import api from './api';

export const appointmentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  getStats: async (periode = 'jour') => {
    const response = await api.get('/appointments/stats', { params: { periode } });
    return response.data;
  },
};

