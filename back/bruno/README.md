# E-Commerce API - Bruno Collection Complète

Cette collection Bruno contient **TOUS** les 55 endpoints de l'API E-Commerce avec gestion complète des rôles.

## 📁 Structure (55 requêtes)

### 🔐 Auth (5 requêtes)
- Register, Login, Get Profile ✅ PUBLIC/AUTHENTICATED
- Forgot Password, Reset Password ✅ PUBLIC

### 👤 Users (7 requêtes - ADMIN UNIQUEMENT)
- Get All Users, Get User by ID
- Update User, Delete User
- Validate User, Suspend User, Activate User

### 📦 Products (8 requêtes)
- Get All, Search, Get by ID ✅ PUBLIC
- Create, Update, Delete ⚠️ ADMIN
- Update Stock, Get Low Stock ⚠️ ADMIN

### 🏷️ Categories (6 requêtes)
- Get All, Get by ID, Get by Slug ✅ PUBLIC
- Create, Update, Delete ⚠️ ADMIN

### 📍 Addresses (6 requêtes - AUTHENTICATED)
- Create, Get My Addresses, Get by ID
- Update, Delete, Set Default

### 💳 Payment Methods (6 requêtes - AUTHENTICATED)
- Create, Get My Payment Methods, Get by ID
- Update, Delete, Set Default

### 🛒 Orders (8 requêtes)
- Create Order, Get All, Get by ID, Get by Number ✅ AUTHENTICATED
- Cancel Order ✅ AUTHENTICATED
- Update Status, Get Stats, Get Unpaid ⚠️ ADMIN

### 💰 Payments (4 requêtes)
- Process Payment, Get Order Payments ✅ AUTHENTICATED
- Get All Payments, Get Payment by ID ⚠️ ADMIN

## 🎯 Permissions

- ✅ **PUBLIC** : Accessible sans authentification
- 🔑 **AUTHENTICATED** : Requiert `accessToken` (CLIENT ou ADMIN)
- ⚠️ **ADMIN** : Requiert `adminToken` uniquement

## 🔑 Variables d'environnement

```
baseUrl: http://localhost:3000
accessToken: (auto-sauvegardé après login CLIENT)
adminToken: (auto-sauvegardé après login ADMIN)
userId, productId, categoryId, addressId, paymentMethodId, orderId, etc.
```

## 🚀 Ordre d'exécution recommandé

### Flow CLIENT complet
1. **Auth/Register** ou **Auth/Login** (client@ecommerce.com / Client123!)
2. **Categories/Get All Categories** (récupère categoryId)
3. **Products/Get All Products** (récupère productId)
4. **Addresses/Create Address** (crée une adresse de livraison)
5. **PaymentMethods/Create Payment Method** (ajoute un moyen de paiement)
6. **Orders/Create Order** (passe une commande)
7. **Payments/Process Payment** (effectue un paiement)
8. **Orders/Get My Orders** (consulte ses commandes)

### Flow ADMIN complet
1. **Auth/Login** (admin@ecommerce.com / Admin123!)
2. **Products/Create Product** (ajoute un nouveau produit)
3. **Categories/Create Category** (ajoute une catégorie)
4. **Orders/Get All Orders** (voir toutes les commandes)
5. **Orders/Update Order Status** (passe en CONFIRMED → SHIPPED → DELIVERED)
6. **Orders/Get Stats** (statistiques des ventes)
7. **Users/Get All Users** (gestion utilisateurs)

## 📝 Comptes de test

```
Admin:  admin@ecommerce.com / Admin123!
Client: client@ecommerce.com / Client123!
```

## 🖼️ Images des produits

L'API supporte **2 modes** pour gérer les images :

### Mode 1: Upload local avec FormData (✅ RECOMMANDÉ POUR LE TEST)
Les endpoints Create/Update Product acceptent le multipart/form-data pour uploader des images locales.

**Avec Bruno:**
1. Changez le body type en "Multipart Form"
2. Ajoutez vos champs (name, description, price, stock, categoryId)
3. Cliquez sur "+ Add File" et sélectionnez vos images (field name: `images`)
4. Jusqu'à 5 images (JPEG, PNG, GIF, WebP - max 5MB chacune)

Les images uploadées sont stockées dans `/back/public/uploads/products/` et accessibles via:
```
http://localhost:3000/uploads/products/nom-fichier.jpg
```

**Avec expo-image-picker (React Native):**
```javascript
// 1. Sélectionner l'image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 1,
});

// 2. Créer FormData
const formData = new FormData();
formData.append('name', 'Nouveau Produit');
formData.append('description', 'Description');
formData.append('price', '15000');
formData.append('stock', '25');
formData.append('categoryId', '1');

// 3. Ajouter l'image
formData.append('images', {
  uri: result.uri,
  type: 'image/jpeg',
  name: 'product.jpg',
} as any);

// 4. Envoyer
await axios.post('/api/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### Mode 2: URLs d'images (JSON)
Vous pouvez aussi envoyer des URLs d'images hébergées ailleurs (Unsplash, Cloudinary, etc.)

```json
{
  "name": "Nouveau Produit",
  "description": "Description",
  "price": 15000,
  "stock": 25,
  "categoryId": 1,
  "images": [
    "https://images.unsplash.com/photo-xxx?w=400",
    "https://images.unsplash.com/photo-yyy?w=400"
  ]
}
```

**Process avec service cloud:**
1. Prendre la photo avec `expo-image-picker`
2. Uploader vers Cloudinary/AWS S3/Firebase Storage
3. Récupérer l'URL permanente
4. Envoyer le tableau d'URLs au backend en JSON

## 💡 Notes importantes

- Les tokens sont sauvegardés automatiquement après login/register
- Les IDs sont sauvegardés automatiquement après création
- Les tests Bruno vérifient les codes HTTP (200, 201, 401, 403, 404)
- Messages d'erreur en français avec codes HTTP corrects
- Support multi-paiement (paiements partiels autorisés)
