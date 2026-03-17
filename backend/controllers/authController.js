const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cabinet = require('../models/Cabinet');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_change_in_production', {
    expiresIn: '30d'
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { email, password, nom, prenom, telephone, role, nomCabinet, adresse, specialite } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Vérifier que les champs obligatoires sont présents pour un médecin
    if ((role === 'medecin' || !role) && (!nomCabinet || !adresse)) {
      return res.status(400).json({ message: 'Le nom du cabinet et l\'adresse sont requis pour les médecins' });
    }

    // Créer l'utilisateur SANS cabinetId d'abord
    const user = new User({
      email,
      password,
      nom,
      prenom,
      telephone,
      role: role || 'medecin',
      isApproved: false // Les médecins doivent être approuvés par l'admin
    });

    await user.save();

    // Si c'est un médecin, créer le cabinet
    if (user.role === 'medecin' && nomCabinet) {
      const cabinet = new Cabinet({
        nom: nomCabinet,
        adresse,
        specialite: specialite || '',
        telephone: user.telephone,
        email: user.email,
        userId: user._id
      });
      await cabinet.save();
      
      // Mettre à jour l'utilisateur avec le cabinetId
      user.cabinetId = cabinet._id;
      await user.save();

      // Créer un abonnement gratuit par défaut
      const Subscription = require('../models/Subscription');
      const subscription = new Subscription({
        cabinetId: cabinet._id,
        plan: 'gratuit',
        statut: 'actif',
        dateDebut: new Date()
      });
      await subscription.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        cabinetId: user.cabinetId,
        isApproved: user.isApproved
      },
      message: user.role === 'medecin' 
        ? 'Inscription réussie ! Votre compte est en attente d\'approbation par l\'administrateur.'
        : 'Inscription réussie !'
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: error.message || 'Erreur lors de l\'inscription' });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Compte désactivé' });
    }

    // Pour les médecins, vérifier l'approbation
    if (user.role === 'medecin' && !user.isApproved && user.role !== 'admin') {
      return res.status(403).json({ message: 'Compte en attente d\'approbation' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        cabinetId: user.cabinetId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir l'utilisateur actuel
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

