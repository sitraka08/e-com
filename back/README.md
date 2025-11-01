# Backend E-Commerce - API REST

API REST pour l'application e-commerce mobile, développée avec **Node.js**, **Express**, **TypeScript**, **Prisma** et **MySQL** en suivant les principes **SOLID**.

## Fonctionnalités

✅ **Authentification JWT** avec rôles (Admin, Vendeur, Acheteur)
✅ **CRUD Produits** avec gestion par vendeur
✅ **Base de données MySQL** avec Prisma ORM
✅ **Architecture Clean** suivant les principes SOLID
✅ **Injection de dépendances** pour faciliter les tests
✅ **Middlewares** d'authentification et d'autorisation

## Principes SOLID Appliqués

### S - Single Responsibility Principle (Responsabilité Unique)
- **Controllers** : Gèrent uniquement les requêtes/réponses HTTP
- **Services** : Contiennent la logique métier
- **Repositories** : Gèrent uniquement l'accès aux données

### O - Open/Closed Principle (Ouvert/Fermé)
- Les interfaces permettent d'étendre les fonctionnalités sans modifier le code existant
- Nouveau repository = nouvelle implémentation de l'interface

### L - Liskov Substitution Principle (Substitution de Liskov)
- Toute implémentation de `IProductRepository` peut remplacer une autre
- `InMemoryProductRepository` peut être remplacé par `PrismaProductRepository` sans changer le code

### I - Interface Segregation Principle (Ségrégation des Interfaces)
- Interfaces spécifiques et ciblées (`IProductRepository`)
- Pas d'interfaces "fourre-tout"

### D - Dependency Inversion Principle (Inversion de Dépendances)
- Les classes dépendent d'abstractions (interfaces) et non d'implémentations
- Injection de dépendances dans les constructeurs

## Structure du Projet

```
back/
├── src/
│   ├── config/              # Configuration (env, prisma)
│   │   ├── env.ts          # Variables d'environnement
│   │   └── prisma.ts       # Client Prisma singleton
│   ├── controllers/         # Contrôleurs HTTP
│   │   ├── ProductController.ts
│   │   └── AuthController.ts
│   ├── services/            # Logique métier
│   │   ├── ProductService.ts
│   │   └── AuthService.ts
│   ├── repositories/        # Accès aux données (Pattern Repository)
│   │   ├── IProductRepository.ts       # Interface
│   │   ├── InMemoryProductRepository.ts # Implémentation mémoire
│   │   └── PrismaProductRepository.ts   # Implémentation Prisma
│   ├── routes/              # Définition des routes
│   │   ├── productRoutes.ts
│   │   └── authRoutes.ts
│   ├── middlewares/         # Middlewares Express
│   │   ├── auth.ts         # Authentification JWT
│   │   ├── logger.ts       # Logging
│   │   └── errorHandler.ts # Gestion d'erreurs
│   ├── types/               # Types TypeScript
│   │   └── index.ts        # Types centralisés
│   ├── generated/           # Code généré par Prisma
│   │   └── prisma/         # Client Prisma
│   ├── app.ts               # Configuration Express avec DI
│   └── server.ts            # Point d'entrée
├── prisma/
│   ├── schema.prisma        # Schéma de base de données
│   ├── migrations/          # Migrations
│   └── seed.ts              # Script de peuplement
├── dist/                    # Code compilé
├── .env                     # Variables d'environnement (ne pas commit)
├── .env.example             # Exemple de variables
├── prisma.config.ts         # Configuration Prisma
├── tsconfig.json            # Configuration TypeScript
└── package.json             # Dépendances
```

## Installation

### Prérequis
- Node.js 18+ installé
- MySQL 8+ installé et démarré
- Base de données MySQL créée

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Éditer .env avec vos configurations MySQL
# DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# 4. Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE ecommerce;
exit;

# 5. Configurer Prisma (générer + migrer + peupler)
npm run db:setup
```

## Commandes

### Développement
```bash
# Démarrer le serveur en mode développement (auto-reload)
npm run dev
```

### Base de données (Prisma)
```bash
# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer une migration
npm run prisma:migrate

