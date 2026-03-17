const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { check24hReminders, check2hReminders } = require('./utils/reminderService');

// Routes
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes');
const cabinetRoutes = require('./routes/cabinetRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');

dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API Plateforme Médecins - Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/cabinet', cabinetRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Job scheduler pour les rappels automatiques
// Vérifier les rappels toutes les 5 minutes
setInterval(() => {
  check24hReminders();
  check2hReminders();
}, 5 * 60 * 1000);

// Vérifier immédiatement au démarrage
check24hReminders();
check2hReminders();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});
