const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Cabinet = require('../models/Cabinet');
const Notification = require('../models/Notification');
const { sendSMS } = require('../utils/reminderService');

// Créer un rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, date, heure, motif, duree, source } = req.body;
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
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

    const appointment = new Appointment({
      patientId,
      cabinetId,
      date: new Date(date),
      heure,
      motif,
      duree: duree || 30,
      source: source || 'cabinet'
    });

    await appointment.save();
    await appointment.populate('patientId');

    // Créer notification interne
    await Notification.create({
      type: 'interne',
      destinataire: req.user.email,
      message: `Nouveau rendez-vous créé avec ${appointment.patientId.nom} ${appointment.patientId.prenom} le ${new Date(date).toLocaleDateString('fr-FR')} à ${heure}`,
      appointmentId: appointment._id,
      cabinetId,
      statut: 'envoye'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les rendez-vous
exports.getAppointments = async (req, res) => {
  try {
    const { date, dateEnd, statut, patientId } = req.query;
    const cabinetId = req.user.cabinetId;

    if (!cabinetId && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const filter = {};
    if (cabinetId) filter.cabinetId = cabinetId;
    
    // Support de la recherche par plage de dates (très important pour le calendrier)
    if (date && dateEnd) {
      filter.date = { 
        $gte: new Date(date), 
        $lte: new Date(dateEnd) 
      };
    } else if (date) {
      filter.date = new Date(date);
    }

    if (statut) filter.statut = statut;
    if (patientId) filter.patientId = patientId;

    const appointments = await Appointment.find(filter)
      .populate('patientId')
      .sort({ date: 1, heure: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un rendez-vous par ID
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('cabinetId');

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier l'accès
    if (req.user.role !== 'admin' && appointment.cabinetId._id.toString() !== req.user.cabinetId?.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un rendez-vous
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier l'accès
    if (req.user.role !== 'admin' && appointment.cabinetId.toString() !== req.user.cabinetId?.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { date, heure, motif, statut, notes } = req.body;

    // Si date/heure changées, vérifier disponibilité
    if ((date || heure) && statut !== 'annule') {
      const newDate = date ? new Date(date) : appointment.date;
      const newHeure = heure || appointment.heure;

      const existingAppointment = await Appointment.findOne({
        cabinetId: appointment.cabinetId,
        date: newDate,
        heure: newHeure,
        statut: { $nin: ['annule', 'absent'] },
        _id: { $ne: appointment._id }
      });

      if (existingAppointment) {
        return res.status(400).json({ message: 'Ce créneau est déjà pris' });
      }
    }

    if (date) appointment.date = new Date(date);
    if (heure) appointment.heure = heure;
    if (motif !== undefined) appointment.motif = motif;
    if (statut) appointment.statut = statut;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();
    await appointment.populate('patientId');

    // Notification de confirmation WhatsApp si le statut devient 'confirme'
    if (statut === 'confirme') {
      const cabinet = await Cabinet.findById(appointment.cabinetId);
      const dateStr = appointment.date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      const message = `✨ *Confirmation de Rendez-vous* ✨\n\nBonjour *${appointment.patientId.prenom} ${appointment.patientId.nom}*,\n\nBonne nouvelle ! Votre rendez-vous a été *ACCEPTÉ* par le *Dr. ${cabinet.nom}*.\n\n📅 *Date* : ${dateStr}\n🕒 *Heure* : ${appointment.heure}\n📍 *Lieu* : ${cabinet.adresse}\n\nMerci de votre confiance. À bientôt ! 🙏`;
      
      try {
        const result = await sendSMS(appointment.patientId.telephone, message);
        await Notification.create({
          type: 'whatsapp',
          destinataire: appointment.patientId.telephone,
          message,
          appointmentId: appointment._id,
          cabinetId: appointment.cabinetId,
          statut: result.success ? 'envoye' : 'echec',
          dateEnvoi: new Date()
        });
      } catch (error) {
        console.error('Erreur envoi notification confirmation:', error);
      }
    }

    // Notification de modification
    await Notification.create({
      type: 'interne',
      destinataire: req.user.email,
      message: `Rendez-vous modifié avec ${appointment.patientId.nom} ${appointment.patientId.prenom}`,
      appointmentId: appointment._id,
      cabinetId: appointment.cabinetId,
      statut: 'envoye'
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un rendez-vous
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier l'accès
    if (req.user.role !== 'admin' && appointment.cabinetId.toString() !== req.user.cabinetId?.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Rendez-vous supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques
exports.getStats = async (req, res) => {
  try {
    const { periode } = req.query; // 'jour', 'semaine', 'mois'
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const now = new Date();
    let startDate, endDate;

    switch (periode) {
      case 'jour':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'semaine':
        startDate = new Date(now.setDate(now.getDate() - now.getDay() + 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'mois':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
    }

    const appointments = await Appointment.find({
      cabinetId,
      date: { $gte: startDate, $lte: endDate }
    });

    const stats = {
      total: appointments.length,
      confirmes: appointments.filter(a => a.statut === 'confirme').length,
      annules: appointments.filter(a => a.statut === 'annule').length,
      termines: appointments.filter(a => a.statut === 'termine').length,
      absents: appointments.filter(a => a.statut === 'absent').length,
      enAttente: appointments.filter(a => a.statut === 'en_attente').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
