# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack e-commerce application with:
- **Mobile**: React Native + Expo mobile app (currently implemented)
- **Backend**: Node.js REST API (to be implemented in `/back` directory)

## Mobile App (React Native + Expo)

### Technology Stack
- **Framework**: Expo ~53.0 with expo-router for file-based routing
- **UI**: NativeWind (TailwindCSS for React Native)
- **State Management**:
  - Zustand for local state (cart management)
  - TanStack Query (React Query) for server state
- **Styling**: Custom font family (FThin → FBlack) defined in tailwind config
- **Primary Color**: #0174D8
- **Path Alias**: `@/*` maps to `src/*`

### Project Structure
```
mobile/
├── app/                    # File-based routing (expo-router)
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── home/          # Home screen with product details [id]
│   │   ├── cart/          # Cart with payment flow
│   │   ├── search/        # Search functionality
│   │   ├── command/       # Orders
│   │   └── profile/       # Auth screens (login, register, forgot-password)
│   └── _layout.tsx        # Root layout with QueryClientProvider
├── src/
│   ├── api/               # API client (axios)
│   ├── components/        # Reusable UI components
│   ├── constants/         # Fonts, colors, images
│   ├── hooks/             # Custom hooks (useDebounced)
│   ├── stores/            # Zustand stores (useCartStore)
│   └── types/             # TypeScript types
└── assets/                # Static assets
```

### Common Commands (Mobile)
```bash
# Navigate to mobile directory first
cd mobile

# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Run on specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser

# Linting
npm run lint
```

### Key Architecture Patterns

#### Cart Management
Cart state is managed via Zustand store at [src/stores/useCartStore.ts](mobile/src/stores/useCartStore.ts):
- Add/remove items
- Increment/decrement quantity
- Calculate totals (includes fixed 3000 delivery fee)
- Items auto-remove when quantity reaches 0

#### API Configuration
Base API client in [src/api/client.ts](mobile/src/api/client.ts):
- Base URL: `https://localhost:3000/api`
- 10s timeout
- Axios instance pre-configured with JSON headers

#### Font System
Custom fonts are loaded in [app/_layout.tsx](mobile/app/_layout.tsx):
- 9 font weights (Thin, ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black)
- TailwindCSS classes: `font-fthin`, `font-fregular`, `font-fbold`, etc.
- Font scaling is disabled globally for consistent UI

#### Navigation
File-based routing with expo-router:
- Tab navigation defined in `app/(tabs)/`
- Dynamic routes: `[id].tsx` for product details
- Nested routes: `cart/payement/index.tsx` for payment flow

### Development Notes
- TypeScript strict mode enabled
- NativeWind preset configured in tailwind.config.js
- Babel module resolver for `@/` path alias
- React Native Reanimated plugin enabled for animations
- Status bar styling configured in root layout

## Backend (Node.js + Express + TypeScript)

### Technology Stack
- **Framework**: Express.js 5.x
- **Language**: TypeScript with strict mode
- **Architecture**: Clean Architecture suivant les principes SOLID
- **Base de données**: In-Memory (à remplacer par PostgreSQL/MongoDB)
- **CORS**: Activé pour le développement

### Principes SOLID Appliqués

#### S - Single Responsibility Principle
- **Controllers** (`src/controllers/`): Gèrent uniquement les requêtes/réponses HTTP
- **Services** (`src/services/`): Contiennent la logique métier
- **Repositories** (`src/repositories/`): Gèrent uniquement l'accès aux données

#### O - Open/Closed Principle
- Les interfaces permettent d'étendre les fonctionnalités sans modifier le code existant
- Ajout d'un nouveau repository = nouvelle implémentation de l'interface

#### L - Liskov Substitution Principle
- Toute implémentation de `IProductRepository` peut remplacer une autre
- `InMemoryProductRepository` peut être remplacé par `PostgresProductRepository` sans impact

#### I - Interface Segregation Principle
- Interfaces spécifiques et ciblées (ex: `IProductRepository`)

#### D - Dependency Inversion Principle
- Les classes dépendent d'abstractions (interfaces) et non d'implémentations concrètes
- Injection de dépendances via les constructeurs

### Project Structure
```
back/
├── src/
│   ├── config/              # Configuration (env, database)
│   ├── controllers/         # Contrôleurs HTTP
│   ├── services/            # Logique métier
│   ├── repositories/        # Accès aux données (interfaces + implémentations)
│   ├── routes/              # Définition des routes
│   ├── middlewares/         # Middlewares Express (logger, errorHandler)
│   ├── types/               # Types TypeScript centralisés
│   ├── app.ts               # Configuration Express avec DI
│   └── server.ts            # Point d'entrée
└── dist/                    # Code compilé
```

### Common Commands (Backend)
```bash
# Navigate to backend directory
cd back

# Install dependencies
npm install

# Development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### API Endpoints

#### Products
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Récupère un produit par ID
- `GET /api/products/search?q=query` - Recherche de produits
- `POST /api/products` - Créer un nouveau produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

#### Response Format
Toutes les réponses utilisent le type `ApiResponse<T>`:
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Key Architecture Patterns

#### Dependency Injection
Configuration dans [src/app.ts](back/src/app.ts):
```typescript
const productRepository = new InMemoryProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);
```

#### Repository Pattern
Interface [IProductRepository](back/src/repositories/IProductRepository.ts) avec implémentation [InMemoryProductRepository](back/src/repositories/InMemoryProductRepository.ts). Facilite le remplacement par une vraie base de données.

#### Service Layer
[ProductService](back/src/services/ProductService.ts) contient toute la logique métier et les validations, séparée des préoccupations HTTP.

### Development Notes
- TypeScript strict mode: `noImplicitAny`, `strictNullChecks`, etc.
- Path alias `@/*` configuré mais nécessite configuration runtime
- Middlewares: logger pour les requêtes, errorHandler global
- Variables d'environnement via `.env` (copier depuis `.env.example`)

## Working Across Mobile and Backend
- Mobile expects backend at `https://localhost:3000`
- Update [mobile/src/api/client.ts](mobile/src/api/client.ts) `IP_URL` when backend is deployed
- Backend should serve API under `/api` prefix
