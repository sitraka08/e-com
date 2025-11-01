import { PrismaClient, Role } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      name: 'Administrateur',
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin créé:', admin.email);

  // Créer un vendeur
  const sellerPassword = await bcrypt.hash('seller123', 10);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@ecommerce.com' },
    update: {},
    create: {
      email: 'seller@ecommerce.com',
      password: sellerPassword,
      name: 'Vendeur Test',
      role: Role.SELLER,
    },
  });
  console.log('✅ Vendeur créé:', seller.email);

  // Créer un acheteur
  const buyerPassword = await bcrypt.hash('buyer123', 10);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@ecommerce.com' },
    update: {},
    create: {
      email: 'buyer@ecommerce.com',
      password: buyerPassword,
      name: 'Acheteur Test',
      role: Role.BUYER,
    },
  });
  console.log('✅ Acheteur créé:', buyer.email);

  // Créer des produits
  const products = [
    {
      name: 'Smartphone XYZ Pro',
      description: 'Un excellent smartphone avec 128GB de stockage, écran OLED 6.5"',
      price: 299.99,
      image: 'https://via.placeholder.com/300/0174D8/FFFFFF?text=Smartphone',
      category: 'Électronique',
      stock: 50,
      sellerId: seller.id,
    },
    {
      name: 'Laptop Ultra Performance',
      description: 'Ordinateur portable haute performance, 16GB RAM, SSD 512GB',
      price: 999.99,
      image: 'https://via.placeholder.com/300/0174D8/FFFFFF?text=Laptop',
      category: 'Électronique',
      stock: 30,
      sellerId: seller.id,
    },
    {
      name: 'Casque Audio Premium',
      description: 'Casque sans fil avec réduction de bruit active',
      price: 79.99,
      image: 'https://via.placeholder.com/300/0174D8/FFFFFF?text=Casque',
      category: 'Audio',
      stock: 100,
      sellerId: seller.id,
    },
    {
      name: 'Montre Connectée Sport',
      description: 'Montre intelligente avec suivi fitness et GPS',
      price: 149.99,
      image: 'https://via.placeholder.com/300/0174D8/FFFFFF?text=Montre',
      category: 'Accessoires',
      stock: 75,
      sellerId: seller.id,
    },
    {
      name: 'Tablette GraphicPro',
      description: 'Tablette graphique professionnelle pour designers',
      price: 199.99,
      image: 'https://via.placeholder.com/300/0174D8/FFFFFF?text=Tablette',
      category: 'Électronique',
      stock: 40,
      sellerId: seller.id,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`✅ Produit créé: ${created.name}`);
  }

  console.log('\n🎉 Seeding terminé avec succès!');
  console.log('\n📝 Comptes de test créés:');
  console.log('   Admin:    admin@ecommerce.com / admin123');
  console.log('   Vendeur:  seller@ecommerce.com / seller123');
  console.log('   Acheteur: buyer@ecommerce.com / buyer123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
