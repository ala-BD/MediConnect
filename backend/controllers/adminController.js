const User = require('../models/User');
const Cabinet = require('../models/Cabinet');
const Subscription = require('../models/Subscription');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// Obtenir tous les médecins
exports.getMedecins = async (req, res) => {
  try {
    const { statut, search } = req.query;
    const filter = { role: { $in: ['medecin', 'secretaire'] } };

    if (statut === 'approved') filter.isApproved = true;
    if (statut === 'pending') filter.isApproved = false;
    if (statut === 'active') filter.isActive = true;
    if (statut === 'inactive') filter.isActive = false;

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const medecins = await User.find(filter)
      .select('-password')
      .populate('cabinetId')
      .sort({ createdAt: -1 });

    res.json(medecins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approuver ou rejeter un médecin
exports.approveMedecin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }

    user.isApproved = isApproved;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspendre ou activer un compte
exports.toggleMedecinStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }

    user.isActive = isActive;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les abonnements
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('cabinetId')
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un abonnement
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, statut, dateFin } = req.body;

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    if (plan) subscription.plan = plan;
    if (statut) subscription.statut = statut;
    if (dateFin) subscription.dateFin = new Date(dateFin);

    await subscription.save();
    await subscription.populate('cabinetId');

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques globales
exports.getGlobalStats = async (req, res) => {
  try {
    const totalMedecins = await User.countDocuments({ 
      role: 'medecin', 
      isApproved: true, 
      isActive: true 
    });
    const totalCabinets = await Cabinet.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    // Statistiques par mois (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const appointmentsThisMonth = await Appointment.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const confirmedAppointments = await Appointment.countDocuments({ statut: { $in: ['confirme', 'termine'] } });
    const conversionRate = totalAppointments > 0 ? ((confirmedAppointments / totalAppointments) * 100).toFixed(1) : 0;

    // Derniers cabinets inscrits
    const recentCabinets = await User.find({ role: 'medecin' })
      .select('nom prenom nomCabinet plan createdAt')
      .populate('cabinetId')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculer les revenus (exemple simplifié)
    const subscriptions = await Subscription.find({ statut: 'actif' });
    const revenusMensuels = subscriptions.reduce((sum, sub) => {
      const montants = { gratuit: 0, basique: 29.99, premium: 59.99 };
      return sum + (montants[sub.plan] || 0);
    }, 0);

    res.json({
      totalMedecins,
      totalCabinets,
      totalAppointments,
      appointmentsThisMonth,
      revenusMensuels: revenusMensuels.toFixed(2),
      monthlyStats,
      recentCabinets,
      conversionRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir l'historique des notifications SMS/WhatsApp
exports.getNotifications = async (req, res) => {
  try {
    const { type, statut, limit = 100 } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (statut) filter.statut = statut;

    const notifications = await Notification.find(filter)
      .populate('appointmentId')
      .populate('cabinetId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

