const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Cabinet = require('../models/Cabinet');
const User = require('../models/User');

// Obtenir la liste des cabinets disponibles (public)
router.get('/cabinets', async (req, res) => {
  try {
    // Récupérer tous les cabinets avec leurs médecins approuvés
    const cabinets = await Cabinet.find()
      .populate({
        path: 'userId',
        match: { isApproved: true, isActive: true, role: 'medecin' },
        select: 'nom prenom email'
      })
      .select('nom adresse telephone email specialite dureeConsultation horaires');

    // Filtrer les cabinets qui ont un médecin approuvé
    const availableCabinets = cabinets.filter(cabinet => cabinet.userId !== null);

    res.json(availableCabinets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les informations d'un cabinet (public)
router.get('/cabinet/:cabinetId', async (req, res) => {
  try {
    const { cabinetId } = req.params;
    const cabinet = await Cabinet.findById(cabinetId)
      .populate({
        path: 'userId',
        match: { isApproved: true, isActive: true },
        select: 'nom prenom email'
      });

    if (!cabinet || !cabinet.userId) {
      return res.status(404).json({ message: 'Cabinet non trouvé ou non disponible' });
    }

    res.json(cabinet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les créneaux disponibles pour un cabinet (public)
router.get('/cabinet/:cabinetId/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const { cabinetId } = req.params;

    const cabinet = await Cabinet.findById(cabinetId);
    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet non trouvé' });
    }

    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const horaire = cabinet.horaires.find(h => h.jour === dayName);

    if (!horaire || !horaire.estOuvert) {
      return res.json([]);
    }

    // Générer les créneaux
    const slots = [];
    const [startHour, startMin] = horaire.heureDebut.split(':').map(Number);
    const [endHour, endMin] = horaire.heureFin.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    for (let minutes = startMinutes; minutes < endMinutes; minutes += cabinet.dureeConsultation) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const slot = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(slot);
    }

    // Filtrer les créneaux pris
    const appointments = await Appointment.find({
      cabinetId,
      date: selectedDate,
      statut: { $nin: ['annule', 'absent'] }
    });

    const takenSlots = appointments.map(a => a.heure);
    const availableSlots = slots.filter(slot => !takenSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un rendez-vous depuis le formulaire public
router.post('/appointment', async (req, res) => {
  try {
    const { nom, prenom, telephone, email, date, heure, motif, cabinetId, dateNaissance } = req.body;

    // Vérifier le cabinet
    const cabinet = await Cabinet.findById(cabinetId);
    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet non trouvé' });
    }

    // Vérifier si le créneau est disponible
    const existingAppointment = await Appointment.findOne({
      cabinetId,
      date: new Date(date),
      heure,
      statut: { $nin: ['annule', 'absent'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Ce créneau est déjà pris' });
    }

    // Chercher ou créer le patient (par nom, prénom, téléphone ET date de naissance pour une identification parfaite)
    const birthDate = dateNaissance ? new Date(dateNaissance) : null;
    
    let patient = await Patient.findOne({ 
      nom: { $regex: new RegExp(`^${nom}$`, 'i') },
      prenom: { $regex: new RegExp(`^${prenom}$`, 'i') },
      telephone, 
      cabinetId,
      ...(birthDate && { dateNaissance: { 
        $gte: new Date(birthDate.setHours(0,0,0,0)), 
        $lte: new Date(birthDate.setHours(23,59,59,999)) 
      }})
    });

    if (!patient) {
      patient = new Patient({
        nom,
        prenom,
        telephone,
        email,
        dateNaissance: birthDate,
        cabinetId
      });
      await patient.save();
    } else {
      // Ne pas écraser les données existantes, seulement compléter l'email s'il manque
      if (email && !patient.email) {
        patient.email = email;
        await patient.save();
      }
    }

    // Créer le rendez-vous
    const appointment = new Appointment({
      patientId: patient._id,
      cabinetId,
      date: new Date(date),
      heure,
      motif,
      source: 'web',
      statut: 'en_attente'
    });

    await appointment.save();
    await appointment.populate('patientId');

    res.status(201).json({
      message: 'Rendez-vous créé avec succès',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

