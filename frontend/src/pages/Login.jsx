import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Stethoscope, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [role, setRole] = useState('medecin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-medical-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] -z-10 opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] -z-10 opacity-40"></div>

      <div className="bg-white/80 backdrop-blur-xl px-8 py-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50 animate-zoom-in">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 mb-10 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest leading-none">Retour</span>
        </Link>

        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-200 mb-6 group hover:rotate-12 transition-transform cursor-pointer">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">
            MediConnect
          </h2>
          <p className="text-center font-bold text-slate-400 text-xs uppercase tracking-widest mt-2">
            Espace sécurisé
          </p>
        </div>

        {/* Selecteur de Rôle Premium */}
        <div className="flex p-1.5 bg-slate-100/50 rounded-2xl mb-8 border border-slate-100">
          <button
            onClick={() => setRole('medecin')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === 'medecin' ? 'bg-white shadow-lg text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            Cabinet
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-slate-900 shadow-lg text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
                placeholder="docteur@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-0.5 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
          {role === 'medecin' ? (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Nouveau sur MediConnect ?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-4">
                Créer un compte
              </Link>
            </p>
          ) : (
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest italic">
              Accès restreint à l'équipe technique
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


export default Login;
