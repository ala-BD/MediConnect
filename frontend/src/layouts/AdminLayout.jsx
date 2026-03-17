import { Outlet, Link, useLocation } from 'react-router-dom';
import { Database, ShieldAlert, Users, LayoutDashboard, LogOut, Terminal, Cpu, Globe } from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Console Centrale', href: '/admin', icon: LayoutDashboard },
  { name: 'Réseau Médecins', href: '/admin/medecins', icon: Users },
  { name: 'Flux Abonnements', href: '/admin/abonnements', icon: Database },
  { name: 'Sécurité & Logs', href: '/admin/notifications', icon: ShieldAlert },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Admin (thème Ultra-Foncé Premium) */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 hidden lg:flex lg:flex-col fixed inset-y-0 shadow-2xl z-30">
        <div className="flex-1 flex flex-col pt-10 pb-4 overflow-y-auto">
          <div className="flex items-center gap-3 px-8 mb-12">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <ShieldAlert className="text-white w-6 h-6" />
            </div>
            <div>
               <span className="text-xl font-black text-white tracking-widest block leading-none">CORE</span>
               <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Enterprise</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <p className="px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6">Système de contrôle</p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                    'group flex items-center px-6 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300'
                  )}
                >
                  <item.icon
                    className={clsx(
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300',
                      'mr-4 h-5 w-5 transition-colors'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 mt-auto mb-6">
             <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-500/10 rounded-lg"><Cpu className="w-4 h-4 text-indigo-400" /></div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Status Système</p>
                      <p className="text-xs font-bold text-emerald-400">Opérationnel</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg"><Globe className="w-4 h-4 text-blue-400" /></div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Région</p>
                      <p className="text-xs font-bold text-white">Global / SaaS</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
            <LogOut className="h-5 w-5" />
            <span>Déconnexion Root</span>
          </Link>
        </div>
      </div>

      {/* Main content Admin */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20">
           <div className="flex items-center gap-4 text-slate-500">
              <Terminal className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest">v2.4.0_STABLE</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-xs font-black text-white">ROOT_ADMIN</p>
                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Niveau 10</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-indigo-500/30 flex items-center justify-center font-black text-indigo-400">A</div>
           </div>
        </header>
        <main className="flex-1 p-8">
           <div className="max-w-7xl mx-auto">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
