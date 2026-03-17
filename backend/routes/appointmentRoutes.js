const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getStats
} = require('../controllers/appointmentController');
const { auth, isMedecinOrSecretaire } = require('../middleware/auth');

router.use(auth);
router.use(isMedecinOrSecretaire);

router.get('/', getAppointments);
router.get('/stats', getStats);
router.get('/:id', getAppointment);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;

