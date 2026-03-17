import React, { useState, useEffect } from 'react';
import {
  Users, Search, UserPlus, Phone, Mail,
  Calendar, Eye, History, Trash2, Edit2,
  ChevronRight, FileText, X, MoreVertical
} from 'lucide-react';
import usePatientStore from '../store/patientStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PatientFormModal from '../components/patients/PatientFormModal';

const Patients = () => {
  const {
    patients,
    loading,
    fetchPatients,
    deletePatient,
    patientHistory,
    fetchPatientHistory
  } = usePatientStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleHistoryClick = async (patient) => {
    setSelectedPatient(patient);
    try {
      await fetchPatientHistory(patient._id);
      setShowHistory(true);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
    }
  };

  const handleUpdateClick = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await deletePatient(id);
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telephone.includes(searchTerm)
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liste des Patients</h1>
          <p className="text-gray-500">Gérez et suivez les dossiers de vos patients</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors">
            <UserPlus className="w-5 h-5" />
            <span className="hidden md:inline">Nouveau Patient</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl">
                  {patient.nom.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{patient.nom} {patient.prenom}</h3>
                  <p className="text-sm text-gray-500">ID: {patient._id.substring(18)}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {patient.telephone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {patient.email || 'Non renseigné'}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {patient.dateNaissance ? format(new Date(patient.dateNaissance), 'dd MMM yyyy', { locale: fr }) : 'Non renseignée'}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleHistoryClick(patient)}
                  className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <History className="w-4 h-4" />
                  Historique
                </button>
                <button
                  onClick={() => handleUpdateClick(patient)}
                  className="w-14 h-14 bg-primary-50 text-primary-600 font-bold rounded-2xl hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(patient._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Historique (Design Professionnel & Attirant) */}
      {showHistory && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          {/* Overlay avec effet de flou premium */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowHistory(false)}></div>

          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden animate-zoom-in border border-white/20">
            {/* Header Profil Patient */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white relative overflow-hidden">
              {/* Décoration en arrière-plan */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-full -ml-12 -mb-12 blur-lg"></div>

              <div className="flex justify-between items-start relative z-10 mb-6">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl border border-white/20 shadow-lg">
                    {selectedPatient.nom.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">{selectedPatient.nom} {selectedPatient.prenom}</h2>
                    <p className="text-primary-100/80 text-xs font-bold uppercase tracking-widest mt-1">Dossier Médical Informatisé</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all group active:scale-95"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 relative z-10">
                <div className="px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary-200" />
                  <span className="text-xs font-bold">{selectedPatient.telephone}</span>
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary-200" />
                  <span className="text-xs font-bold">
                    {patientHistory.length} Visite{patientHistory.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Corps - Timeline Chronologique */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
              {patientHistory.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 mt-4 shadow-sm">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                  <p className="font-bold text-slate-900">Aucune consultation passée</p>
                  <p className="text-sm text-slate-500 mt-2">Le patient n'a pas encore d'historique de rendez-vous.</p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 ml-2">
                  {patientHistory.map((apt, index) => (
                    <div key={apt._id} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      {/* Indicateur Chronologique */}
                      <div className={`absolute left-0 top-1 w-9 h-9 rounded-2xl border-4 border-white shadow-md flex items-center justify-center z-10 ${apt.statut === 'confirme' ? 'bg-emerald-500' :
                        apt.statut === 'termine' ? 'bg-primary-600' :
                          apt.statut === 'annule' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>

                      <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></span>
                              {format(new Date(apt.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                            </p>
                            <p className="text-2xl font-black text-slate-900 italic tracking-tight">{apt.heure}</p>
                          </div>
                          <div className={`self-start md:self-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-colors ${apt.statut === 'confirme' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:bg-emerald-100' :
                            apt.statut === 'annule' ? 'bg-rose-50 text-rose-700 border-rose-100 group-hover:bg-rose-100' :
                              apt.statut === 'termine' ? 'bg-primary-50 text-primary-700 border-primary-100 group-hover:bg-primary-100' :
                                'bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-amber-100'
                            }`}>
                            {apt.statut}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 space-y-3">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800 leading-snug">{apt.motif || 'Consultation standard'}</p>
                              {apt.notes && (
                                <div className="mt-4 p-4 bg-slate-50/80 rounded-2xl border-l-[6px] border-primary-600/10 text-xs text-slate-600 relative overflow-hidden italic leading-relaxed">
                                  <div className="absolute top-0 right-0 p-2 opacity-5 scale-150"><Eye className="w-10 h-10" /></div>
                                  "{apt.notes}"
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Fin de Dossier */}
            <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Dossier médical numérique • {new Date().getFullYear()}</span>
              <button
                onClick={() => setShowHistory(false)}
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary-600 shadow-lg hover:shadow-primary-600/20 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
              >
                Fermer l'Historique
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Formulaire */}
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPatient(null); }}
        patient={selectedPatient}
      />
    </div>
  );
};

export default Patients;
