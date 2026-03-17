const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Cabinet = require('./models/Cabinet');
const Subscription = require('./models/Subscription');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // 1. Créer l'administrateur
        const adminEmail = 'admin@mediconnect.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = new User({
                email: adminEmail,
                password: 'adminpassword123',
                nom: 'System',
                prenom: 'Admin',
                role: 'admin',
                isApproved: true,
                isActive: true
            });
            await admin.save();
            console.log('Admin created: ' + adminEmail);
        }

        // 2. Créer des médecins
        const medecinsData = [
            { email: 'dr.bejaoui@test.tn', password: 'password123', nom: 'Bejaoui', prenom: 'Ahmed', nomCabinet: 'Cabinet El Hana', adresse: 'Tunis', plan: 'premium' },
            { email: 'dr.benali@test.tn', password: 'password123', nom: 'Ben Ali', prenom: 'Sonia', nomCabinet: 'Clinique Pasteur', adresse: 'Sousse', plan: 'basique' },
            { email: 'dr.trabelsi@test.tn', password: 'password123', nom: 'Trabelsi', prenom: 'Faten', nomCabinet: 'Centre Médical', adresse: 'Sfax', plan: 'gratuit' }
        ];

        for (const data of medecinsData) {
            let user = await User.findOne({ email: data.email });
            if (!user) {
                user = new User({
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
                    telephone: '71123456',
                    email: data.email,
                    specialite: 'Généraliste'
                });
                await cabinet.save();

                user.cabinetId = cabinet._id;
                await user.save();

                const subscription = new Subscription({
                    cabinetId: cabinet._id,
                    plan: data.plan,
                    statut: 'actif',
                    dateDebut: new Date()
                });
                await subscription.save();
                
                console.log(`Medecin ${data.nom} created with cabinet and subscription`);
            }
        }

        console.log('Global Seed completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seed();
