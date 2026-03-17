const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  cabinetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabinet',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['gratuit', 'basique', 'premium'],
    default: 'gratuit'
  },
  statut: {
    type: String,
    enum: ['actif', 'suspendu', 'expire'],
    default: 'actif'
  },
  dateDebut: {
    type: Date,
    default: Date.now
  },
  dateFin: {
    type: Date
  },
  paiements: [{
    montant: Number,
    date: Date,
    methode: String,
    transactionId: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

