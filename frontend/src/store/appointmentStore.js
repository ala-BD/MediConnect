import { create } from 'zustand';
import { appointmentService } from '../services/appointmentService';

const useAppointmentStore = create((set) => ({
  appointments: [],
  stats: null,
  loading: false,
  error: null,

  fetchAppointments: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await appointmentService.getAll(params);
      set({ appointments: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors du chargement', loading: false });
      throw error;
    }
  },

  fetchStats: async (periode = 'jour') => {
    set({ loading: true });
    try {
      const data = await appointmentService.getStats(periode);
      set({ stats: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors du chargement', loading: false });
      throw error;
    }
  },

  createAppointment: async (data) => {
    set({ loading: true, error: null });
    try {
      const appointment = await appointmentService.create(data);
      set((state) => ({
        appointments: [...state.appointments, appointment],
        loading: false,
      }));
      return appointment;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors de la création', loading: false });
      throw error;
    }
  },

  updateAppointment: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const appointment = await appointmentService.update(id, data);
      set((state) => ({
        appointments: state.appointments.map((a) => (a._id === id ? appointment : a)),
        loading: false,
      }));
      return appointment;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors de la modification', loading: false });
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.delete(id);
      set((state) => ({
        appointments: state.appointments.filter((a) => a._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors de la suppression', loading: false });
      throw error;
    }
  },
}));

export default useAppointmentStore;

