# Plateforme des Médecins - SaaS de Gestion de Cabinet Médical

Une plateforme SaaS complète pour la gestion de cabinets médicaux avec prise de rendez-vous en ligne, rappels automatiques et espace administrateur.

## 🚀 Fonctionnalités

### 1. Espace Médecin / Secrétaire
- **Tableau de bord** : Vue globale des rendez-vous, statistiques en temps réel
- **Gestion des rendez-vous** : CRUD complet, modification de statuts, déplacement
- **Gestion du planning** : Définition des horaires, durée de consultation, blocage de créneaux
- **Gestion des patients** : Ajout, modification, recherche, historique des rendez-vous
- **Rappels automatiques** : SMS/WhatsApp 24h et 2h avant le rendez-vous
- **Paramètres du cabinet** : Configuration complète (horaires, spécialité, rappels)

### 2. Espace Administrateur
- **Gestion des médecins** : Approbation, suspension, activation des comptes
- **Gestion des abonnements** : Plans (gratuit, basique, premium), statuts
- **Statistiques globales** : Vue d'ensemble de la plateforme
- **Historique des notifications** : Suivi des SMS/WhatsApp envoyés

### 3. Portail Public (Patient)
- **Prise de rendez-vous en ligne** : Formulaire simple sans compte requis
- **Sélection de créneaux disponibles** : Affichage en temps réel
- **Confirmation automatique** : SMS de confirmation après réservation

## 🛠️ Technologies

### Backend
- **Node.js** avec Express
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **Socket.io** (préparé pour les notifications en temps réel)

### Frontend
- **React 19** avec Vite
- **React Router** pour la navigation
- **Zustand** pour la gestion d'état
- **Axios** pour les appels API
- **Tailwind CSS** pour le styling
- **date-fns** pour la gestion des dates
- **Lucide React** pour les icônes

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/plateforme-medecins
JWT_SECRET=votre_secret_jwt_super_securise
NODE_ENV=development
```

Démarrer le serveur :

```bash
npm start
# ou avec nodemon pour le développement
npx nodemon server.js
```

### Frontend

```bash
cd frontend
npm install
```

Créer un fichier `.env` dans le dossier `frontend` :

```env
VITE_API_URL=http://localhost:5000/api
```

Démarrer le serveur de développement :

```bash
npm run dev
```

## 📁 Structure du Projet

```
Plateforme des médecins/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuration MongoDB
│   ├── controllers/
│   │   ├── adminController.js   # Gestion admin
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── cabinetController.js
│   │   └── patientController.js
│   ├── middleware/
│   │   └── auth.js              # Middleware d'authentification
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Cabinet.js
│   │   ├── Notification.js
│   │   ├── Patient.js
│   │   ├── Subscription.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cabinetRoutes.js
│   │   ├── patientRoutes.js
│   │   └── publicRoutes.js
│   ├── utils/
│   │   └── reminderService.js   # Service de rappels automatiques
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── AppointmentModal.jsx
    │   ├── layouts/
    │   │   ├── AdminLayout.jsx
    │   │   ├── AuthLayout.jsx
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminMedecins.jsx
    │   │   ├── AdminNotifications.jsx
    │   │   ├── AdminSubscriptions.jsx
    │   │   ├── Calendar.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── PatientBooking.jsx
    │   │   ├── Patients.jsx
    │   │   └── Settings.jsx
    │   ├── services/
    │   │   ├── adminService.js
    │   │   ├── api.js
    │   │   ├── appointmentService.js
    │   │   ├── authService.js
    │   │   ├── cabinetService.js
    │   │   ├── patientService.js
    │   │   └── publicService.js
    │   ├── store/
    │   │   ├── appointmentStore.js
    │   │   ├── authStore.js
    │   │   └── patientStore.js
    │   └── App.jsx
    └── package.json
```

## 🔐 Authentification

### Rôles disponibles
- **admin** : Accès complet à la plateforme SaaS
- **medecin** : Accès à l'espace cabinet (doit être approuvé par l'admin)
- **secretaire** : Accès à l'espace cabinet

### Création d'un compte admin
Pour créer le premier compte admin, vous pouvez utiliser un script ou créer directement dans MongoDB :

```javascript
// Dans MongoDB shell ou via un script
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10$...", // Hash bcrypt du mot de passe
  role: "admin",
  nom: "Admin",
  prenom: "System",
  isActive: true,
  isApproved: true
});
```

## 📱 Rappels Automatiques

Le système de rappels fonctionne avec des jobs qui s'exécutent toutes les heures :
- **Rappel 24h** : Envoyé la veille du rendez-vous
- **Rappel 2h** : Envoyé 2 heures avant le rendez-vous

### Intégration SMS/WhatsApp

Pour activer les vrais envois SMS, modifiez `backend/utils/reminderService.js` et intégrez un service comme :
- Twilio
- WhatsApp Business API
- Autre service SMS

Actuellement, le système simule l'envoi (logs dans la console).

## 🎯 Routes API Principales

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel

### Rendez-vous
- `GET /api/appointments` - Liste des rendez-vous
- `POST /api/appointments` - Créer un rendez-vous
- `PUT /api/appointments/:id` - Modifier un rendez-vous
- `DELETE /api/appointments/:id` - Supprimer un rendez-vous
- `GET /api/appointments/stats` - Statistiques

### Patients
- `GET /api/patients` - Liste des patients
- `POST /api/patients` - Créer un patient
- `GET /api/patients/:id/history` - Historique d'un patient

### Cabinet
- `GET /api/cabinet` - Informations du cabinet
- `PUT /api/cabinet` - Modifier le cabinet
- `GET /api/cabinet/slots` - Créneaux disponibles

### Public
- `GET /api/public/cabinet/:cabinetId/slots` - Créneaux disponibles (public)
- `POST /api/public/appointment` - Créer un rendez-vous (public)

### Admin
- `GET /api/admin/medecins` - Liste des médecins
- `PUT /api/admin/medecins/:id/approve` - Approuver un médecin
- `GET /api/admin/stats` - Statistiques globales

## 🚧 Améliorations Futures

- [ ] Intégration réelle SMS/WhatsApp (Twilio, etc.)
- [ ] Système de paiement pour les abonnements
- [ ] Notifications en temps réel avec Socket.io
- [ ] Export PDF des rapports
- [ ] Application mobile
- [ ] Multi-langues
- [ ] Tests unitaires et d'intégration

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

