import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useAppointmentStore from '../store/appointmentStore';
import usePatientStore from '../store/patientStore';
import { cabinetService } from '../services/cabinetService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { appointments, stats, fetchAppointments, fetchStats, updateAppointment, loading } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();
  const [cabinetStats, setCabinetStats] = useState(null);
  const [periode, setPeriode] = useState('jour');

  useEffect(() => {
    loadData();
  }, [periode]);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchAppointments({}),
        fetchStats(periode),
        fetchPatients(),
        loadCabinetStats()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const loadCabinetStats = async () => {
    try {
      const data = await cabinetService.getStats();
      setCabinetStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats cabinet:', error);
    }
  };

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date).toDateString();
    const today = new Date().toDateString();
    return aptDate === today && (apt.statut === 'confirme' || apt.statut === 'termine');
  }).sort((a, b) => a.heure.localeCompare(b.heure));

  const pendingRequests = appointments.filter(apt => apt.statut === 'en_attente')
    .sort((a, b) => new Date(a.date) - new Date(b.date) || a.heure.localeCompare(b.heure));

  const statsCards = [
    {
      name: 'Rendez-vous du jour',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Total patients',
      value: patients.length,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Confirmation (Mois)',
      value: stats?.confirmes || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Taux Présence',
      value: cabinetStats && cabinetStats.totalAppointments > 0 ? ((cabinetStats.appointmentsTermines / cabinetStats.totalAppointments) * 100).toFixed(0) + '%' : '0%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const getStatusColor = (statut) => {
    const colors = {
      confirme: 'bg-emerald-100 text-emerald-800',
      annule: 'bg-rose-100 text-rose-800',
      termine: 'bg-blue-100 text-blue-800',
      absent: 'bg-amber-100 text-amber-800',
      en_attente: 'bg-blue-50 text-blue-700'
    };
    return colors[statut] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-10 animate-fade-in">
      {/* Header Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Bonjour, Docteur</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-2">
            {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/calendar')}
          className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase text-xs tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Nouveau RDV
        </button>
      </div>

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      )}

      {/* Cartes de statistiques Grid Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((item, i) => (
          <div key={item.name} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all duration-500 group">
            <div className={`p-4 rounded-2xl ${item.bgColor} w-fit mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Principal Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Liste des demandes en attente */}
        <div className="xl:col-span-12 2xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Nouvelles Demandes</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En attente de confirmation</p>
              </div>
            </div>
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-blue-200">
              {pendingRequests.length}
            </span>
          </div>

          <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-50 overflow-hidden">
            {pendingRequests.length === 0 ? (
              <div className="py-24 text-center">
                <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Tout est à jour !</h3>
                <p className="text-slate-400 font-medium text-sm">Aucune nouvelle demande en ce moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {pendingRequests.slice(0, 5).map((appt) => (
                  <div key={appt._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/80 transition-all rounded-[2rem]">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg border-4 border-white">
                        {appt.patientId?.nom?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg uppercase tracking-tight">
                          {appt.patientId?.nom} {appt.patientId?.prenom}
                        </p>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-1">
                          <span className="p-1 bg-amber-50 rounded-md"><AlertCircle className="w-3 h-3 text-amber-500" /></span>
                          Le {format(new Date(appt.date), 'dd MMMM')} à <span className="text-slate-900 font-black">{appt.heure}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4 sm:mt-0">
                      <button
                        onClick={() => updateAppointment(appt._id, { ...appt, statut: 'confirme' })}
                        className="flex-1 sm:flex-none p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm group"
                        title="Accepter"
                      >
                        <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => updateAppointment(appt._id, { ...appt, statut: 'annule' })}
                        className="flex-1 sm:flex-none p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm group"
                        title="Refuser"
                      >
                        <XCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Agenda du Jour Responsive */}
        <div className="xl:col-span-12 2xl:col-span-5 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Agenda du Jour</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vos consultations confirmées</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-50 min-h-[400px] flex flex-col">
            {todayAppointments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-10 h-10 text-primary-200" />
                </div>
                <p className="text-slate-900 font-black mb-1">Journée calme</p>
                <p className="text-slate-400 text-sm font-medium">Aucun rendez-vous aujourd'hui.</p>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-slate-50 space-y-2">
                {todayAppointments.map((appt) => (
                  <div key={appt._id} className="p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-slate-400">{appt.heure}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1 shadow-lg shadow-primary-200"></div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{appt.patientId?.nom} {appt.patientId?.prenom}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{appt.motif || 'Général'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/dashboard/calendar')}
              className="mt-6 w-full py-4 bg-slate-50 text-slate-900 text-xs font-black rounded-2xl border border-slate-100 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-[0.2em]"
            >
              Agenda Complet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
