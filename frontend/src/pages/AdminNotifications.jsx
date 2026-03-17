import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { adminService } from '../services/adminService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.statut = filter;
      const data = await adminService.getNotifications(params);
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sms':
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sms':
        return 'bg-blue-100 text-blue-800';
      case 'whatsapp':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Historique des Notifications</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Tous</option>
          <option value="envoye">Envoyés</option>
          <option value="echec">Échecs</option>
          <option value="en_attente">En attente</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Aucune notification trouvée</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Destinataire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {notifications.map((notif) => (
                  <tr key={notif._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex items-center gap-1 w-fit ${getTypeColor(notif.type)}`}>
                        {getTypeIcon(notif.type)}
                        {notif.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{notif.destinataire}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-md truncate">{notif.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {notif.statut === 'envoye' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : notif.statut === 'echec' ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notif.statut === 'envoye' ? 'bg-green-100 text-green-800' :
                          notif.statut === 'echec' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notif.statut}
                        </span>
                      </div>
                      {notif.erreur && (
                        <div className="text-xs text-red-400 mt-1">{notif.erreur}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(notif.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
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

export default AdminNotifications;

