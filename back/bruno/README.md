# E-Commerce API - Bruno Collection

Cette collection Bruno contient tous les endpoints de l'API E-Commerce.

## Structure

- **Auth/** : Endpoints d'authentification (Register, Login, Profile, etc.)
- **Users/** : Gestion des utilisateurs
- **Products/** : CRUD des produits
- **Categories/** : CRUD des catégories
- **Addresses/** : Gestion des adresses de livraison
- **PaymentMethods/** : Gestion des méthodes de paiement
- **Orders/** : Gestion des commandes
- **Payments/** : Gestion des paiements

## Variables d'environnement

- `baseUrl`: URL de base de l'API (default: http://localhost:3000)
- `accessToken`: Token JWT de l'utilisateur connecté
- `adminToken`: Token JWT de l'admin
- `userId`, `productId`, `categoryId`, etc.: IDs sauvegardés automatiquement

## Ordre d'exécution recommandé

1. Auth/Register ou Auth/Login
2. Categories/Get All Categories
3. Products/Get All Products
4. Addresses/Create Address (si nécessaire)
5. PaymentMethods/Create Payment Method (si nécessaire)
6. Orders/Create Order

## Notes

- Les tokens sont sauvegardés automatiquement après login/register
- Les IDs sont sauvegardés automatiquement après création
- Utilisez l'environnement "Local" pour le développement
