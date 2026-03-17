import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Ban, UserCheck, UserX, Activity, ShieldCheck, Mail, Calendar, Filter } from 'lucide-react';
import { adminService } from '../services/adminService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminMedecins = () => {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadMedecins();
  }, [filter]);

  const loadMedecins = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.statut = filter;
      if (search) params.search = search;
      const data = await adminService.getMedecins(params);
      setMedecins(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== '') {
        loadMedecins();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleApprove = async (id, isApproved) => {
    try {
      await adminService.approveMedecin(id, isApproved);
      loadMedecins();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await adminService.toggleMedecinStatus(id, isActive);
      loadMedecins();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Réseau des Praticiens</h1>
          <p className="text-slate-500 mt-1">Supervision et contrôle des comptes médecins actifs sur la plateforme</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-400" />
              {medecins.length} Comptes Détectés
           </div>
        </div>
      </div>

      {/* Barre de contrôle et Filtres */}
      <div className="admin-card !p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par identité, email ou cabinet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none text-sm placeholder:text-slate-600"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {['all', 'pending', 'approved', 'active'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all uppercase tracking-widest ${
                 filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {f === 'all' ? 'Tous' : f === 'pending' ? 'Attente' : f === 'approved' ? 'OK' : 'Actifs'}
             </button>
          ))}
        </div>
      </div>

      {/* Liste des praticiens Grid Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 animate-pulse">Synchronisation des données...</div>
        ) : medecins.length === 0 ? (
          <div className="col-span-full py-20 text-center admin-card">
            <UserX className="w-16 h-16 mx-auto mb-4 text-slate-700" />
            <p className="font-bold text-slate-500 tracking-wider uppercase">Aucune entité trouvée dans cette catégorie</p>
          </div>
        ) : (
          medecins.map((medecin, i) => (
            <div 
              key={medecin._id} 
              className="admin-card group hover:scale-[1.01] transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xl shadow-inner">
                      {medecin.nom.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                         {medecin.nom} {medecin.prenom}
                       </h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`h-2 w-2 rounded-full ${medecin.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{medecin.isActive ? 'Opérationnel' : 'Suspendu'}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                      medecin.isApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {medecin.isApproved ? 'ACL: Verifié' : 'ACL: En Attente'}
                    </span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" /> Cabinet Affilié
                    </p>
                    <p className="text-xs font-bold text-slate-300 truncate">{medecin.cabinetId?.nom || 'Non assigné'}</p>
                 </div>
                 <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                       <Calendar className="w-3 h-3" /> Inscription
                    </p>
                    <p className="text-xs font-bold text-slate-300">{format(new Date(medecin.createdAt), 'dd MMM yyyy', { locale: fr })}</p>
                 </div>
                 <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50 col-span-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                       <Mail className="w-3 h-3" /> Contact Système
                    </p>
                    <p className="text-xs font-bold text-indigo-400 truncate">{medecin.email}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/50">
                <div className="flex gap-2">
                   {!medecin.isApproved ? (
                      <button
                        onClick={() => handleApprove(medecin._id, true)}
                        className="btn-primary !py-1 text-[10px] uppercase font-black bg-emerald-600 hover:bg-emerald-500"
                      >
                        Autoriser
                      </button>
                   ) : (
                      <button
                        onClick={() => handleApprove(medecin._id, false)}
                        className="px-3 py-1.5 border border-amber-500/30 text-amber-500 rounded-lg text-[10px] uppercase font-black hover:bg-amber-500/10 transition-colors"
                      >
                        Rétrograder
                      </button>
                   )}
                </div>
                
                <div className="flex gap-2">
                  {medecin.isActive ? (
                    <button
                      onClick={() => handleToggleStatus(medecin._id, false)}
                      className="px-3 py-1.5 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-lg text-[10px] uppercase font-black hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Ban className="w-3 h-3" /> Suspendre
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(medecin._id, true)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] uppercase font-black hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <UserCheck className="w-3 h-3" /> Réactiver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMedecins;
