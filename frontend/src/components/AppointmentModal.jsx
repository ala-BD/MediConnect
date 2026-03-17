import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useAppointmentStore from '../store/appointmentStore';
import usePatientStore from '../store/patientStore';
import { cabinetService } from '../services/cabinetService';

const AppointmentModal = ({ isOpen, onClose, appointment = null, selectedDate = null }) => {
  const { createAppointment, updateAppointment } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    date: selectedDate ? format(new Date(selectedDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    heure: '',
    motif: '',
    statut: 'en_attente',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      if (appointment) {
        setFormData({
          patientId: appointment.patientId?._id || appointment.patientId || '',
          date: format(new Date(appointment.date), 'yyyy-MM-dd'),
          heure: appointment.heure,
          motif: appointment.motif || '',
          statut: appointment.statut,
          notes: appointment.notes || ''
        });
      }
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    if (formData.date) {
      loadAvailableSlots();
    }
  }, [formData.date]);

  const loadAvailableSlots = async () => {
    try {
      const slots = await cabinetService.getAvailableSlots(formData.date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (appointment) {
        await updateAppointment(appointment._id, formData);
      } else {
        await createAppointment(formData);
      }
      onClose();
      setFormData({
        patientId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        heure: '',
        motif: '',
        statut: 'en_attente',
        notes: ''
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Patient *
            </label>
            <select
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="input-field"
              disabled={loading}
            >
              <option value="">Sélectionner un patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.nom} {patient.prenom} - {patient.telephone}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value, heure: '' })}
              className="input-field"
              min={format(new Date(), 'yyyy-MM-dd')}
              disabled={loading}
            />
          </div>

          {/* Heure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Heure *
            </label>
            {availableSlots.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun créneau disponible pour cette date</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, heure: slot })}
                    className={`py-2 px-3 rounded-lg font-medium transition-all ${
                      formData.heure === slot
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={loading}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
            {formData.heure && (
              <p className="mt-2 text-sm text-gray-600">Créneau sélectionné : {formData.heure}</p>
            )}
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Motif de consultation
            </label>
            <input
              type="text"
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              className="input-field"
              placeholder="Ex: Consultation générale"
              disabled={loading}
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
            <select
              required
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="input-field"
              disabled={loading}
            >
              <option value="en_attente">En attente</option>
              <option value="confirme">Confirmé</option>
              <option value="termine">Terminé</option>
              <option value="annule">Annulé</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Notes supplémentaires..."
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !formData.patientId || !formData.heure}
            >
              {loading ? 'Enregistrement...' : appointment ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;

