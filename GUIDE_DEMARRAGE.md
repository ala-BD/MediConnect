# 🚀 Guide de Démarrage et Test

## Étape 1 : Vérifier MongoDB

Assurez-vous que MongoDB est démarré et accessible sur `localhost:27017`

## Étape 2 : Initialiser la base de données

Dans le terminal, allez dans le dossier backend et exécutez :

```bash
cd backend
node scripts/initDatabase.js
```

Cela va créer :
- ✅ Un compte admin : `admin@medecins.com` / `admin123`
- ✅ Un compte médecin : `medecin@test.com` / `medecin123`
- ✅ Un cabinet de test
- ✅ Des patients de test
- ✅ Des rendez-vous de test

## Étape 3 : Démarrer le Backend

Dans un terminal :

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ MongoDB Connecté: localhost
📊 Base de données: plateforme-medecins
Serveur démarré sur le port 5000
Mode: development
```

## Étape 4 : Démarrer le Frontend

Dans un **nouveau terminal** :

```bash
cd frontend
npm run dev
```

Vous devriez voir :
```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Étape 5 : Tester l'Application

### 5.1 Connexion Admin

1. Ouvrez votre navigateur : `http://localhost:5173`
2. Cliquez sur "Admin" dans le sélecteur de rôle
3. Connectez-vous avec :
   - Email : `admin@medecins.com`
   - Mot de passe : `admin123`

**Fonctionnalités à tester :**
- ✅ Voir le tableau de bord admin
- ✅ Voir la liste des médecins
- ✅ Approuver/suspendre un médecin
- ✅ Voir les abonnements
- ✅ Voir les statistiques globales
- ✅ Voir l'historique des notifications

### 5.2 Connexion Médecin

1. Déconnectez-vous (ou ouvrez une fenêtre privée)
2. Cliquez sur "Cabinet" dans le sélecteur de rôle
3. Connectez-vous avec :
   - Email : `medecin@test.com`
   - Mot de passe : `medecin123`

**Fonctionnalités à tester :**

#### Dashboard
- ✅ Voir les statistiques du jour/semaine/mois
- ✅ Voir les rendez-vous à venir
- ✅ Voir les performances du cabinet

#### Planning (Calendar)
- ✅ Voir le calendrier mensuel
- ✅ Cliquer sur un jour pour créer un rendez-vous
- ✅ Cliquer sur un rendez-vous pour le modifier
- ✅ Supprimer un rendez-vous
- ✅ Voir les créneaux disponibles

#### Patients
- ✅ Voir la liste des patients
- ✅ Rechercher un patient
- ✅ Créer un nouveau patient
- ✅ Modifier un patient
- ✅ Voir l'historique d'un patient
- ✅ Supprimer un patient

#### Paramètres
- ✅ Modifier les informations du cabinet
- ✅ Configurer les horaires d'ouverture
- ✅ Définir la durée de consultation
- ✅ Activer/désactiver les rappels automatiques

### 5.3 Portail Public (Patient)

1. Ouvrez : `http://localhost:5173/prendre-rdv`
2. Remplissez le formulaire :
   - Nom, Prénom, Téléphone
   - Choisissez une date
   - Choisissez un créneau disponible
3. Confirmez le rendez-vous

**Note** : Pour que le formulaire fonctionne, vous devez modifier `PatientBooking.jsx` pour remplacer `'YOUR_CABINET_ID'` par l'ID réel du cabinet.

## 🔧 Résolution des Problèmes

### Erreur : "MongoDB Connecté" mais pas de données

**Solution** : Exécutez le script d'initialisation :
```bash
cd backend
node scripts/initDatabase.js
```

### Erreur : "Cannot connect to MongoDB"

**Solutions** :
1. Vérifiez que MongoDB est démarré
2. Vérifiez le fichier `.env` dans `backend/`
3. Testez la connexion dans MongoDB Compass : `mongodb://localhost:27017`

### Erreur : "Port 5000 already in use"

**Solution** : Changez le port dans `backend/.env` :
```env
PORT=5001
```
Et mettez à jour `frontend/.env` :
```env
VITE_API_URL=http://localhost:5001/api
```

### Erreur : "CORS error"

**Solution** : Vérifiez que le backend est bien démarré et que l'URL dans `frontend/.env` est correcte.

## 📝 URLs Importantes

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000/api
- **Login** : http://localhost:5173/login
- **Prise de RDV** : http://localhost:5173/prendre-rdv
- **Admin** : http://localhost:5173/admin

## ✅ Checklist de Test

- [ ] Backend démarré sans erreur
- [ ] Frontend démarré sans erreur
- [ ] Connexion admin fonctionne
- [ ] Connexion médecin fonctionne
- [ ] Dashboard affiche les données
- [ ] Création de rendez-vous fonctionne
- [ ] Modification de rendez-vous fonctionne
- [ ] Gestion des patients fonctionne
- [ ] Paramètres du cabinet fonctionnent
- [ ] MongoDB Compass montre les données

## 🎯 Prochaines Étapes

1. ✅ Tester toutes les fonctionnalités
2. ✅ Créer plus de données de test si nécessaire
3. ✅ Configurer un vrai service SMS pour les rappels
4. ✅ Personnaliser les couleurs/thème si besoin
5. ✅ Ajouter plus de fonctionnalités selon vos besoins

