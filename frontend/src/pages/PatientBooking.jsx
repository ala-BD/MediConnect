import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle, FileText, ArrowLeft, Home, Stethoscope, MapPin } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { publicService } from '../services/publicService';

const PatientBooking = () => {
  const navigate = useNavigate();
  const { cabinetId } = useParams();
  
  const [selectedCabinetId, setSelectedCabinetId] = useState(cabinetId || null);
  const [cabinet, setCabinet] = useState(null);
  const [loadingCabinet, setLoadingCabinet] = useState(false);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    motif: '',
    date: '',
    heure: '',
    cabinetId: selectedCabinetId
  });

  const nextDays = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i + 1));

  useEffect(() => {
    if (formData.date && step === 3) {
      loadAvailableSlots();
    }
  }, [formData.date, step]);

  useEffect(() => {
    if (!selectedCabinetId) {
      // Rediriger vers la page de sélection de médecin
      navigate('/choisir-medecin');
      return;
    }
    loadCabinet();
  }, [selectedCabinetId]);

  const loadCabinet = async () => {
    if (!selectedCabinetId) return;
    setLoadingCabinet(true);
    try {
      const data = await publicService.getCabinet(selectedCabinetId);
      setCabinet(data);
    } catch (error) {
      console.error('Erreur lors du chargement du cabinet:', error);
      alert('Cabinet non trouvé. Redirection vers la sélection...');
      navigate('/choisir-medecin');
    } finally {
      setLoadingCabinet(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedCabinetId) {
      setAvailableSlots([]);
      return;
    }
    try {
      const slots = await publicService.getAvailableSlots(selectedCabinetId, formData.date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
      setAvailableSlots([]);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 2 && !formData.date) return;
    if (step < 3) setStep(step + 1);
  };

  const handleBook = async () => {
    setLoading(true);
    try {
      await publicService.createAppointment(formData);
      setStep(4);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la prise de rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCabinet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!cabinet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/choisir-medecin')}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Changer de médecin</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
        
        {/* Info Cabinet */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{cabinet.nom}</h2>
              {cabinet.userId && (
                <p className="text-gray-600 mb-2">Dr. {cabinet.userId.nom} {cabinet.userId.prenom}</p>
              )}
              {cabinet.specialite && (
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-2">
                  {cabinet.specialite}
                </span>
              )}
              {cabinet.adresse && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{cabinet.adresse}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Prendre un rendez-vous</h1>
          <p className="text-lg text-gray-600">Réservez votre consultation en quelques clics</p>
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`h-1 w-12 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="p-8">
          {step === 1 && (
             <form onSubmit={handleNext} className="space-y-5">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Vos informations</h2>
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-0 pl-3 h-10 w-8 text-gray-400" />
                    <input 
                      type="text" required 
                      className="pl-10 input-field" placeholder="Ex: Dupont"
                      value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-0 pl-3 h-10 w-8 text-gray-400" />
                    <input 
                      type="text" required 
                      className="pl-10 input-field" placeholder="Ex: Jean"
                      value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute inset-y-0 left-0 pl-3 h-10 w-8 text-gray-400" />
                    <input 
                      type="tel" required 
                      className="pl-10 input-field" placeholder="Ex: 06 12 34 56 78"
                      value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    />
                  </div>
               </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optionnel)</label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-0 pl-3 h-10 w-8 text-gray-400" />
                    <input 
                      type="email" 
                      className="pl-10 input-field" placeholder="Ex: jean.dupont@email.com"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
               </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
                   <div className="relative">
                     <CalendarIcon className="absolute inset-y-0 left-0 pl-3 h-10 w-8 text-gray-400" />
                     <input 
                       type="date" required 
                       className="pl-10 input-field"
                       value={formData.dateNaissance} onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                     />
                   </div>
                </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motif de consultation (Optionnel)</label>
                  <div className="relative">
                    <FileText className="absolute inset-y-0 left-0 pl-3 h-10 w-8 text-gray-400" />
                    <input 
                      type="text" 
                      className="pl-10 input-field" placeholder="Ex: Renouvellement"
                      value={formData.motif} onChange={(e) => setFormData({...formData, motif: e.target.value})}
                    />
                  </div>
               </div>

               <button type="submit" className="w-full btn-primary mt-6 py-3">
                 Continuer vers le planning
               </button>
             </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Choisissez une date</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {nextDays.map((date, i) => (
                  <button
                    key={i}
                    onClick={() => { setFormData({...formData, date: date.toISOString()}); handleNext({preventDefault: () => {}}); }}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.date === date.toISOString() ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-xs text-gray-500 uppercase">{format(date, 'EEEE', { locale: fr })}</div>
                    <div className="font-bold text-gray-900">{format(date, 'd MMM', { locale: fr })}</div>
                  </button>
                ))}
              </div>

              <button onClick={() => setStep(1)} className="w-full btn-secondary mt-4">Retour</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
               <h2 className="text-xl font-bold text-gray-800">Choisissez votre horaire</h2>
               <p className="text-sm text-gray-500">Pour le {formData.date ? format(new Date(formData.date), 'EEEE d MMMM', { locale: fr }) : ''}</p>
               
               {availableSlots.length === 0 ? (
                 <p className="text-sm text-gray-500 text-center py-4">
                   Aucun créneau disponible pour cette date. Veuillez choisir une autre date.
                 </p>
               ) : (
                 <div className="grid grid-cols-3 gap-3">
                   {availableSlots.map((slot) => (
                     <button
                       key={slot}
                       type="button"
                       onClick={() => setFormData({...formData, heure: slot})}
                       className={`py-2 rounded-md font-medium transition-all ${
                         formData.heure === slot ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                       }`}
                     >
                       {slot}
                     </button>
                   ))}
                 </div>
               )}

               <div className="flex gap-3 mt-8">
                 <button type="button" onClick={() => setStep(2)} className="flex-1 btn-secondary" disabled={loading}>Retour</button>
                 <button 
                   type="button"
                   onClick={handleBook} 
                   disabled={!formData.heure || loading || availableSlots.length === 0} 
                   className={`flex-1 ${formData.heure && !loading && availableSlots.length > 0 ? 'btn-primary' : 'bg-gray-300 text-white px-4 py-2 rounded-lg cursor-not-allowed'}`}
                 >
                   {loading ? 'Enregistrement...' : 'Confirmer'}
                 </button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4 py-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Rendez-vous Confirmé !</h2>
              <p className="text-gray-600">
                Vous recevrez un SMS de confirmation au <b>{formData.telephone}</b>.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-left mt-6">
                <p className="font-medium text-gray-900">Votre RDV :</p>
                <div className="flex items-center mt-2 text-gray-600"><CalendarIcon className="w-4 h-4 mr-2" /> {formData.date ? format(new Date(formData.date), 'dd/MM/yyyy') : ''}</div>
                <div className="flex items-center mt-1 text-gray-600"><Clock className="w-4 h-4 mr-2" /> {formData.heure}</div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => window.location.reload()} className="flex-1 btn-secondary">Nouveau rendez-vous</button>
                <button onClick={() => navigate('/')} className="flex-1 btn-primary">Retour à l'accueil</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientBooking;
