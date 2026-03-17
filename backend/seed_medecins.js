const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Cabinet = require('./models/Cabinet');
const Subscription = require('./models/Subscription');
const Appointment = require('./models/Appointment');
const Patient = require('./models/Patient');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Nettoyer (Optionnel, ici on ajoute juste)
    // await User.deleteMany({ role: 'medecin' });

    const medecinsData = [
      { email: 'dr.smith@example.com', password: 'password123', nom: 'Smith', prenom: 'John', role: 'medecin', nomCabinet: 'City Care', adresse: 'Paris' },
      { email: 'dr.muller@example.com', password: 'password123', nom: 'Muller', prenom: 'Anna', role: 'medecin', nomCabinet: 'Health Center', adresse: 'Lyon' }
    ];

    for (const data of medecinsData) {
      const existing = await User.findOne({ email: data.email });
      if (!existing) {
        const user = new User({
          email: data.email,
          password: data.password,
          nom: data.nom,
          prenom: data.prenom,
          role: 'medecin',
          isApproved: true,
          isActive: true
        });
        await user.save();

        const cabinet = new Cabinet({
          nom: data.nomCabinet,
          adresse: data.adresse,
          userId: user._id,
          telephone: '12345678',
          email: data.email
        });
        await cabinet.save();

        user.cabinetId = cabinet._id;
        await user.save();

        const subscription = new Subscription({
          cabinetId: cabinet._id,
          plan: 'premium',
          statut: 'actif',
          dateDebut: new Date()
        });
        await subscription.save();
        
        console.log(`Medecin ${data.nom} created`);
      }
    }

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
