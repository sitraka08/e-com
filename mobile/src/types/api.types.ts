export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T = unknown> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SearchParams = {
  query: string;
  page?: number;
  limit?: number;
};

export type UserRole = 'CLIENT' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethodType = 'MOBILE_MONEY' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';

export type UserDTO = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type CategoryDTO = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type ProductDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: number;
  categoryName?: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type AddressDTO = {
  id: number;
  userId: number;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type PaymentMethodDTO = {
  id: number;
  userId: number;
  type: PaymentMethodType;
  label: string;
  details: Record<string, unknown>;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type OrderItemDTO = {
  id: number;
  orderId: number;
  productId: number;
  productName?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderDTO = {
  id: number;
  orderNumber: string;
  userId: number;
  addressId: number;
  address?: AddressDTO;
  status: OrderStatus;
  itemsTotal: number;
  deliveryFee: number;
  totalAmount: number;
  paidAmount: number;
  items: OrderItemDTO[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type PaymentDTO = {
  id: number;
  orderId: number;
  paymentMethodId: number;
  paymentMethod?: PaymentMethodDTO;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: UserDTO;
  tokens: AuthTokens;
};

export type OrderStatsDTO = {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
};
