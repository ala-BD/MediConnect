import React, { useEffect, useState } from 'react';
import { Save, Clock, Building, Bell, Calendar, Shield, Smartphone, Globe, Info } from 'lucide-react';
import { cabinetService } from '../services/cabinetService';

const Settings = () => {
  const [cabinet, setCabinet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    specialite: '',
    dureeConsultation: 30,
    horaires: [],
    rappelsActives: true,
    rappel24h: true,
    rappel2h: true
  });

  useEffect(() => {
    loadCabinet();
  }, []);

  const loadCabinet = async () => {
    setLoading(true);
    try {
      const data = await cabinetService.getCabinet();
      setCabinet(data);
      setFormData({
        nom: data.nom || '',
        adresse: data.adresse || '',
        telephone: data.telephone || '',
        email: data.email || '',
        specialite: data.specialite || '',
        dureeConsultation: data.dureeConsultation || 30,
        horaires: data.horaires || [],
        rappelsActives: data.rappelsActives !== false,
        rappel24h: data.rappel24h !== false,
        rappel2h: data.rappel2h !== false
      });
    } catch (error) {
      alert('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cabinetService.updateCabinet(formData);
      alert('Paramètres sauvegardés avec succès');
      await loadCabinet();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateHoraire = (index, field, value) => {
    const newHoraires = [...formData.horaires];
    newHoraires[index] = { ...newHoraires[index], [field]: value };
    setFormData({ ...formData, horaires: newHoraires });
  };

  const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuration Cabinet</h1>
          <p className="text-slate-500 mt-1">Personnalisez vos horaires et vos préférences de rappel</p>
        </div>
        <div className="p-3 bg-primary-50 rounded-2xl flex items-center gap-2 text-primary-700 font-bold text-sm">
           <Shield className="w-4 h-4" />
           Sécurité de Niveau Médical
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className="card shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
               <Building className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Identité du Cabinet</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Nom Commercial *</label>
              <input
                type="text" required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Spécialité Principale</label>
              <input
                type="text"
                value={formData.specialite}
                onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                className="input-field"
                placeholder="Ex: Cardiologue, Généraliste..."
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Adresse Complète *</label>
              <input
                type="text" required
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Téléphone de Contact *</label>
              <input
                type="tel" required
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Durée par Consultation (min)</label>
              <div className="relative">
                 <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input
                  type="number" required min="15" step="5"
                  value={formData.dureeConsultation}
                  onChange={(e) => setFormData({ ...formData, dureeConsultation: parseInt(e.target.value) })}
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horaires Professionnels */}
        <div className="card shadow-xl ring-1 ring-slate-100">
           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50 text-emerald-600">
            <div className="p-2 bg-emerald-50 rounded-xl">
               <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Planning d'Ouverture</h2>
          </div>
          
          <div className="space-y-3">
            {joursSemaine.map((jour) => {
              const horaire = formData.horaires.find(h => h.jour === jour) || {
                jour, estOuvert: false, heureDebut: '09:00', heureFin: '18:00'
              };
              const index = formData.horaires.findIndex(h => h.jour === jour);

              return (
                <div key={jour} className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl transition-all border ${horaire.estOuvert ? 'bg-slate-50 border-slate-100' : 'bg-white border-transparent opacity-60'}`}>
                  <div className="w-28">
                    <span className="text-sm font-black text-slate-900 capitalize">{jour}</span>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-200">
                       <input
                        type="checkbox"
                        checked={horaire.estOuvert}
                        onChange={(e) => {
                          if (index >= 0) updateHoraire(index, 'estOuvert', e.target.checked);
                          else setFormData({ ...formData, horaires: [...formData.horaires, { ...horaire, estOuvert: e.target.checked }] });
                        }}
                        className="sr-only peer"
                      />
                      <div className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${horaire.estOuvert ? 'translate-x-5 !bg-primary-600' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{horaire.estOuvert ? 'Ouvert' : 'Fermé'}</span>
                  </label>
                  
                  {horaire.estOuvert && (
                    <div className="flex items-center gap-3 ml-auto animate-fade-in">
                      <input
                        type="time"
                        value={horaire.heureDebut}
                        onChange={(e) => {
                          if (index >= 0) updateHoraire(index, 'heureDebut', e.target.value);
                          else setFormData({ ...formData, horaires: [...formData.horaires, { ...horaire, heureDebut: e.target.value }] });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                      <span className="text-slate-300 font-black">→</span>
                      <input
                        type="time"
                        value={horaire.heureFin}
                        onChange={(e) => {
                          if (index >= 0) updateHoraire(index, 'heureFin', e.target.value);
                          else setFormData({ ...formData, horaires: [...formData.horaires, { ...horaire, heureFin: e.target.value }] });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rappels WhatsApp & SMS */}
        <div className="card shadow-xl ring-1 ring-slate-100 border-l-4 border-l-primary-500">
           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50 text-primary-600">
            <div className="p-2 bg-primary-50 rounded-xl">
               <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Communication Patient (WhatsApp)</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 bg-primary-50/50 rounded-3xl border border-primary-100">
               <div className="pt-1"><Bell className="w-5 h-5 text-primary-600" /></div>
               <div className="flex-1">
                  <p className="font-black text-slate-900 mb-1">Activer les Notifications Automatiques</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Les patients recevront des rappels automatiques sur WhatsApp pour réduire le taux d'absentéisme.</p>
               </div>
               <div className="relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.rappelsActives}
                    onChange={(e) => setFormData({ ...formData, rappelsActives: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.rappelsActives ? 'translate-x-5 !bg-primary-600' : 'translate-x-0'}`}></div>
               </div>
            </div>

            {formData.rappelsActives && (
              <div className="ml-10 space-y-4 animate-fade-in">
                <label className="flex items-center gap-4 group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rappel24h}
                    onChange={(e) => setFormData({ ...formData, rappel24h: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-700 block transition-colors group-hover:text-primary-600">Rappel Stratégique J-1</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Envoyé exactement 24h avant</span>
                  </div>
                </label>
                <label className="flex items-center gap-4 group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rappel2h}
                    onChange={(e) => setFormData({ ...formData, rappel2h: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-700 block transition-colors group-hover:text-primary-600">Flash Reminder H-2</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Dernier rappel 2 heures avant</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Bouton de sauvegarde Flottant/Épinglé */}
        <div className="flex justify-end pt-4 sticky bottom-4 z-30">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary shadow-2xl py-4 px-10 rounded-2xl group flex items-center gap-3"
          >
            {saving ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            )}
            <span className="text-lg">Enregistrer les Modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
