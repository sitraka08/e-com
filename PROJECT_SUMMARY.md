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
- **Authentification JWT** avec 3 rôles (Admin, Seller, Buyer)
- **CRUD Produits** complet avec gestion par vendeur
- **Base de données MySQL** avec Prisma ORM
- **Architecture SOLID** avec injection de dépendances
- **Middlewares** d'authentification et d'autorisation
- **Seed data** avec comptes de test

### Mobile ✅
- **Navigation** avec expo-router (file-based routing)
- **State management** avec Zustand (cart) et TanStack Query (server)
- **Styling** avec NativeWind (TailwindCSS)
- **Écrans** : Home, Search, Cart, Orders, Profile
- **Client API** Axios configuré

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

## 📡 Endpoints API Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion (retourne JWT)
- `GET /api/auth/profile` - Profil utilisateur (protégé)

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/search?q=query` - Recherche
- `POST /api/products` - Créer un produit (auth requise)
- `PUT /api/products/:id` - Mettre à jour (auth requise)
- `DELETE /api/products/:id` - Supprimer (auth requise)

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
- Rôles : ADMIN, SELLER, BUYER
- Email unique
- Mot de passe hashé (bcrypt)

### Product
- Lié à un seller (User)
- Stock, prix, catégorie

### Order
- Lié à un buyer (User)
- Status : PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED

### OrderItem
- Relation many-to-many entre Order et Product

## 🔒 Sécurité

- ✅ Hashage bcrypt (10 rounds)
- ✅ JWT avec expiration configurable
- ✅ Middleware d'authentification
- ✅ Middleware d'autorisation par rôle
- ✅ Validation des données

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
