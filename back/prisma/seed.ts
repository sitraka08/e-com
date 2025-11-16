import {
  PrismaClient,
  UserRole,
  UserStatus,
  PaymentMethodType,
  OrderStatus,
  PaymentStatus,
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
    {
      id: 3,
      name: "Maison",
      slug: "maison",
      description: "Décoration, meubles, électroménager",
      icon: "Home",
    },
    {
      id: 4,
      name: "Beauté",
      slug: "beaute",
      description: "Cosmétiques, soins, parfums",
      icon: "Sparkles",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
    console.log(`✅ Catégorie créée: ${cat.name}`);
  }

  const adminPassword = await bcrypt.hash("demo", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecommerce.com" },
    update: {},
    create: {
      email: "admin@ecommerce.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "Principal",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log("✅ Admin créé:", admin.email);

  const clientPassword = await bcrypt.hash("demo", 10);
  const clients = [];

  const clientData = [
    { firstName: "Rakoto", lastName: "Jean", email: "rakoto@gmail.com" },
    { firstName: "Rasoa", lastName: "Marie", email: "rasoa@gmail.com" },
    { firstName: "Andry", lastName: "Paul", email: "andry@gmail.com" },
  ];

  for (const data of clientData) {
    const client = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        password: clientPassword,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
      },
    });
    clients.push(client);
    console.log(`✅ Client créé: ${client.email}`);
  }

  const sellerPassword = await bcrypt.hash("demo", 10);
  const sellers = [];

  const sellerUsers = [
    { firstName: "Koto", lastName: "Rabe", email: "seller1@ecommerce.com" },
    { firstName: "Soa", lastName: "Hery", email: "seller2@ecommerce.com" },
  ];

  for (const data of sellerUsers) {
    const seller = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        password: sellerPassword,
        role: UserRole.SELLER,
        status: UserStatus.ACTIVE,
      },
    });
    sellers.push(seller);
    console.log(`✅ Seller user créé: ${seller.email}`);
  }

  const sellerProfiles = [
    {
      userId: sellers[0].id,
      storeName: "TechStore Madagascar",
      storeDescription: "Votre boutique tech de confiance à Tana",
      storeLogo: "https://picsum.photos/seed/techstore/200",
      commissionRate: 0.1,
      isApproved: true,
    },
    {
      userId: sellers[1].id,
      storeName: "Fashion Boutique Tana",
      storeDescription: "Mode tendance et accessoires stylés",
      storeLogo: "https://picsum.photos/seed/fashionboutique/200",
      commissionRate: 0.15,
      isApproved: true,
    },
  ];

  const createdSellers = [];
  for (const data of sellerProfiles) {
    const seller = await prisma.seller.upsert({
      where: { userId: data.userId },
      update: data,
      create: data,
    });
    createdSellers.push(seller);
  }
  console.log(`✅ ${createdSellers.length} profils seller créés`);

  // Delete existing seller requests for these users to avoid duplicates
  await prisma.sellerRequest.deleteMany({
    where: {
      userId: {
        in: [sellers[0].id, sellers[1].id],
      },
    },
  });

  await prisma.sellerRequest.create({
    data: {
      userId: sellers[0].id,
      storeName: sellerProfiles[0].storeName,
      storeDescription: sellerProfiles[0].storeDescription,
      status: SellerRequestStatus.APPROVED,
    },
  });

  await prisma.sellerRequest.create({
    data: {
      userId: sellers[1].id,
      storeName: sellerProfiles[1].storeName,
      storeDescription: sellerProfiles[1].storeDescription,
      status: SellerRequestStatus.APPROVED,
    },
  });
  console.log("✅ Seller requests créées");

  const addressData = [
    {
      userId: clients[0].id,
      label: "Domicile",
      fullName: "Rakoto Jean",
      phone: "+261 34 12 345 67",
      street: "Lot IVA 123 Ambohijanahary",
      city: "Antananarivo",
      region: "Analamanga",
      postalCode: "101",
      isDefault: true,
    },
    {
      userId: clients[1].id,
      label: "Domicile",
      fullName: "Rasoa Marie",
      phone: "+261 33 45 678 90",
      street: "Rue de la Réunion, Analakely",
      city: "Antananarivo",
      region: "Analamanga",
      postalCode: "101",
      isDefault: true,
    },
    {
      userId: clients[2].id,
      label: "Bureau",
      fullName: "Andry Paul",
      phone: "+261 32 98 765 43",
      street: "Boulevard de l'Indépendance",
      city: "Antananarivo",
      region: "Analamanga",
      postalCode: "101",
      isDefault: true,
    },
  ];

  const addresses = [];
  for (const data of addressData) {
    const address = await prisma.address.create({ data });
    addresses.push(address);
  }
  console.log(`✅ ${addresses.length} adresses créées`);

  const paymentMethodData = [
    {
      userId: clients[0].id,
      type: PaymentMethodType.MOBILE_MONEY,
      label: "MVola Principal",
      details: JSON.stringify({
        phone: "+261 34 12 345 67",
        provider: "MVola",
      }),
      isDefault: true,
    },
    {
      userId: clients[1].id,
      type: PaymentMethodType.MOBILE_MONEY,
      label: "Orange Money",
      details: JSON.stringify({
        phone: "+261 33 45 678 90",
        provider: "Orange Money",
      }),
      isDefault: true,
    },
    {
      userId: clients[2].id,
      type: PaymentMethodType.CASH,
      label: "Paiement à la livraison",
      details: JSON.stringify({}),
      isDefault: true,
    },
  ];

  const paymentMethods = [];
  for (const data of paymentMethodData) {
    const method = await prisma.paymentMethod.create({ data });
    paymentMethods.push(method);
  }
  console.log(`✅ ${paymentMethods.length} méthodes de paiement créées`);

  const products = [
    {
      name: "Smartphone Samsung Galaxy A54",
      description: 'Écran Super AMOLED 6.4", 128GB, 6GB RAM, Caméra 50MP',
      price: 1890000,
      stock: 15,
      images: JSON.stringify([
        "https://picsum.photos/seed/samsung-a54/800/600",
      ]),
      categoryId: 1,
      sellerId: createdSellers[0].id,
    },
    {
      name: "MacBook Air M2",
      description: 'Puce M2, 8GB RAM, 256GB SSD, Écran Retina 13.6"',
      price: 5250000,
      stock: 8,
      images: JSON.stringify(["https://picsum.photos/seed/macbook-m2/800/600"]),
      categoryId: 1,
      sellerId: createdSellers[0].id,
    },
    {
      name: "Écouteurs AirPods Pro 2",
      description: "Réduction de bruit active, Audio spatial",
      price: 1120000,
      stock: 25,
      images: JSON.stringify([
        "https://picsum.photos/seed/airpods-pro/800/600",
      ]),
      categoryId: 1,
    },
    {
      name: "Tablette iPad Air",
      description: '10.9", 64GB, WiFi, Puce M1',
      price: 2650000,
      stock: 12,
      images: JSON.stringify(["https://picsum.photos/seed/ipad-air/800/600"]),
      categoryId: 1,
      sellerId: createdSellers[0].id,
    },
    {
      name: "Montre Xiaomi Smart Band 8",
      description: "Écran AMOLED, Suivi fitness, Autonomie 16 jours",
      price: 165000,
      stock: 40,
      images: JSON.stringify([
        "https://picsum.photos/seed/xiaomi-band8/800/600",
      ]),
      categoryId: 1,
    },
    {
      name: "Casque Gaming HyperX",
      description: "Son surround 7.1, Microphone anti-bruit",
      price: 385000,
      stock: 18,
      images: JSON.stringify([
        "https://picsum.photos/seed/hyperx-cloud/800/600",
      ]),
      categoryId: 1,
      sellerId: createdSellers[0].id,
    },
    {
      name: "Souris Logitech G502",
      description: "25600 DPI, 11 boutons programmables",
      price: 245000,
      stock: 30,
      images: JSON.stringify([
        "https://picsum.photos/seed/logitech-g502/800/600",
      ]),
      categoryId: 1,
    },
    {
      name: "Jean Levi's 501 Original",
      description: "Coupe droite classique, Denim 100% coton",
      price: 215000,
      stock: 35,
      images: JSON.stringify(["https://picsum.photos/seed/levis-501/800/600"]),
      categoryId: 2,
      sellerId: createdSellers[1].id,
    },
    {
      name: "Sneakers Nike Air Max 90",
      description: "Confort supérieur, Design iconique",
      price: 575000,
      stock: 22,
      images: JSON.stringify([
        "https://picsum.photos/seed/nike-airmax90/800/600",
      ]),
      categoryId: 2,
      sellerId: createdSellers[1].id,
    },
    {
      name: "Sac à dos Eastpak",
      description: "24L, Garantie 30 ans",
      price: 185000,
      stock: 28,
      images: JSON.stringify(["https://picsum.photos/seed/eastpak/800/600"]),
      categoryId: 2,
    },
    {
      name: "T-shirt Adidas Originals",
      description: "100% coton, Logo Trefoil",
      price: 95000,
      stock: 50,
      images: JSON.stringify([
        "https://picsum.photos/seed/adidas-tshirt/800/600",
      ]),
      categoryId: 2,
      sellerId: createdSellers[1].id,
    },
    {
      name: "Veste cuir Zara",
      description: "Cuir véritable, Style motard",
      price: 675000,
      stock: 10,
      images: JSON.stringify([
        "https://picsum.photos/seed/zara-leather/800/600",
      ]),
      categoryId: 2,
      sellerId: createdSellers[1].id,
    },
    {
      name: "Lunettes Ray-Ban Aviator",
      description: "Verres polarisés, Protection UV400",
      price: 425000,
      stock: 20,
      images: JSON.stringify(["https://picsum.photos/seed/rayban/800/600"]),
      categoryId: 2,
    },
    {
      name: "Montre Casio G-Shock",
      description: "Résistance aux chocs, Étanche 200m",
      price: 345000,
      stock: 25,
      images: JSON.stringify([
        "https://picsum.photos/seed/casio-gshock/800/600",
      ]),
      categoryId: 2,
    },
    {
      name: "Canapé IKEA KIVIK 3 places",
      description: "Revêtement tissu, Coussin épais",
      price: 1750000,
      stock: 5,
      images: JSON.stringify(["https://picsum.photos/seed/ikea-kivik/800/600"]),
      categoryId: 3,
    },
    {
      name: "Table basse scandinave",
      description: "Bois massif, Design minimaliste",
      price: 385000,
      stock: 12,
      images: JSON.stringify([
        "https://picsum.photos/seed/table-scandinave/800/600",
      ]),
      categoryId: 3,
    },
    {
      name: "Lampe LED Philips",
      description: "5 niveaux de luminosité, Port USB",
      price: 165000,
      stock: 30,
      images: JSON.stringify([
        "https://picsum.photos/seed/philips-lamp/800/600",
      ]),
      categoryId: 3,
    },
    {
      name: "Tapis berbère 200x300cm",
      description: "Laine naturelle, Fait main",
      price: 785000,
      stock: 8,
      images: JSON.stringify([
        "https://picsum.photos/seed/tapis-berbere/800/600",
      ]),
      categoryId: 3,
    },
    {
      name: "Aspirateur robot Xiaomi",
      description: "Navigation laser, App connectée",
      price: 885000,
      stock: 15,
      images: JSON.stringify([
        "https://picsum.photos/seed/xiaomi-vacuum/800/600",
      ]),
      categoryId: 3,
    },
    {
      name: "Set 6 chaises salle à manger",
      description: "Métal noir, Simili-cuir gris",
      price: 495000,
      stock: 10,
      images: JSON.stringify([
        "https://picsum.photos/seed/dining-chairs/800/600",
      ]),
      categoryId: 3,
    },
    {
      name: "Parfum Chanel N°5 EDP 100ml",
      description: "Notes florales, Élégance intemporelle",
      price: 3850000,
      stock: 12,
      images: JSON.stringify(["https://picsum.photos/seed/chanel-n5/800/600"]),
      categoryId: 4,
    },
    {
      name: "Crème hydratante CeraVe",
      description: "453g, Peaux sèches, Acide hyaluronique",
      price: 125000,
      stock: 45,
      images: JSON.stringify(["https://picsum.photos/seed/cerave/800/600"]),
      categoryId: 4,
    },
    {
      name: "Sérum The Ordinary",
      description: "Niacinamide 10% + Zinc 1%, 30ml",
      price: 85000,
      stock: 35,
      images: JSON.stringify([
        "https://picsum.photos/seed/ordinary-niacinamide/800/600",
      ]),
      categoryId: 4,
    },
    {
      name: "Palette maquillage MAC",
      description: "12 fards à paupières",
      price: 1450000,
      stock: 18,
      images: JSON.stringify([
        "https://picsum.photos/seed/mac-palette/800/600",
      ]),
      categoryId: 4,
    },
    {
      name: "Brosse Dyson Airwrap",
      description: "Multi-styler, 6 accessoires",
      price: 2150000,
      stock: 6,
      images: JSON.stringify([
        "https://picsum.photos/seed/dyson-airwrap/800/600",
      ]),
      categoryId: 4,
    },
    {
      name: "Crème solaire La Roche-Posay",
      description: "SPF50+, Protection UVA/UVB, 50ml",
      price: 115000,
      stock: 40,
      images: JSON.stringify([
        "https://picsum.photos/seed/laroche-sun/800/600",
      ]),
      categoryId: 4,
    },
    {
      name: "Rouge à lèvres Dior",
      description: "Fini satiné, Teinte Rouge 999",
      price: 975000,
      stock: 25,
      images: JSON.stringify([
        "https://picsum.photos/seed/dior-lipstick/800/600",
      ]),
      categoryId: 4,
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    createdProducts.push(created);
  }
  console.log(`✅ ${createdProducts.length} produits créés`);

  for (const client of clients) {
    const numFavorites = Math.floor(Math.random() * 5) + 3;
    const shuffled = [...createdProducts].sort(() => 0.5 - Math.random());
    const favoriteProducts = shuffled.slice(0, numFavorites);

    for (const product of favoriteProducts) {
      await prisma.favorite.create({
        data: {
          userId: client.id,
          productId: product.id,
        },
      });
    }
  }
  console.log(`✅ Favoris créés pour ${clients.length} clients`);

  for (const client of clients) {
    const cartNames = ["Courses hebdo", "Liste Noël", "Wishlist"];
    const numCarts = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numCarts; i++) {
      const numItems = Math.floor(Math.random() * 4) + 2;
      const shuffled = [...createdProducts].sort(() => 0.5 - Math.random());
      const cartProducts = shuffled.slice(0, numItems);

      const items = cartProducts.map((p) => ({
        productId: p.id,
        quantity: Math.floor(Math.random() * 3) + 1,
        productName: p.name,
        productPrice: parseFloat(p.price.toString()),
        productImage: JSON.parse(p.images)[0],
      }));

      await prisma.savedCart.create({
        data: {
          userId: client.id,
          name: cartNames[i % cartNames.length],
          items: JSON.stringify(items),
        },
      });
    }
  }
  console.log(`✅ Paniers sauvegardés créés pour ${clients.length} clients`);

  const now = new Date();
  const orderStatuses = [
    OrderStatus.DELIVERED,
    OrderStatus.SHIPPED,
    OrderStatus.PROCESSING,
    OrderStatus.CONFIRMED,
    OrderStatus.PENDING,
  ];

  for (let i = 0; i < 15; i++) {
    const client = clients[i % clients.length];
    const address = addresses[i % addresses.length];
    const paymentMethod = paymentMethods[i % paymentMethods.length];

    const daysAgo = Math.floor(i / 2);
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - daysAgo);

    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const product =
        createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = parseFloat(product.price.toString());
      const itemSubtotal = price * quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: JSON.parse(product.images)[0],
        quantity,
        priceAtPurchase: price,
        subtotal: itemSubtotal,
      });
    }

    const deliveryFee = 3000;
    const total = subtotal + deliveryFee;
    const status = orderStatuses[i % orderStatuses.length];

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i.toString().padStart(4, "0")}`,
        userId: client.id,
        addressId: address.id,
        status,
        subtotal,
        deliveryFee,
        total,
        totalPaid: status === OrderStatus.DELIVERED ? total : 0,
        estimatedDelivery: new Date(
          orderDate.getTime() + 7 * 24 * 60 * 60 * 1000
        ),
        createdAt: orderDate,
        items: {
          create: orderItems,
        },
      },
    });

    if (
      status === OrderStatus.DELIVERED ||
      status === OrderStatus.SHIPPED ||
      status === OrderStatus.PROCESSING
    ) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          paymentMethodId: paymentMethod.id,
          amount: total,
          status:
            status === OrderStatus.DELIVERED
              ? PaymentStatus.COMPLETED
              : PaymentStatus.PENDING,
          transactionId: `TXN-${Date.now()}-${i}`,
          metadata: JSON.stringify({ createdAt: orderDate }),
          createdAt: orderDate,
        },
      });
    }
  }
  console.log("✅ 15 commandes créées");

  console.log("\n🎉 Seeding terminé avec succès!");
  console.log("\n📝 Comptes de test:");
  console.log("   Admin:    admin@ecommerce.com / Admin123!");
  console.log("   Client 1: rakoto.jean@gmail.com / Client123!");
  console.log("   Client 2: rasoa.marie@gmail.com / Client123!");
  console.log("   Client 3: andry.paul@gmail.com / Client123!");
  console.log("   Seller 1: seller1@ecommerce.com / Seller123!");
  console.log("   Seller 2: seller2@ecommerce.com / Seller123!");
  console.log("\n📊 Données créées:");
  console.log(`   - 4 catégories`);
  console.log(`   - 6 utilisateurs (1 admin + 3 clients + 2 sellers)`);
  console.log(`   - 2 profils seller approuvés`);
  console.log(`   - ${addresses.length} adresses`);
  console.log(`   - ${paymentMethods.length} méthodes de paiement`);
  console.log(
    `   - ${createdProducts.length} produits (dont ${
      products.filter((p) => p.sellerId).length
    } avec seller)`
  );
  console.log(`   - ~15 favoris`);
  console.log(`   - ~3-6 paniers sauvegardés`);
  console.log(`   - 15 commandes avec paiements`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
