const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  cabinetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabinet',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  heure: {
    type: String, // Format "09:00"
    required: true
  },
  motif: {
    type: String
  },
  statut: {
    type: String,
    enum: ['confirme', 'en_attente', 'annule', 'termine', 'absent'],
    default: 'en_attente'
  },
  duree: {
    type: Number, // en minutes
    default: 30
  },
  notes: {
    type: String
  },
  rappelEnvoye24h: {
    type: Boolean,
    default: false
  },
  rappelEnvoye2h: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['telephone', 'web', 'cabinet'],
    default: 'cabinet'
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
appointmentSchema.index({ date: 1, heure: 1 });
appointmentSchema.index({ cabinetId: 1, date: 1 });
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ statut: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

