import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Save } from 'lucide-react';
import usePatientStore from '../../store/patientStore';

const PatientFormModal = ({ isOpen, onClose, patient = null }) => {
  const { createPatient, updatePatient } = usePatientStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    dateNaissance: '',
    adresse: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (patient) {
        setFormData({
          nom: patient.nom || '',
          prenom: patient.prenom || '',
          telephone: patient.telephone || '',
          email: patient.email || '',
          dateNaissance: patient.dateNaissance ? new Date(patient.dateNaissance).toISOString().split('T')[0] : '',
          adresse: patient.adresse || '',
          notes: patient.notes || ''
        });
      } else {
        setFormData({
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          dateNaissance: '',
          adresse: '',
          notes: ''
        });
      }
    }
  }, [isOpen, patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (patient) {
        await updatePatient(patient._id, formData);
      } else {
        await createPatient(formData);
      }
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative overflow-hidden animate-zoom-in">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
             </div>
             <h2 className="text-xl font-black">{patient ? 'Modifier Patient' : 'Nouveau Patient'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nom *</label>
              <input
                required
                type="text"
                placeholder="Ex: Ben Daoud"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Prénom *</label>
              <input
                required
                type="text"
                placeholder="Ex: Ridha"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Téléphone *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                type="tel"
                placeholder="Ex: 98115865"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date de Naissance *</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                type="date"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email (Optionnel)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                placeholder="patient@email.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {patient ? 'Modifier' : 'Enregistrer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientFormModal;
