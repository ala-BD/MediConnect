import api from './api';

export const publicService = {
  getCabinets: async () => {
    const response = await api.get('/public/cabinets');
    return response.data;
  },

  getCabinet: async (cabinetId) => {
    const response = await api.get(`/public/cabinet/${cabinetId}`);
    return response.data;
  },

  getAvailableSlots: async (cabinetId, date) => {
    const response = await api.get(`/public/cabinet/${cabinetId}/slots`, {
      params: { date },
    });
    return response.data;
  },

  createAppointment: async (data) => {
    const response = await api.post('/public/appointment', data);
    return response.data;
  },
};

