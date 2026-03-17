const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sms', 'whatsapp', 'email', 'interne'],
    required: true
  },
  destinataire: {
    type: String, // téléphone ou email
    required: true
  },
  message: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['envoye', 'echec', 'en_attente'],
    default: 'en_attente'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  cabinetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabinet'
  },
  erreur: {
    type: String
  },
  dateEnvoi: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);

