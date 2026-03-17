import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Stethoscope, MapPin, Phone, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { publicService } from '../services/publicService';

const SelectDoctor = () => {
  const navigate = useNavigate();
  const [cabinets, setCabinets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCabinets();
  }, []);

  const loadCabinets = async () => {
    try {
      const data = await publicService.getCabinets();
      setCabinets(data);
    } catch (error) {
      console.error('Erreur lors du chargement des cabinets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCabinets = cabinets.filter(cabinet => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      cabinet.nom?.toLowerCase().includes(searchLower) ||
      cabinet.specialite?.toLowerCase().includes(searchLower) ||
      cabinet.adresse?.toLowerCase().includes(searchLower) ||
      cabinet.userId?.nom?.toLowerCase().includes(searchLower) ||
      cabinet.userId?.prenom?.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectCabinet = (cabinetId) => {
    navigate(`/prendre-rdv/${cabinetId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Choisissez votre médecin
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez un cabinet médical pour prendre rendez-vous
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, spécialité ou adresse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Chargement des cabinets...</p>
          </div>
        ) : filteredCabinets.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              {search ? 'Aucun cabinet trouvé' : 'Aucun cabinet disponible'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-primary-600 hover:text-primary-700"
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCabinets.map((cabinet) => (
              <div
                key={cabinet._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleSelectCabinet(cabinet._id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-primary-600" />
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {cabinet.nom}
                </h3>

                {cabinet.userId && (
                  <p className="text-gray-600 mb-3">
                    Dr. {cabinet.userId.nom} {cabinet.userId.prenom}
                  </p>
                )}

                {cabinet.specialite && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      {cabinet.specialite}
                    </span>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  {cabinet.adresse && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="flex-1">{cabinet.adresse}</span>
                    </div>
                  )}
                  {cabinet.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{cabinet.telephone}</span>
                    </div>
                  )}
                  {cabinet.dureeConsultation && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>Consultation : {cabinet.dureeConsultation} min</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCabinet(cabinet._id);
                  }}
                  className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDoctor;

