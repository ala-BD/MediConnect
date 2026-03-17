const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  dateNaissance: {
    type: Date
  },
  notes: {
    type: String
  },
  cabinetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabinet',
    required: true
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
patientSchema.index({ nom: 1, prenom: 1 });
patientSchema.index({ telephone: 1 });
patientSchema.index({ cabinetId: 1 });

module.exports = mongoose.model('Patient', patientSchema);

