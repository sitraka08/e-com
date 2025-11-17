# Projet E-Commerce - Résumé Complet

## Vue d'Ensemble

Projet full-stack e-commerce avec **mobile React Native/Expo** et **backend Node.js/Express/Prisma/MySQL**.

## Architecture Globale

```
e-commerce/
├── mobile/          # Application mobile (React Native + Expo)
├── back/            # API REST backend (Node.js + Express + Prisma + MySQL)
└── CLAUDE.md        # Documentation pour Claude Code
```

## 🎯 Fonctionnalités Implémentées

### Backend ✅
- **Authentification JWT** avec 3 rôles (ADMIN, SELLER, CLIENT)
- **Système d'approbation vendeur** avec workflow complet
- **CRUD Produits** complet avec gestion par vendeur
- **Base de données MySQL** avec Prisma ORM
- **Architecture SOLID** avec injection de dépendances
- **Middlewares** d'authentification et d'autorisation
- **Guards de rôles** pour sécuriser les endpoints
- **Seed data** avec comptes de test

### Mobile ✅
- **Authentification complète** (Login, Register, Forgot Password, Reset Password)
- **Inscription vendeur** avec formulaire de boutique
- **Écran d'attente d'approbation** pour les vendeurs (pending-approval)
- **Navigation** avec expo-router (file-based routing)
- **Guards de navigation** basés sur les rôles
- **State management** avec Zustand (cart, auth) et TanStack Query (server)
- **Styling** avec NativeWind (TailwindCSS)
- **Écrans** : Home, Search, Cart, Orders, Profile, Auth (login/register/forgot-password)
- **Client API** Axios configuré avec intercepteurs JWT

## 🚀 Démarrage Rapide

### Backend

```bash
cd back
npm install
cp .env.example .env
# Créer la base MySQL 'ecommerce'
npm run db:setup
npm run dev
```

Le serveur démarre sur http://localhost:3000

### Mobile

```bash
cd mobile
npm install
npm start
```

## 🔑 Comptes de Test (Backend)

| Rôle     | Email                    | Mot de passe |
|----------|--------------------------|--------------|
| Admin    | admin@ecommerce.com      | admin123     |
| Vendeur  | seller@ecommerce.com     | seller123    |
| Acheteur | buyer@ecommerce.com      | buyer123     |

## 👥 Rôles et Permissions

### ADMIN (Administrateur)
- ✅ Visualiser, activer, suspendre ou supprimer les comptes utilisateurs
- ✅ Gérer les demandes de création de comptes vendeurs (approuver/rejeter)
- ✅ Superviser les activités globales (ventes, paiements, produits)
- ✅ Créer et gérer les catégories de produits

### SELLER (Vendeur)
- ✅ Créer, modifier et supprimer ses propres produits
- ✅ Gérer le profil de sa boutique (nom, description, logo)
- ✅ Suivre les ventes et l'état des paiements
- ✅ Organiser les articles par catégories
- ⚠️ **Nécessite l'approbation de l'admin** pour devenir vendeur

### CLIENT (Acheteur)
- ✅ Parcourir les produits par catégorie ou recherche
- ✅ Ajouter des articles au panier et valider les commandes
- ✅ Gérer les produits favoris et les paniers enregistrés
- ✅ Choisir un ou plusieurs modes de paiement
- ✅ Gérer ses adresses de livraison
- ✅ Consulter l'historique de commandes et paiements
- ✅ Modifier et sécuriser son profil personnel

### Flux d'Approbation Vendeur
1. **Inscription**: Utilisateur s'inscrit avec option "Je souhaite devenir vendeur"
2. **Statut initial**: Créé avec rôle `CLIENT` + `SellerRequest` en statut `PENDING`
3. **Écran d'attente**: Redirigé vers [pending-approval.tsx](mobile/app/(seller)/pending-approval.tsx)
4. **Approbation admin**: Admin approuve → Rôle devient `SELLER` + création du compte `Seller`
5. **Accès vendeur**: Utilisateur peut rafraîchir le statut et accéder au dashboard vendeur

## 📡 Endpoints API Principaux

