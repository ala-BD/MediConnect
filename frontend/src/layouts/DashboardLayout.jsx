import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Settings, LayoutDashboard, LogOut, Stethoscope, Search, Bell, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agenda Planning', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Mes Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Configuration', href: '/dashboard/settings', icon: Settings },
];

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar for Desktop & Mobile Toggle */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-8 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between px-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">MediConnect</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Menu Principal</p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={clsx(
                    isActive
                      ? 'bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                    'group flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300'
                  )}
                >
                  <item.icon
                    className={clsx(
                      isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600',
                      'mr-4 h-5 w-5 transition-colors'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-200 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-xs font-bold opacity-80 uppercase mb-1">Mode Premium</p>
              <p className="text-sm font-black mb-4">Support 24/7 activé</p>
              <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-black hover:bg-white/30 transition-colors uppercase">Aide & Support</button>
            </div>
          </div>

          <div className="p-6 border-t border-slate-50">
            <Link to="/login" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all group">
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span>Se déconnecter</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-50 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="relative w-64 xl:w-96 hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Recherche rapide..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-100 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">Dr. Administrateur</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Compte Vérifié</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden bg-[url('https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff')] bg-cover"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
