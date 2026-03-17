# 🚀 Commandes pour Lancer et Tester l'Application

## 📋 Prérequis

1. MongoDB doit être démarré sur `localhost:27017`
2. Node.js installé (v18+)

---

## 🔧 ÉTAPE 1 : Initialiser la Base de Données (Première fois uniquement)

### Terminal 1 - Backend

```bash
cd "C:\Users\ala\Desktop\Plateforme des médecins\backend"
node scripts/initDatabase.js
```

**Résultat attendu :**
```
✅ MongoDB Connecté: localhost
📊 Base de données: plateforme-medecins
🔄 Initialisation de la base de données...
1. Création du compte administrateur...
   ✅ Compte admin créé:
      Email: admin@medecins.com
      Mot de passe: admin123
...
✅ Initialisation terminée avec succès !
```

---

## 🖥️ ÉTAPE 2 : Démarrer le Backend

### Terminal 1 - Backend

```bash
cd "C:\Users\ala\Desktop\Plateforme des médecins\backend"
npm run dev
```

**Résultat attendu :**
```
[nodemon] starting `node server.js`
✅ MongoDB Connecté: localhost
📊 Base de données: plateforme-medecins
Serveur démarré sur le port 5000
Mode: development
```

**✅ Le backend est maintenant actif sur http://localhost:5000**

---

## 🎨 ÉTAPE 3 : Démarrer le Frontend

### Terminal 2 - Frontend (NOUVEAU TERMINAL)

```bash
cd "C:\Users\ala\Desktop\Plateforme des médecins\frontend"
npm run dev
```

**Résultat attendu :**
```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**✅ Le frontend est maintenant actif sur http://localhost:5173**

---

## 🧪 ÉTAPE 4 : Tester l'Application

### 4.1 Ouvrir l'Application

Ouvrez votre navigateur et allez sur :
```
http://localhost:5173
```

Vous serez redirigé vers la page de connexion.

---

### 4.2 Test Admin

1. **Sur la page de connexion**, cliquez sur le bouton **"Admin"** (en haut à droite)

2. **Connectez-vous avec :**
   ```
   Email: admin@medecins.com
   Mot de passe: admin123
   ```

3. **Cliquez sur "Se connecter"**

4. **Vous devriez voir :**
   - Tableau de bord Admin avec statistiques
   - Menu latéral avec : Dashboard, Médecins, Abonnements, Notifications

5. **Testez les fonctionnalités :**
   - Cliquez sur "Médecins" → Voir la liste des médecins
   - Cliquez sur "Abonnements" → Voir les abonnements
   - Cliquez sur "Notifications" → Voir l'historique SMS

---

### 4.3 Test Médecin/Cabinet

1. **Déconnectez-vous** (bouton "Déconnexion Centrale" en bas du menu)

2. **Sur la page de connexion**, cliquez sur **"Cabinet"** (en haut à gauche)

3. **Connectez-vous avec :**
   ```
   Email: medecin@test.com
   Mot de passe: medecin123
   ```

4. **Vous devriez voir :**
   - Tableau de bord avec statistiques du cabinet
   - Menu latéral avec : Tableau de bord, Planning, Patients, Paramètres

5. **Testez les fonctionnalités :**

   **a) Dashboard :**
   - Voir les statistiques (RDV du jour, patients, etc.)
   - Voir les rendez-vous à venir

   **b) Planning :**
   - Cliquez sur "Planning" dans le menu
   - Cliquez sur un jour du calendrier → Créer un rendez-vous
   - Sélectionnez un patient, date, heure
   - Cliquez sur "Créer"
   - Cliquez sur un rendez-vous existant → Modifier ou Supprimer

   **c) Patients :**
   - Cliquez sur "Patients" dans le menu
   - Cliquez sur "+ Nouveau patient"
   - Remplissez le formulaire et créez un patient
   - Recherchez un patient dans la barre de recherche
   - Cliquez sur l'icône "Œil" → Voir l'historique
   - Cliquez sur l'icône "Crayon" → Modifier
   - Cliquez sur l'icône "Poubelle" → Supprimer

   **d) Paramètres :**
   - Cliquez sur "Paramètres" dans le menu
   - Modifiez les informations du cabinet
   - Configurez les horaires d'ouverture
   - Activez/désactivez les rappels automatiques
   - Cliquez sur "Enregistrer les paramètres"

---

## 🔍 Vérification dans MongoDB Compass

1. **Ouvrez MongoDB Compass**
2. **Connectez-vous à :** `mongodb://localhost:27017`
3. **Sélectionnez la base :** `plateforme-medecins`
4. **Vérifiez les collections :**
   - `users` → 2 documents (admin + médecin)
   - `cabinets` → 1 document
   - `patients` → 3 documents
   - `appointments` → 3 documents
   - `subscriptions` → 1 document

---

## 🛑 Arrêter les Serveurs

### Pour arrêter le Backend :
Dans le Terminal 1, appuyez sur : `Ctrl + C`

### Pour arrêter le Frontend :
Dans le Terminal 2, appuyez sur : `Ctrl + C`

---

## 📝 Commandes Rapides (Résumé)

### Initialisation (une seule fois)
```bash
cd backend
node scripts/initDatabase.js
```

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## 🐛 Résolution des Problèmes

### Erreur : "Cannot connect to MongoDB"
```bash
# Vérifiez que MongoDB est démarré
# Testez dans MongoDB Compass : mongodb://localhost:27017
```

### Erreur : "Port 5000 already in use"
```bash
# Changez le port dans backend/.env
PORT=5001
```

### Erreur : "Module not found"
```bash
# Réinstallez les dépendances
cd backend
npm install

cd ../frontend
npm install
```

### Le frontend ne se connecte pas au backend
```bash
# Vérifiez que le fichier frontend/.env existe avec :
VITE_API_URL=http://localhost:5000/api
```

---

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

---

## 🎯 URLs Importantes

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000/api
- **Test API** : http://localhost:5000 (devrait afficher "API Plateforme Médecins - Running")

---

## 📞 Comptes de Test

### Admin
```
Email: admin@medecins.com
Mot de passe: admin123
```

### Médecin
```
Email: medecin@test.com
Mot de passe: medecin123
```

---

**🎉 Bon test !**

