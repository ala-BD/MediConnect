const mongoose = require('mongoose');

const horaireSchema = new mongoose.Schema({
  jour: {
    type: String,
    enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
    required: true
  },
  estOuvert: {
    type: Boolean,
    default: true
  },
  heureDebut: {
    type: String, // Format "09:00"
    default: '09:00'
  },
  heureFin: {
    type: String, // Format "18:00"
    default: '18:00'
  }
}, { _id: false });

const cabinetSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  adresse: {
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
  specialite: {
    type: String
  },
  dureeConsultation: {
    type: Number, // en minutes
    default: 30
  },
  horaires: [horaireSchema],
  creneauxBloques: [{
    date: Date,
    heureDebut: String,
    heureFin: String,
    raison: String
  }],
  rappelsActives: {
    type: Boolean,
    default: true
  },
  rappel24h: {
    type: Boolean,
    default: true
  },
  rappel2h: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Initialiser les horaires par défaut si non fournis
cabinetSchema.pre('save', function() {
  if (this.horaires && this.horaires.length === 0) {
    const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    this.horaires = joursSemaine.map(jour => ({
      jour,
      estOuvert: jour !== 'samedi' && jour !== 'dimanche',
      heureDebut: '09:00',
      heureFin: '18:00'
    }));
  }
});

module.exports = mongoose.model('Cabinet', cabinetSchema);
