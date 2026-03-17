import api from './api';

export const adminService = {
  getMedecins: async (params = {}) => {
    const response = await api.get('/admin/medecins', { params });
    return response.data;
  },

  approveMedecin: async (id, isApproved) => {
    const response = await api.put(`/admin/medecins/${id}/approve`, { isApproved });
    return response.data;
  },

  toggleMedecinStatus: async (id, isActive) => {
    const response = await api.put(`/admin/medecins/${id}/status`, { isActive });
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await api.get('/admin/subscriptions');
    return response.data;
  },

  updateSubscription: async (id, data) => {
    const response = await api.put(`/admin/subscriptions/${id}`, data);
    return response.data;
  },

  getGlobalStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getNotifications: async (params = {}) => {
    const response = await api.get('/admin/notifications', { params });
    return response.data;
  },
};

