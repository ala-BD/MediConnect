const express = require('express');
const router = express.Router();
const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getPatientHistory
} = require('../controllers/patientController');
const { auth, isMedecinOrSecretaire } = require('../middleware/auth');

router.use(auth);
router.use(isMedecinOrSecretaire);

router.get('/', getPatients);
router.get('/:id', getPatient);
router.get('/:id/history', getPatientHistory);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;

