import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await adminService.updateSubscription(id, data);
      loadSubscriptions();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const getPlanPrice = (plan) => {
    const prices = { gratuit: 0, basique: 29.99, premium: 59.99 };
    return prices[plan] || 0;
  };

  const getPlanColor = (plan) => {
    const colors = {
      gratuit: 'bg-gray-100 text-gray-800',
      basique: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gestion des Abonnements</h1>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Chargement...</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Aucun abonnement trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Cabinet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date fin
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {sub.cabinetId?.nom || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPlanColor(sub.plan)}`}>
                        {sub.plan} - {getPlanPrice(sub.plan)}€/mois
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.statut === 'actif' ? 'bg-green-100 text-green-800' :
                        sub.statut === 'suspendu' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sub.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(sub.dateDebut), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {sub.dateFin ? format(new Date(sub.dateFin), 'dd/MM/yyyy', { locale: fr }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <select
                          value={sub.statut}
                          onChange={(e) => handleUpdate(sub._id, { statut: e.target.value })}
                          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                        >
                          <option value="actif">Actif</option>
                          <option value="suspendu">Suspendu</option>
                          <option value="expire">Expiré</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;