### Authentification
- `POST /api/auth/register` - Inscription (avec option vendeur: `isSeller`, `storeName`, `storeDescription`)
- `POST /api/auth/login` - Connexion (retourne JWT + user + sellerRequest si applicable)
- `POST /api/auth/forgot-password` - Demande de réinitialisation de mot de passe (envoie OTP)
- `POST /api/auth/reset-password` - Réinitialisation avec OTP
- `GET /api/auth/profile` - Profil utilisateur (protégé, JWT requis)

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/search?q=query` - Recherche
- `POST /api/products` - Créer un produit (SELLER uniquement)
- `PUT /api/products/:id` - Mettre à jour (SELLER, ses produits uniquement)
- `DELETE /api/products/:id` - Supprimer (SELLER, ses produits uniquement)

### Vendeurs (SELLER role)
- `GET /api/sellers/request/me` - Statut de ma demande vendeur
- `GET /api/sellers/me` - Mon profil vendeur
- `PUT /api/sellers/me` - Mettre à jour mon profil vendeur
- `GET /api/sellers/me/stats` - Mes statistiques de vente
- `GET /api/sellers/me/products` - Mes produits

### Administration (ADMIN role)
- `GET /api/admin/seller-requests` - Liste des demandes vendeur en attente
- `POST /api/admin/seller-requests/:id/approve` - Approuver une demande vendeur
- `POST /api/admin/seller-requests/:id/reject` - Rejeter une demande vendeur (avec raison)
- `GET /api/admin/users` - Liste tous les utilisateurs
- `PUT /api/admin/users/:id/suspend` - Suspendre un utilisateur
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur
- `POST /api/admin/categories` - Créer une catégorie

## 🏗️ Architecture Backend (Principes SOLID)

### S - Single Responsibility
- **Controllers** : Gestion HTTP uniquement
- **Services** : Logique métier uniquement
- **Repositories** : Accès données uniquement

### O - Open/Closed
- Interfaces permettant l'extension sans modification

### L - Liskov Substitution
- `InMemoryProductRepository` ↔️ `PrismaProductRepository`

### I - Interface Segregation
- Interfaces ciblées et spécifiques

### D - Dependency Inversion
- Dépendance sur abstractions (interfaces)
- Injection de dépendances via constructeurs

## 🛠️ Technologies

### Backend
- Node.js 18+
- Express 5
- TypeScript
- Prisma ORM
- MySQL 8+
- JWT + bcrypt
- CORS

### Mobile
- React Native
- Expo 53
- TypeScript
- NativeWind (TailwindCSS)
- Zustand
- TanStack Query
- Axios

## 📂 Structure Backend

```
back/src/
├── config/          # Configuration (env, prisma)
├── controllers/     # Contrôleurs HTTP
├── services/        # Logique métier
├── repositories/    # Accès données (interfaces + implémentations)
├── routes/          # Définition routes
├── middlewares/     # Middlewares (auth, logger, errorHandler)
├── types/           # Types TypeScript
├── generated/       # Client Prisma généré
├── app.ts           # Configuration Express
└── server.ts        # Point d'entrée
```

## 📂 Structure Mobile

```
mobile/
├── app/             # File-based routing (expo-router)
│   └── (tabs)/      # Navigation par onglets
├── src/
│   ├── api/         # Client Axios
│   ├── components/  # Composants réutilisables
│   ├── constants/   # Fonts, colors, images
│   ├── hooks/       # Hooks personnalisés
│   ├── stores/      # Stores Zustand (cart)
│   └── types/       # Types TypeScript
└── assets/          # Images, fonts
```

## 🗄️ Modèle de Données

### User
- **Champs**: id, firstName, lastName, email (unique), password (hashé bcrypt), role, status, createdAt, updatedAt, lastLoginAt
- **Rôles**: ADMIN, SELLER, CLIENT (défaut: CLIENT)
- **Statuts**: ACTIVE, SUSPENDED, PENDING_VALIDATION (défaut: PENDING_VALIDATION)
- **Relations**: sellerRequests[], seller?, addresses[], orders[], favoriteProducts[], carts[]

### SellerRequest
- **Champs**: id, userId, storeName, storeDescription, businessRegistration?, status, rejectionReason?, reviewedBy?, reviewedAt?, createdAt, updatedAt
- **Statuts**: PENDING, APPROVED, REJECTED (défaut: PENDING)
- **Relations**: user (User), reviewedByAdmin? (User)
- **Usage**: Demande de création de compte vendeur, approuvée par admin

### Seller
- **Champs**: id, userId (unique), storeName, storeDescription?, storeLogo?, commissionRate (défaut: 0.10), isApproved (défaut: false), createdAt, updatedAt
- **Relations**: user (User), products[]
- **Création**: Automatique lors de l'approbation d'une SellerRequest par l'admin

### Product
- **Champs**: id, sellerId, name, description, price, stock, category, images[], createdAt, updatedAt
- **Relations**: seller (Seller), orderItems[], favoriteByUsers[]
- **Permissions**: Seul le vendeur propriétaire peut modifier/supprimer

### Order
- **Champs**: id, buyerId, totalAmount, deliveryFee, status, paymentMethod, shippingAddressId, createdAt, updatedAt
- **Statuts**: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- **Relations**: buyer (User), items (OrderItem[]), shippingAddress (Address)

### OrderItem
- **Champs**: id, orderId, productId, quantity, priceAtPurchase
- **Relations**: order (Order), product (Product)
- **Usage**: Relation many-to-many entre Order et Product, avec snapshot du prix

### Address
- **Champs**: id, userId, recipientName, phoneNumber, street, city, postalCode, country, isDefault
- **Relations**: user (User)
- **Usage**: Adresses de livraison de l'utilisateur

### Category
- **Champs**: id, name, description?, createdAt, updatedAt
- **Relations**: products[]
- **Permissions**: Seul ADMIN peut créer/modifier/supprimer

## 🔒 Sécurité

- ✅ Hashage bcrypt (10 rounds)
- ✅ JWT avec expiration configurable (défaut: 7 jours)
- ✅ Middleware d'authentification (vérifie le token JWT)
- ✅ Middleware d'autorisation par rôle (ADMIN, SELLER, CLIENT)
- ✅ Validation des données (Zod sur mobile, validations manuelles backend)
- ✅ Système d'approbation vendeur (empêche les vendeurs non autorisés)
- ✅ Vérification de statut utilisateur (SUSPENDED ne peut pas se connecter)
- ✅ Guards de navigation par rôle (mobile)
- ✅ SecureStore pour stocker les tokens JWT (mobile)

## 📋 Prochaines Étapes

### Backend
- [ ] Gestion complète des commandes (CRUD)
- [ ] Tests unitaires et d'intégration
- [ ] Validation avec Zod
- [ ] Pagination
- [ ] Rate limiting
- [ ] Upload d'images
- [ ] Permissions granulaires (seller peut modifier uniquement ses produits)
- [ ] Refresh tokens

### Mobile
- [ ] Intégration complète avec l'API backend
- [ ] Implémentation du flux d'authentification
- [ ] Gestion des commandes
- [ ] Profil utilisateur complet
- [ ] Gestion des erreurs réseau
- [ ] States de chargement
- [ ] Images des produits depuis l'API

### Connexion Mobile ↔️ Backend
- [ ] Mettre à jour `mobile/src/api/client.ts` avec l'URL correcte
- [ ] Implémenter le stockage sécurisé du JWT (SecureStore)
- [ ] Intercepteurs Axios pour l'authentification
- [ ] Gestion du refresh token

## 📚 Documentation

- `CLAUDE.md` - Guide complet pour Claude Code
- `back/README.md` - Documentation backend détaillée
- `back/QUICKSTART.md` - Démarrage rapide backend
- `mobile/README.md` - Documentation mobile Expo

## 🎓 Points d'Apprentissage

### Architecture
- Principes SOLID en pratique
- Clean Architecture
- Dependency Injection
- Repository Pattern

### Backend
- Prisma ORM avec MySQL
- Authentification JWT
- Middleware Express
- TypeScript strict mode

### Mobile
- Expo Router (file-based routing)
- State management (Zustand + React Query)
- NativeWind styling
- Navigation patterns

## 🤝 Contribution

Ce projet est conçu pour être éducatif et évolutif. Chaque composant est modulaire et peut être étendu ou remplacé facilement grâce aux principes SOLID appliqués.

## 📝 Notes

- Le backend utilise une base MySQL locale
- Les mots de passe de test sont volontairement simples (à ne PAS utiliser en production)
- L'API mobile pointe actuellement vers localhost (à changer pour un déploiement réel)
- Les images des produits utilisent des placeholders
