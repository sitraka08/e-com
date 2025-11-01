# Guide de Démarrage Rapide

## Configuration Rapide (5 minutes)

### 1. Installation

```bash
cd back
npm install
```

### 2. Configuration Base de Données

```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE ecommerce;
exit;
```

### 3. Configuration Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et modifier si nécessaire:
# DATABASE_URL="mysql://root:password@localhost:3306/ecommerce"
```

### 4. Initialiser Prisma

```bash
# Tout en une commande:
npm run db:setup

# Ou étape par étape:
npm run prisma:generate  # Générer le client Prisma
npm run prisma:migrate   # Appliquer les migrations
npm run prisma:seed      # Peupler avec des données de test
```

### 5. Démarrer le Serveur

```bash
npm run dev
```

Le serveur démarre sur http://localhost:3000

## Tester l'API

### 1. Test de connexion

```bash
curl http://localhost:3000
```

### 2. Connexion utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@ecommerce.com",
    "password": "buyer123"
  }'
```

Vous recevrez un token JWT. Copiez-le pour les requêtes suivantes.

### 3. Récupérer les produits

```bash
curl http://localhost:3000/api/products
```

### 4. Récupérer le profil (avec authentification)

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

## Comptes de Test

| Rôle     | Email                    | Mot de passe |
|----------|--------------------------|--------------|
| Admin    | admin@ecommerce.com      | admin123     |
| Vendeur  | seller@ecommerce.com     | seller123    |
| Acheteur | buyer@ecommerce.com      | buyer123     |

## Outils Utiles

### Prisma Studio (Interface graphique BD)

```bash
npm run prisma:studio
```

Ouvre une interface graphique à http://localhost:5555 pour visualiser et éditer les données.

### Voir les logs de la BD

Les logs SQL de Prisma s'affichent dans la console du serveur en mode développement.

## Résolution de Problèmes

### Erreur: Cannot connect to MySQL server

```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql  # Linux
brew services list           # macOS

# Démarrer MySQL si nécessaire
sudo systemctl start mysql   # Linux
brew services start mysql    # macOS
```

### Erreur: Database 'ecommerce' does not exist

```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE ecommerce;"
```

### Erreur: Access denied for user 'root'

Modifiez `DATABASE_URL` dans `.env` avec vos identifiants MySQL:
```
DATABASE_URL="mysql://VOTRE_USER:VOTRE_PASSWORD@localhost:3306/ecommerce"
```

## Prochaines Étapes

1. Explorez l'API avec Postman ou curl
2. Consultez le [README.md](README.md) pour la documentation complète
3. Regardez le code dans `src/` pour comprendre l'architecture
4. Explorez le schéma Prisma dans `prisma/schema.prisma`
