const express = require('express');
const router = express.Router();
const {
  getCabinet,
  updateCabinet,
  blockSlot,
  getAvailableSlots,
  getCabinetStats
} = require('../controllers/cabinetController');
const { auth, isMedecinOrSecretaire } = require('../middleware/auth');

router.use(auth);
router.use(isMedecinOrSecretaire);

router.get('/', getCabinet);
router.get('/stats', getCabinetStats);
router.get('/slots', getAvailableSlots);
router.put('/', updateCabinet);
router.post('/block-slot', blockSlot);

module.exports = router;

