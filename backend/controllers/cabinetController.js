const Cabinet = require('../models/Cabinet');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Obtenir les informations du cabinet
exports.getCabinet = async (req, res) => {
  try {
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const cabinet = await Cabinet.findById(cabinetId);
    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet non trouvé' });
    }

    res.json(cabinet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier les informations du cabinet
exports.updateCabinet = async (req, res) => {
  try {
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const cabinet = await Cabinet.findById(cabinetId);
    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet non trouvé' });
    }

    const { nom, adresse, telephone, email, specialite, dureeConsultation, horaires, rappelsActives, rappel24h, rappel2h } = req.body;

    if (nom) cabinet.nom = nom;
    if (adresse) cabinet.adresse = adresse;
    if (telephone) cabinet.telephone = telephone;
    if (email) cabinet.email = email;
    if (specialite) cabinet.specialite = specialite;
    if (dureeConsultation) cabinet.dureeConsultation = dureeConsultation;
    if (horaires) cabinet.horaires = horaires;
    if (rappelsActives !== undefined) cabinet.rappelsActives = rappelsActives;
    if (rappel24h !== undefined) cabinet.rappel24h = rappel24h;
    if (rappel2h !== undefined) cabinet.rappel2h = rappel2h;

    await cabinet.save();
    res.json(cabinet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bloquer un créneau
exports.blockSlot = async (req, res) => {
  try {
    const { date, heureDebut, heureFin, raison } = req.body;
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const cabinet = await Cabinet.findById(cabinetId);
    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet non trouvé' });
    }

    cabinet.creneauxBloques.push({
      date: new Date(date),
      heureDebut,
      heureFin,
      raison
    });

    await cabinet.save();
    res.json(cabinet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les créneaux disponibles
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

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

    // Générer les créneaux selon la durée de consultation
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

    // Filtrer les créneaux déjà pris
    const appointments = await Appointment.find({
      cabinetId,
      date: selectedDate,
      statut: { $nin: ['annule', 'absent'] }
    });

    const takenSlots = appointments.map(a => a.heure);
    const blockedSlots = cabinet.creneauxBloques
      .filter(cb => cb.date.toDateString() === selectedDate.toDateString())
      .flatMap(cb => {
        const slots = [];
        const [startH, startM] = cb.heureDebut.split(':').map(Number);
        const [endH, endM] = cb.heureFin.split(':').map(Number);
        const start = startH * 60 + startM;
        const end = endH * 60 + endM;
        for (let m = start; m < end; m += cabinet.dureeConsultation) {
          const h = Math.floor(m / 60);
          const min = m % 60;
          slots.push(`${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
        }
        return slots;
      });

    const availableSlots = slots.filter(slot => 
      !takenSlots.includes(slot) && !blockedSlots.includes(slot)
    );

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques du cabinet
exports.getCabinetStats = async (req, res) => {
  try {
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const totalPatients = await Patient.countDocuments({ cabinetId });
    const totalAppointments = await Appointment.countDocuments({ cabinetId });
    const appointmentsTermines = await Appointment.countDocuments({ 
      cabinetId, 
      statut: 'termine' 
    });
    const appointmentsAbsents = await Appointment.countDocuments({ 
      cabinetId, 
      statut: 'absent' 
    });

    const tauxAbsence = totalAppointments > 0 
      ? ((appointmentsAbsents / totalAppointments) * 100).toFixed(1)
      : 0;

    res.json({
      totalPatients,
      totalAppointments,
      appointmentsTermines,
      appointmentsAbsents,
      tauxAbsence: parseFloat(tauxAbsence)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

