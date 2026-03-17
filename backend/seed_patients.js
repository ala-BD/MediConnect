const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Cabinet = require('./models/Cabinet');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Subscription = require('./models/Subscription');

const seedPatients = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');

        const bejaoui = await User.findOne({ email: 'dr.bejaoui@test.tn' });
        if (!bejaoui || !bejaoui.cabinetId) {
            console.log('Medecin Bejaoui not found');
            process.exit(1);
        }

        const patientsData = [
            { nom: 'Kallel', prenom: 'Yassine', telephone: '98123456', email: 'yassine@example.com', dateNaissance: '1990-05-15' },
            { nom: 'Mansour', prenom: 'Layla', telephone: '98654321', email: 'layla@example.com', dateNaissance: '1985-08-22' }
        ];

        for (const data of patientsData) {
            let p = await Patient.findOne({ email: data.email, cabinetId: bejaoui.cabinetId });
            if (!p) {
                p = new Patient({
                    ...data,
                    cabinetId: bejaoui.cabinetId
                });
                await p.save();
                console.log('Patient created: ' + data.nom);

                // Créer un RDV
                const apt = new Appointment({
                    patientId: p._id,
                    cabinetId: bejaoui.cabinetId,
                    medecinId: bejaoui._id,
                    date: new Date(),
                    heure: '10:00',
                    statut: 'confirme',
                    motif: 'Consultation Générale'
                });
                await apt.save();
                console.log('Appointment created');
            }
        }

        console.log('Full Seed completed');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPatients();
