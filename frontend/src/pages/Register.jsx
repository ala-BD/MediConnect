import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Mail, Lock, User, Phone, Building, MapPin, FileText, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: 'medecin',

    // Informations du cabinet
    nomCabinet: '',
    adresse: '',
    specialite: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword ||
      !formData.nom || !formData.prenom || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.nomCabinet || !formData.adresse) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    if (!validateStep2()) {
      return;
    }

    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        role: formData.role,
        nomCabinet: formData.nomCabinet,
        adresse: formData.adresse,
        specialite: formData.specialite
      });

      // Afficher le message de succès
      if (response?.message) {
        alert(response.message);
      }

      // Rediriger selon le rôle
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.isApproved) {
        // Si approuvé, aller au dashboard
        navigate('/dashboard');
      } else {
        // Sinon, rester sur la page avec un message
        alert('Votre compte est en attente d\'approbation. Vous recevrez un email une fois approuvé.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-medical-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] -z-10 opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] -z-10 opacity-40"></div>

      <div className="max-w-2xl w-full animate-zoom-in">
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 mb-8 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest leading-none">Retour</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-200">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Rejoindre MediConnect
            </h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
              Compte professionnel • Approbation requise
            </p>
          </div>

          {/* Progress Bar Premium */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= 1 ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-100 text-slate-400'
                  }`}>1</div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 1 ? 'text-primary-600' : 'text-slate-400'}`}>Profil</span>
              </div>
              <div className={`h-1 flex-1 max-w-[60px] rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-100'}`} />
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= 2 ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-100 text-slate-400'
                  }`}>2</div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'text-primary-600' : 'text-slate-400'}`}>Cabinet</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="pl-10 input-field"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nom"
                      required
                      className="pl-10 input-field"
                      placeholder="Dupont"
                      value={formData.nom}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="prenom"
                      required
                      className="pl-10 input-field"
                      placeholder="Jean"
                      value={formData.prenom}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    className="pl-10 input-field"
                    placeholder="06 12 34 56 78"
                    value={formData.telephone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="pl-10 input-field"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="pl-10 input-field"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 btn-secondary"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={loading}
                >
                  Suivant
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cabinet *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nomCabinet"
                    required
                    className="pl-10 input-field"
                    placeholder="Cabinet Médical Dr. Dupont"
                    value={formData.nomCabinet}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="adresse"
                    required
                    className="pl-10 input-field"
                    placeholder="123 Rue de la Santé, 75001 Paris"
                    value={formData.adresse}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="specialite"
                    className="pl-10 input-field"
                    placeholder="Médecine Générale"
                    value={formData.specialite}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                  disabled={loading}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Inscription...' : 'Créer mon compte'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

