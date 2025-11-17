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
