import React, { useEffect, useState } from 'react';
import { Users, Calendar, TrendingUp, DollarSign, Activity, Bell, Settings, ArrowUpRight } from 'lucide-react';
import { adminService } from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getGlobalStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Préparer les données du graphique
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  // Générer les 6 derniers mois
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    
    const monthStat = stats?.monthlyStats?.find(s => s._id.month === month && s._id.year === year);
    return {
      label: monthNames[month - 1],
      count: monthStat ? monthStat.count : 0
    };
  });

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  const statsCards = [
    {
      name: 'Médecins actifs',
      value: stats?.totalMedecins || 0,
      icon: Users,
      trend: '+12%',
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20'
    },
    {
      name: 'Total Cabinets',
      value: stats?.totalCabinets || 0,
      icon: Activity,
      trend: '+5%',
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20'
    },
    {
      name: 'RDV ce mois',
      value: stats?.appointmentsThisMonth || 0,
      icon: Calendar,
      trend: '+28%',
      color: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/20'
    },
    {
      name: 'Revenus (Est.)',
      value: `${stats?.revenusMensuels || '0'} €`,
      icon: DollarSign,
      trend: '+15%',
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Console SaaS Admin</h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            Surveillance de la plateforme en temps réel
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cartes de statistiques Premium */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((item, i) => (
          <div 
            key={item.name} 
            className={`admin-card group animate-fade-in`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} ${item.shadow} shadow-lg text-white`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {item.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{item.name}</p>
              <h3 className="mt-1 text-3xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform origin-left duration-300">
                {item.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique Dynamique */}
        <div className="lg:col-span-2 admin-card h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Activité des Rendez-vous
            </h2>
          </div>
          <div className="flex-1 flex items-end gap-3 pb-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 bg-slate-800/50 rounded-t-xl relative group overflow-hidden h-full">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-1000 ease-out"
                  style={{ height: `${(d.count / maxCount) * 100}%`, transitionDelay: `${i * 50}ms` }}
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black bg-white text-slate-900 px-2 py-1 rounded-lg transition-opacity shadow-lg">
                  {d.count} RDV
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] pt-4 border-t border-slate-800">
            {chartData.map(d => <span key={d.label}>{d.label}</span>)}
          </div>
        </div>

        {/* Derniers Abonnés Dynamiques */}
        <div className="admin-card flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">Activité Récente</h2>
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Total rendez-vous</span>
                <span className="text-white font-bold">{stats?.totalAppointments || 0}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((stats?.totalAppointments || 0) / 100 * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Taux de conversion</span>
                <span className="text-white font-bold">{stats?.conversionRate || 0}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stats?.conversionRate || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-slate-800 space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dernières inscriptions</p>
              {stats?.recentCabinets?.length === 0 ? (
                <p className="text-xs text-slate-600 italic">Aucune inscription récente</p>
              ) : (
                stats?.recentCabinets?.map((cabinet, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {cabinet.nom.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">Dr. {cabinet.nom} {cabinet.prenom}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black truncate">{cabinet.nomCabinet}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                      cabinet.plan === 'premium' ? 'bg-amber-400/10 text-amber-500' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {cabinet.plan}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
