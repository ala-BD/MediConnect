const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Créer un patient
exports.createPatient = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, dateNaissance, notes } = req.body;
    const cabinetId = req.user.cabinetId;

    if (!cabinetId) {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const patient = new Patient({
      nom,
      prenom,
      telephone,
      email,
      dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
      notes,
      cabinetId
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les patients
exports.getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const cabinetId = req.user.cabinetId;

    if (!cabinetId && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Cabinet non trouvé' });
    }

    const filter = { cabinetId };
    
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(filter).sort({ nom: 1, prenom: 1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un patient par ID
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Vérifier l'accès
    if (req.user.role !== 'admin' && patient.cabinetId.toString() !== req.user.cabinetId?.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Vérifier l'accès
    if (req.user.role !== 'admin' && patient.cabinetId.toString() !== req.user.cabinetId?.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { nom, prenom, telephone, email, dateNaissance, notes } = req.body;

    if (nom) patient.nom = nom;
    if (prenom) patient.prenom = prenom;
    if (telephone) patient.telephone = telephone;
    if (email !== undefined) patient.email = email;
    if (dateNaissance) patient.dateNaissance = new Date(dateNaissance);
    if (notes !== undefined) patient.notes = notes;

    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Vérifier l'accès
    if (req.user.role !== 'admin' && patient.cabinetId.toString() !== req.user.cabinetId?.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Vérifier s'il y a des rendez-vous
    const appointments = await Appointment.find({ patientId: patient._id });
    if (appointments.length > 0) {
      return res.status(400).json({ 
        message: 'Impossible de supprimer ce patient car il a des rendez-vous' 
      });
    }

    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir l'historique des rendez-vous d'un patient
exports.getPatientHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Vérifier l'accès
    if (req.user.role !== 'admin' && patient.cabinetId.toString() !== req.user.cabinetId?.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .sort({ date: -1, heure: -1 })
      .limit(50);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

