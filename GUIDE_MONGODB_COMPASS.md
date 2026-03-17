# Guide de Connexion MongoDB Compass

## 🔌 Connexion à MongoDB Compass

### 1. Vérifier que MongoDB est démarré

Assurez-vous que MongoDB est en cours d'exécution sur votre machine :
- Windows : Vérifiez dans les services Windows ou lancez `mongod`
- Le port par défaut est `27017`

### 2. Se connecter avec MongoDB Compass

1. **Ouvrir MongoDB Compass**
2. **Dans le champ de connexion**, utilisez :
   ```
   mongodb://localhost:27017
   ```
3. **Cliquez sur "Connect"**

### 3. Créer/Sélectionner la base de données

Une fois connecté :
1. Cliquez sur **"Create Database"** ou sélectionnez une base existante
2. **Nom de la base** : `plateforme-medecins`
3. **Collection initiale** : Vous pouvez créer une collection vide (elle sera créée automatiquement par l'application)

### 4. Collections qui seront créées automatiquement

Lorsque vous lancerez l'application backend, les collections suivantes seront créées automatiquement :
- `users` - Utilisateurs (admin, médecins, secrétaires)
- `cabinets` - Informations des cabinets
- `patients` - Liste des patients
- `appointments` - Rendez-vous
- `subscriptions` - Abonnements
- `notifications` - Historique des notifications SMS/WhatsApp

## 🚀 Initialiser la base de données avec des données de test

### Option 1 : Script d'initialisation (Recommandé)

1. **Ouvrir un terminal** dans le dossier `backend`
2. **Exécuter le script** :
   ```bash
   node scripts/initDatabase.js
   ```

Ce script va créer :
- ✅ Un compte **admin** : `admin@medecins.com` / `admin123`
- ✅ Un compte **médecin** : `medecin@test.com` / `medecin123`
- ✅ Un cabinet de test
- ✅ Des patients de test
- ✅ Des rendez-vous de test
- ✅ Un abonnement premium

### Option 2 : Créer manuellement dans MongoDB Compass

#### Créer un Admin

1. Sélectionnez la collection `users`
2. Cliquez sur **"Insert Document"**
3. Collez ce JSON (le mot de passe est déjà hashé) :

```json
{
  "email": "admin@medecins.com",
  "password": "$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq",
  "role": "admin",
  "nom": "Admin",
  "prenom": "Système",
  "isActive": true,
  "isApproved": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

⚠️ **Note** : Pour créer un mot de passe hashé, utilisez le script d'initialisation ou un outil en ligne de hashage bcrypt.

## 📊 Vérifier les données dans MongoDB Compass

### Après avoir lancé le script d'initialisation :

1. **Collection `users`** :
   - Vous devriez voir 2 documents (admin + médecin)

2. **Collection `cabinets`** :
   - Un cabinet "Cabinet Médical Dr. Dupont"

3. **Collection `patients`** :
   - 3 patients de test

4. **Collection `appointments`** :
   - 3 rendez-vous de test

5. **Collection `subscriptions`** :
   - Un abonnement premium

## 🔍 Requêtes utiles dans MongoDB Compass

### Trouver tous les médecins
```javascript
{ "role": "medecin" }
```

### Trouver tous les rendez-vous confirmés
```javascript
{ "statut": "confirme" }
```

### Trouver les patients d'un cabinet
```javascript
{ "cabinetId": ObjectId("...") }
```

## ⚙️ Configuration du Backend

Assurez-vous que le fichier `.env` dans `backend/` contient :

```env
MONGODB_URI=mongodb://localhost:27017/plateforme-medecins
```

## 🐛 Dépannage

### Erreur : "Cannot connect to MongoDB"

1. Vérifiez que MongoDB est démarré
2. Vérifiez le port (par défaut 27017)
3. Vérifiez que le firewall n'bloque pas la connexion

### Erreur : "Database not found"

C'est normal ! La base de données sera créée automatiquement lors de la première connexion.

### Erreur : "Authentication failed"

Si vous avez configuré l'authentification MongoDB, ajoutez les credentials dans l'URI :
```
mongodb://username:password@localhost:27017/plateforme-medecins
```

## 📝 Prochaines étapes

1. ✅ Connectez-vous à MongoDB Compass
2. ✅ Lancez le script d'initialisation : `node scripts/initDatabase.js`
3. ✅ Vérifiez les données dans Compass
4. ✅ Démarrez le backend : `npm start` ou `npm run dev`
5. ✅ Démarrez le frontend : `npm run dev`
6. ✅ Connectez-vous avec : `admin@medecins.com` / `admin123`

