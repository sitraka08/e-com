import {
  PrismaClient,
  UserRole,
  UserStatus,
  SellerRequestStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  const categories = [
    {
      id: 1,
      name: "Électronique",
      slug: "electronique",
      description: "Smartphones, ordinateurs, accessoires tech",
      icon: "Computer",
    },
    {
      id: 2,
      name: "Mode",
      slug: "mode",
      description: "Vêtements, chaussures, accessoires de mode",
      icon: "Shirt",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} catégories créées`);

  const password = await bcrypt.hash("demo", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ecommerce.com" },
    update: {},
    create: {
      email: "admin@ecommerce.com",
      password,
      firstName: "Admin",
      lastName: "Principal",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log("✅ Admin créé:", admin.email);

  const client = await prisma.user.upsert({
    where: { email: "client@ecommerce.com" },
    update: {},
    create: {
      email: "client@ecommerce.com",
      password,
      firstName: "Jean",
      lastName: "Rakoto",
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
  });
  console.log("✅ Client créé:", client.email);

  const sellerUser = await prisma.user.upsert({
    where: { email: "seller@ecommerce.com" },
    update: {},
    create: {
      email: "seller@ecommerce.com",
      password,
      firstName: "Marie",
      lastName: "Rasoa",
      role: UserRole.SELLER,
      status: UserStatus.ACTIVE,
    },
  });
  console.log("✅ Seller user créé:", sellerUser.email);

  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      storeName: "TechStore Madagascar",
      storeDescription: "Votre boutique tech de confiance à Antananarivo",
      storeLogo: "https://picsum.photos/seed/techstore/200",
      commissionRate: 0.1,
      isApproved: true,
    },
  });
  console.log("✅ Profil seller créé");

  await prisma.sellerRequest.deleteMany({
    where: { userId: sellerUser.id },
  });

  await prisma.sellerRequest.create({
    data: {
      userId: sellerUser.id,
      storeName: seller.storeName,
      storeDescription: seller.storeDescription || "",
      status: SellerRequestStatus.APPROVED,
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    },
  });
  console.log("✅ Seller request créée");

  await prisma.address.create({
    data: {
      userId: client.id,
      label: "Domicile",
      fullName: "Jean Rakoto",
      phone: "+261 34 12 345 67",
      street: "Lot IVA 123 Ambohijanahary",
      city: "Antananarivo",
      region: "Analamanga",
      postalCode: "101",
      isDefault: true,
    },
  });
  console.log("✅ Adresse créée");

  const products = [
    {
      name: "iPhone 15 Pro",
      description: 'A17 Pro, Écran Super Retina XDR 6.1", 128GB, Caméra 48MP',
      price: 4890000,
      stock: 10,
      images: JSON.stringify(["https://picsum.photos/seed/iphone15/800/600"]),
      categoryId: 1,
      sellerId: seller.id,
    },
    {
      name: "Samsung Galaxy S24",
      description: 'Snapdragon 8 Gen 3, 256GB, Écran AMOLED 6.2", Caméra 50MP',
      price: 3990000,
      stock: 15,
      images: JSON.stringify(["https://picsum.photos/seed/galaxys24/800/600"]),
      categoryId: 1,
      sellerId: seller.id,
    },
    {
      name: "MacBook Pro M3",
      description: 'Puce M3, 16GB RAM, 512GB SSD, Écran Liquid Retina 14"',
      price: 8750000,
      stock: 5,
      images: JSON.stringify(["https://picsum.photos/seed/macbookm3/800/600"]),
      categoryId: 1,
      sellerId: seller.id,
    },
    {
      name: "iPad Air M2",
      description: 'Puce M2, 11", 128GB, WiFi, Touch ID',
      price: 2950000,
      stock: 12,
      images: JSON.stringify(["https://picsum.photos/seed/ipadairm2/800/600"]),
      categoryId: 1,
      sellerId: seller.id,
    },
    {
      name: "AirPods Pro 2",
      description: "Réduction de bruit active, Audio spatial, USB-C",
      price: 1120000,
      stock: 20,
      images: JSON.stringify([
        "https://picsum.photos/seed/airpodspro2/800/600",
      ]),
      categoryId: 1,
      sellerId: seller.id,
    },
    {
      name: "Apple Watch Series 9",
      description: "GPS + Cellular, Écran Always-On, Suivi santé avancé",
      price: 1890000,
      stock: 8,
      images: JSON.stringify(["https://picsum.photos/seed/watchs9/800/600"]),
      categoryId: 1,
      sellerId: seller.id,
    },
    {
      name: "Sony WH-1000XM5",
      description:
        "Casque Bluetooth, Réduction de bruit premium, 30h d'autonomie",
      price: 1450000,
      stock: 10,
      images: JSON.stringify([
        "https://picsum.photos/seed/sonywh1000xm5/800/600",
      ]),
      categoryId: 1,
      sellerId: seller.id,
    },
    {
      name: "Nike Air Force 1",
      description: "Sneakers iconiques, Cuir blanc, Confort optimal",
      price: 485000,
      stock: 25,
      images: JSON.stringify(["https://picsum.photos/seed/nikeaf1/800/600"]),
      categoryId: 2,
      sellerId: seller.id,
    },
    {
      name: "Adidas Ultraboost",
      description: "Chaussures de running, Boost cushioning, Primeknit",
      price: 725000,
      stock: 18,
      images: JSON.stringify(["https://picsum.photos/seed/ultraboost/800/600"]),
      categoryId: 2,
      sellerId: seller.id,
    },
    {
      name: "Levi's 501 Original",
      description: "Jean coupe droite classique, Denim 100% coton",
      price: 215000,
      stock: 30,
      images: JSON.stringify(["https://picsum.photos/seed/levis501/800/600"]),
      categoryId: 2,
      sellerId: seller.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} produits créés`);

  console.log("\n🎉 Seeding terminé avec succès!");
  console.log("\n📝 Comptes de test:");
  console.log("   Admin:  admin@ecommerce.com / demo");
  console.log("   Client: client@ecommerce.com / demo");
  console.log("   Seller: seller@ecommerce.com / demo");
  console.log("\n📊 Données créées:");
  console.log(`   - ${categories.length} catégories`);
  console.log(`   - 3 utilisateurs (1 admin + 1 client + 1 seller)`);
  console.log(`   - 1 profil seller approuvé`);
  console.log(`   - 1 adresse`);
  console.log(`   - ${products.length} produits`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
