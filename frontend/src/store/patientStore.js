import { create } from 'zustand';
import { patientService } from '../services/patientService';

const usePatientStore = create((set) => ({
  patients: [],
  selectedPatient: null,
  patientHistory: [],
  loading: false,
  error: null,

  fetchPatients: async (search = '') => {
    set({ loading: true, error: null });
    try {
      const data = await patientService.getAll(search);
      set({ patients: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors du chargement', loading: false });
      throw error;
    }
  },

  fetchPatient: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await patientService.getById(id);
      set({ selectedPatient: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors du chargement', loading: false });
      throw error;
    }
  },

  fetchPatientHistory: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await patientService.getHistory(id);
      set({ patientHistory: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors du chargement', loading: false });
      throw error;
    }
  },

  createPatient: async (data) => {
    set({ loading: true, error: null });
    try {
      const patient = await patientService.create(data);
      set((state) => ({
        patients: [...state.patients, patient],
        loading: false,
      }));
      return patient;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors de la création', loading: false });
      throw error;
    }
  },

  updatePatient: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const patient = await patientService.update(id, data);
      set((state) => ({
        patients: state.patients.map((p) => (p._id === id ? patient : p)),
        selectedPatient: state.selectedPatient?._id === id ? patient : state.selectedPatient,
        loading: false,
      }));
      return patient;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors de la modification', loading: false });
      throw error;
    }
  },

  deletePatient: async (id) => {
    set({ loading: true, error: null });
    try {
      await patientService.delete(id);
      set((state) => ({
        patients: state.patients.filter((p) => p._id !== id),
        selectedPatient: state.selectedPatient?._id === id ? null : state.selectedPatient,
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erreur lors de la suppression', loading: false });
      throw error;
    }
  },
}));

export default usePatientStore;

