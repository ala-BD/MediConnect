const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant, accès refusé' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_in_production');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Utilisateur invalide ou désactivé' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

const isMedecinOrSecretaire = (req, res, next) => {
  if (!['medecin', 'secretaire'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès réservé au cabinet' });
  }
  next();
};

module.exports = { auth, isAdmin, isMedecinOrSecretaire };