# Peupler la base de données avec des données de test
npm run prisma:seed

# Ouvrir Prisma Studio (interface graphique)
npm run prisma:studio

# Tout configurer d'un coup (generate + migrate + seed)
npm run db:setup
```

### Production
```bash
# Build de production
npm run build

# Démarrer en production
npm start
```

## API Endpoints

### Authentification (`/api/auth`)

#### Inscription
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "0123456789",      // Optionnel
  "address": "123 Main St",   // Optionnel
  "role": "BUYER"             // ADMIN, SELLER, ou BUYER (défaut: BUYER)
}
```

#### Connexion
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Réponse:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "BUYER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Profil utilisateur (protégé)
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

### Produits (`/api/products`)

- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Récupère un produit par ID
- `GET /api/products/search?q=query` - Recherche de produits
- `POST /api/products` - Créer un nouveau produit (nécessite authentification)
- `PUT /api/products/:id` - Mettre à jour un produit (nécessite authentification)
- `DELETE /api/products/:id` - Supprimer un produit (nécessite authentification)

### Format de Réponse

Toutes les réponses suivent le format :

```json
{
  "success": true,
  "data": { ... },
  "message": "Message optionnel"
}
```

En cas d'erreur :

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

## Technologies Utilisées

- **Node.js** : Runtime JavaScript
- **Express 5** : Framework web
- **TypeScript** : Typage statique fort
- **Prisma** : ORM moderne pour TypeScript
- **MySQL** : Base de données relationnelle
- **JWT (jsonwebtoken)** : Authentification sécurisée
- **bcrypt** : Hashage de mots de passe
- **CORS** : Gestion des CORS
- **dotenv** : Gestion des variables d'environnement

## Modèle de Base de Données

### User (Utilisateur)
- `id`: Identifiant unique
- `email`: Email (unique)
- `password`: Mot de passe hashé
- `name`: Nom complet
- `phone`: Téléphone (optionnel)
- `address`: Adresse (optionnel)
- `role`: Rôle (ADMIN, SELLER, BUYER)

### Product (Produit)
- `id`: Identifiant unique
- `name`: Nom du produit
- `description`: Description
- `price`: Prix
- `image`: URL de l'image
- `category`: Catégorie
- `stock`: Stock disponible
- `sellerId`: ID du vendeur (relation avec User)

### Order (Commande)
- `id`: Identifiant unique
- `userId`: ID de l'acheteur
- `total`: Montant total
- `status`: Statut (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

### OrderItem (Article de commande)
- `id`: Identifiant unique
- `orderId`: ID de la commande
- `productId`: ID du produit
- `quantity`: Quantité
- `price`: Prix au moment de l'achat

## Comptes de Test

Après avoir exécuté `npm run prisma:seed`, vous pouvez utiliser ces comptes:

| Rôle     | Email                    | Mot de passe |
|----------|--------------------------|--------------|
| Admin    | admin@ecommerce.com      | admin123     |
| Vendeur  | seller@ecommerce.com     | seller123    |
| Acheteur | buyer@ecommerce.com      | buyer123     |

## Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Authentification JWT avec expiration
- ✅ Middleware d'authentification pour routes protégées
- ✅ Middleware d'autorisation basé sur les rôles
- ✅ Validation des données entrantes

## Prochaines Étapes

- [x] Ajouter une vraie base de données (MySQL avec Prisma)
- [x] Implémenter l'authentification JWT avec rôles
- [ ] Ajouter la gestion complète des commandes (CRUD)
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Ajouter la validation des données (Zod)
- [ ] Ajouter la pagination pour les listes
- [ ] Ajouter le rate limiting
- [ ] Ajouter l'upload d'images pour les produits
- [ ] Implémenter les permissions granulaires (vendeur ne peut modifier que ses produits)
- [ ] Ajouter un système de notifications
- [ ] Implémenter le refresh token
