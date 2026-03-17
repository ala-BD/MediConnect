const express = require('express');
const router = express.Router();
const {
  getMedecins,
  approveMedecin,
  toggleMedecinStatus,
  getSubscriptions,
  updateSubscription,
  getGlobalStats,
  getNotifications
} = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth);
router.use(isAdmin);

router.get('/medecins', getMedecins);
router.put('/medecins/:id/approve', approveMedecin);
router.put('/medecins/:id/status', toggleMedecinStatus);
router.get('/subscriptions', getSubscriptions);
router.put('/subscriptions/:id', updateSubscription);
router.get('/stats', getGlobalStats);
router.get('/notifications', getNotifications);

module.exports = router;

