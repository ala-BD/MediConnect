import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Calendar, Users, Bell, Shield, ArrowRight, Check } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Gestion des Rendez-vous',
      description: 'Planifiez, modifiez et suivez tous vos rendez-vous en temps réel avec un calendrier intuitif.'
    },
    {
      icon: Users,
      title: 'Gestion des Patients',
      description: 'Base de données complète de vos patients avec historique des consultations.'
    },
    {
      icon: Bell,
      title: 'Rappels Automatiques',
      description: 'SMS et WhatsApp automatiques 24h et 2h avant chaque rendez-vous.'
    },
    {
      icon: Shield,
      title: 'Sécurisé et Fiable',
      description: 'Vos données sont protégées et sauvegardées en toute sécurité.'
    }
  ];

  const benefits = [
    'Gain de temps considérable',
    'Réduction des absences',
    'Organisation optimale',
    'Interface intuitive',
    'Support client dédié'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50">
      {/* Header Responsive */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:rotate-12 transition-transform">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">MediConnect</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:block text-slate-600 hover:text-primary-600 font-bold text-xs uppercase tracking-widest transition-colors px-4 py-2"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-primary-600 text-white px-5 sm:px-8 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-200 transition-all active:scale-95 shadow-md"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Gérez votre cabinet médical
            <span className="block text-primary-600">en toute simplicité</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La solution complète pour gérer vos rendez-vous, vos patients et votre planning.
            Optimisez votre temps et offrez une meilleure expérience à vos patients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/choisir-medecin')}
              className="btn-secondary text-lg px-8 py-4"
            >
              Prendre un rendez-vous
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Toutes les fonctionnalités dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme complète pour moderniser votre cabinet
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="p-4 bg-primary-100 rounded-lg w-fit mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Pourquoi choisir MediConnect ?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Rejoignez des centaines de professionnels de santé qui font confiance à notre plateforme.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Prêt à commencer ?</h3>
              <p className="text-primary-100 mb-6">
                Créez votre compte en quelques minutes et commencez à gérer votre cabinet efficacement.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-white text-primary-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Créer mon compte
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Commencez dès aujourd'hui
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Pas de carte bancaire requise. Essai gratuit pendant 30 jours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-lg px-8 py-4"
            >
              S'inscrire gratuitement
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-lg px-8 py-4"
            >
              J'ai déjà un compte
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold">MediConnect</span>
              </div>
              <p className="text-gray-400">
                La solution moderne pour gérer votre cabinet médical.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/choisir-medecin')} className="hover:text-white transition-colors">Prendre RDV</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Inscription</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Connexion</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediConnect. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

