import api from './api';

export const cabinetService = {
  getCabinet: async () => {
    const response = await api.get('/cabinet');
    return response.data;
  },

  updateCabinet: async (data) => {
    const response = await api.put('/cabinet', data);
    return response.data;
  },

  blockSlot: async (data) => {
    const response = await api.post('/cabinet/block-slot', data);
    return response.data;
  },

  getAvailableSlots: async (date) => {
    const response = await api.get('/cabinet/slots', { params: { date } });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/cabinet/stats');
    return response.data;
  },
};

