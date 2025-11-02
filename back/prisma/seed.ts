import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  const categories = [
    { name: 'MODE', slug: 'mode', description: 'Vêtements et accessoires de mode', icon: 'Shirt' },
    { name: 'INFORMATIQUE', slug: 'informatique', description: 'Ordinateurs et équipements informatiques', icon: 'Laptop' },
    { name: 'MAISON', slug: 'maison', description: 'Articles pour la maison', icon: 'Home' },
    { name: 'BEAUTE', slug: 'beaute', description: 'Produits de beauté et cosmétiques', icon: 'Sparkles' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log(`✅ Catégorie créée: ${cat.name}`);
  }

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin créé:', admin.email);

  const clientPassword = await bcrypt.hash('Client123!', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@ecommerce.com' },
    update: {},
    create: {
      email: 'client@ecommerce.com',
      password: clientPassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'CLIENT',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Client créé:', client.email);

  const informatique = await prisma.category.findUnique({ where: { slug: 'informatique' } });
  const mode = await prisma.category.findUnique({ where: { slug: 'mode' } });

  if (informatique && mode) {
    const products = [
      {
        name: 'Smartphone XYZ Pro',
        description: 'Excellent smartphone 128GB, écran OLED 6.5"',
        price: 29999,
        images: JSON.stringify(['https://via.placeholder.com/300/0174D8/FFF?text=Phone']),
        stock: 50,
        categoryId: informatique.id,
      },
      {
        name: 'Laptop Ultra Performance',
        description: 'Ordinateur portable 16GB RAM, SSD 512GB',
        price: 99999,
        images: JSON.stringify(['https://via.placeholder.com/300/0174D8/FFF?text=Laptop']),
        stock: 30,
        categoryId: informatique.id,
      },
      {
        name: 'T-Shirt Premium',
        description: 'T-shirt en coton bio, coupe moderne',
        price: 2999,
        images: JSON.stringify(['https://via.placeholder.com/300/0174D8/FFF?text=TShirt']),
        stock: 100,
        categoryId: mode.id,
      },
    ];

    for (const product of products) {
      await prisma.product.create({ data: product });
      console.log(`✅ Produit créé: ${product.name}`);
    }
  }

  // Créer une adresse pour le client
  await prisma.address.create({
    data: {
      userId: client.id,
      label: 'Maison',
      fullName: 'Marie Dupont',
      phone: '+261340000000',
      street: '123 Rue Example',
      city: 'Antananarivo',
      region: 'Analamanga',
      postalCode: '101',
      isDefault: true,
    },
  });
  console.log('✅ Adresse créée pour le client');

  // Créer une méthode de paiement pour le client
  await prisma.paymentMethod.create({
    data: {
      userId: client.id,
      type: 'MOBILE_MONEY',
      label: 'Orange Money',
      details: JSON.stringify({ phone: '+261340000000', operatorName: 'Orange' }),
      isDefault: true,
    },
  });
  console.log('✅ Méthode de paiement créée pour le client');

  console.log('\n🎉 Seeding terminé avec succès!');
  console.log('\n📝 Comptes de test créés:');
  console.log('   Admin:  admin@ecommerce.com / Admin123!');
  console.log('   Client: client@ecommerce.com / Client123!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
