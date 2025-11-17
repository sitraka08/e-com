import { IUserRepository, IProductRepository, IOrderRepository, ISellerRepository } from '../repositories';
import { PrismaClient, OrderStatus } from '@prisma/client';

export interface PlatformStats {
  users: {
    total: number;
    clients: number;
    sellers: number;
    admins: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    totalRevenue: number;
    totalCommissions: number;
    platformRevenue: number;
  };
  topSellers: Array<{
    sellerId: number;
    storeName: string;
    totalOrders: number;
    totalRevenue: number;
  }>;
}

export class AdminService {
  constructor(
    private userRepository: IUserRepository,
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
    _sellerRepository: ISellerRepository,
    private prisma: PrismaClient
  ) {}

  async getPlatformStats(): Promise<PlatformStats> {
    // Statistiques utilisateurs par rôle
    const allUsers = await this.userRepository.findAll();
    const users = {
      total: allUsers.length,
      clients: allUsers.filter(u => u.role === 'CLIENT').length,
      sellers: allUsers.filter(u => u.role === 'SELLER').length,
      admins: allUsers.filter(u => u.role === 'ADMIN').length,
    };

    // Statistiques produits
    const allProducts = await this.productRepository.findAll();
    const lowStockProducts = await this.productRepository.getLowStock(10);
    const products = {
      total: allProducts.items.length,
      active: allProducts.items.filter((p: any) => p.isActive).length,
      lowStock: lowStockProducts.length,
    };

    // Statistiques commandes
    const allOrders = await this.orderRepository.findAll();
    const orders = {
      total: allOrders.items.length,
      pending: allOrders.items.filter((o: any) => o.status === OrderStatus.PENDING).length,
      completed: allOrders.items.filter((o: any) => o.status === OrderStatus.DELIVERED).length,
      cancelled: allOrders.items.filter((o: any) => o.status === OrderStatus.CANCELLED).length,
    };

    // Calcul des revenus et commissions
    const completedOrders = await this.prisma.order.findMany({
      where: { status: OrderStatus.DELIVERED },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: true,
              },
            },
          },
        },
      },
    });

    let totalRevenue = 0;
    let totalCommissions = 0;

    for (const order of completedOrders) {
      for (const item of order.items) {
        const itemRevenue = Number(item.priceAtPurchase) * item.quantity;
        totalRevenue += itemRevenue;

        if (item.product.seller) {
          const commission = itemRevenue * (Number(item.product.seller.commissionRate) / 100);
          totalCommissions += commission;
        }
      }
    }

    const revenue = {
      totalRevenue,
      totalCommissions,
      platformRevenue: totalRevenue - totalCommissions,
    };

    // Top vendeurs
    const sellersWithStats = await this.prisma.seller.findMany({
      include: {
        products: {
          include: {
            orderItems: {
              include: {
                order: true,
              },
            },
          },
        },
      },
    });

    const topSellers = sellersWithStats
      .map(seller => {
        const completedOrderItems = seller.products.flatMap(product =>
          product.orderItems.filter(item => item.order.status === OrderStatus.DELIVERED)
        );

        const totalOrders = new Set(completedOrderItems.map(item => item.orderId)).size;
        const totalRevenue = completedOrderItems.reduce((sum, item) => {
          return sum + (Number(item.priceAtPurchase) * item.quantity);
        }, 0);

        return {
          sellerId: seller.id,
          storeName: seller.storeName,
          totalOrders,
          totalRevenue,
        };
      })
      .filter(s => s.totalOrders > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    return {
      users,
      products,
      orders,
      revenue,
      topSellers,
    };
  }
}
