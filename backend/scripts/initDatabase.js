const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

// Importer les modèles
const User = require('../models/User');
const Cabinet = require('../models/Cabinet');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Subscription = require('../models/Subscription');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plateforme-medecins');
    console.log(`✅ MongoDB Connecté: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
    console.error('💡 Vérifiez que MongoDB est démarré sur localhost:27017');
    process.exit(1);
  }
};

const initDatabase = async () => {
  try {
    await connectDB();

    console.log('\n🔄 Initialisation de la base de données...\n');

    // 1. Créer un compte Admin
    console.log('1. Création du compte administrateur...');
    const adminExists = await User.findOne({ email: 'admin@medecins.com' });
    if (adminExists) {
      console.log('   🔄 Mise à jour du compte admin...');
      adminExists.password = 'Admin@2026!789';
      adminExists.isApproved = true;
      adminExists.isActive = true;
      await adminExists.save();
    } else {
      const admin = new User({
        email: 'admin@medecins.com',
        password: 'Admin@2026!789',
        nom: 'Admin',
        prenom: 'Système',
        role: 'admin',
        isActive: true,
        isApproved: true
      });
      await admin.save();
      console.log('   ✅ Compte admin créé:');
    }
    console.log('      Email: admin@medecins.com');
    console.log('      Mot de passe: Admin@2026!789');

    // 2. Créer un médecin de test
    console.log('\n2. Création d\'un médecin de test...');
    const medecinExists = await User.findOne({ email: 'medecin@test.com' });
    let medecin;
    if (medecinExists) {
      console.log('   🔄 Mise à jour du médecin de test...');
      medecinExists.password = 'Medecin@2026!456';
      medecinExists.isApproved = true;
      medecinExists.isActive = true;
      await medecinExists.save();
      medecin = medecinExists;
    } else {
      medecin = new User({
        email: 'medecin@test.com',
        password: 'Medecin@2026!456',
        nom: 'Dupont',
        prenom: 'Jean',
        telephone: '0612345678',
        role: 'medecin',
        isActive: true,
        isApproved: true
      });
      await medecin.save();
      console.log('   ✅ Médecin créé:');
    }
    console.log('      Email: medecin@test.com');
    console.log('      Mot de passe: Medecin@2026!456');

    // 3. Créer un cabinet pour le médecin
    console.log('\n3. Création d\'un cabinet...');
    let cabinet = await Cabinet.findOne({ userId: medecin._id });
    if (!cabinet) {
      cabinet = new Cabinet({
        nom: 'Cabinet Médical Dr. Dupont',
        adresse: '123 Rue de la Santé, 75001 Paris',
        telephone: '0112345678',
        email: 'contact@cabinet-dupont.fr',
        specialite: 'Médecine Générale',
        dureeConsultation: 30,
        horaires: [
          { jour: 'lundi', estOuvert: true, heureDebut: '09:00', heureFin: '18:00' },
          { jour: 'mardi', estOuvert: true, heureDebut: '09:00', heureFin: '18:00' },
          { jour: 'mercredi', estOuvert: true, heureDebut: '09:00', heureFin: '18:00' },
          { jour: 'jeudi', estOuvert: true, heureDebut: '09:00', heureFin: '18:00' },
          { jour: 'vendredi', estOuvert: true, heureDebut: '09:00', heureFin: '18:00' },
          { jour: 'samedi', estOuvert: false, heureDebut: '09:00', heureFin: '18:00' },
          { jour: 'dimanche', estOuvert: false, heureDebut: '09:00', heureFin: '18:00' }
        ],
        rappelsActives: true,
        rappel24h: true,
        rappel2h: true,
        userId: medecin._id
      });
      await cabinet.save();
      
      // Mettre à jour le médecin avec le cabinetId
      medecin.cabinetId = cabinet._id;
      await medecin.save();
      
      console.log('   ✅ Cabinet créé:', cabinet.nom);
    } else {
      console.log('   ⚠️  Cabinet existe déjà');
    }

    // 4. Créer un abonnement pour le cabinet
    console.log('\n4. Création d\'un abonnement...');
    let subscription = await Subscription.findOne({ cabinetId: cabinet._id });
    if (!subscription) {
      subscription = new Subscription({
        cabinetId: cabinet._id,
        plan: 'premium',
        statut: 'actif',
        dateDebut: new Date(),
        dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
      });
      await subscription.save();
      console.log('   ✅ Abonnement créé: Premium');
    } else {
      console.log('   ⚠️  Abonnement existe déjà');
    }

    // 5. Créer des patients de test
    console.log('\n5. Création de patients de test...');
    const patientsData = [
      {
        nom: 'Martin',
        prenom: 'Sophie',
        telephone: '0623456789',
        email: 'sophie.martin@email.com',
        dateNaissance: new Date('1985-05-15'),
        notes: 'Patient régulier'
      },
      {
        nom: 'Bernard',
        prenom: 'Pierre',
        telephone: '0634567890',
        email: 'pierre.bernard@email.com',
        dateNaissance: new Date('1978-11-22'),
        notes: 'Allergie aux pénicillines'
      },
      {
        nom: 'Dubois',
        prenom: 'Marie',
        telephone: '0645678901',
        email: 'marie.dubois@email.com',
        dateNaissance: new Date('1992-03-08')
      }
    ];

    const createdPatients = [];
    for (const patientData of patientsData) {
      const existingPatient = await Patient.findOne({
        telephone: patientData.telephone,
        cabinetId: cabinet._id
      });
      
      if (!existingPatient) {
        const patient = new Patient({
          ...patientData,
          cabinetId: cabinet._id
        });
        await patient.save();
        createdPatients.push(patient);
        console.log(`   ✅ Patient créé: ${patient.nom} ${patient.prenom}`);
      } else {
        createdPatients.push(existingPatient);
        console.log(`   ⚠️  Patient existe déjà: ${existingPatient.nom} ${existingPatient.prenom}`);
      }
    }

    // 6. Créer des rendez-vous de test
    console.log('\n6. Création de rendez-vous de test...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const appointmentsData = [
      {
        patientId: createdPatients[0]._id,
        date: tomorrow,
        heure: '09:00',
        motif: 'Consultation générale',
        statut: 'confirme'
      },
      {
        patientId: createdPatients[0]._id,
        date: tomorrow,
        heure: '10:00',
        motif: 'Suivi',
        statut: 'confirme'
      },
      {
        patientId: createdPatients[1]._id,
        date: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
        heure: '14:30',
        motif: 'Renouvellement ordonnance',
        statut: 'en_attente'
      }
    ];

    for (const aptData of appointmentsData) {
      const existingApt = await Appointment.findOne({
        patientId: aptData.patientId,
        date: aptData.date,
        heure: aptData.heure,
        cabinetId: cabinet._id
      });

      if (!existingApt) {
        const appointment = new Appointment({
          ...aptData,
          cabinetId: cabinet._id,
          source: 'cabinet'
        });
        await appointment.save();
        console.log(`   ✅ Rendez-vous créé: ${aptData.heure} - ${aptData.motif}`);
      } else {
        console.log(`   ⚠️  Rendez-vous existe déjà: ${aptData.heure}`);
      }
    }

    console.log('\n✅ Initialisation terminée avec succès !\n');
    console.log('📋 Comptes créés :');
    console.log('   Admin: admin@medecins.com / Admin@2026!789');
    console.log('   Médecin: medecin@test.com / Medecin@2026!456\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

// Exécuter l'initialisation
initDatabase();

