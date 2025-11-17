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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SearchParams = {
  query: string;
  page?: number;
  limit?: number;
};

export type UserRole = "CLIENT" | "SELLER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VALIDATION";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentMethodType =
  | "MOBILE_MONEY"
  | "CREDIT_CARD"
  | "BANK_TRANSFER"
  | "CASH_ON_DELIVERY";
export type SellerRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type UserDTO = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
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
  sellerId: number | null;
  sellerName?: string;
  sellerStoreName?: string;
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
  product: ProductDTO;
  productName?: string;
  productImage?: string;
  quantity: number;
  price: number;
  unitPrice: number;
  totalPrice: number;
  priceAtOrder?: number;
  subtotal?: number;
};

export type OrderDTO = {
  id: number;
  orderNumber: string;
  userId: number;
  user?: UserDTO;
  addressId: number;
  address?: AddressDTO;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalPaid: number;
  balance: number;
  items: OrderItemDTO[];
  payments?: PaymentDTO[];
  estimatedDelivery?: Date | null;
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
};

export type SellerRequestInfo = {
  id: number;
  storeName: string;
  storeDescription: string;
  status: SellerRequestStatus;
  createdAt: string | Date;
};

export type AuthResponse = {
  user: UserDTO;
  tokens: AuthTokens;
  seller?: SellerDTO;
};

export type OrderStatsDTO = {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  unpaidOrders: number;
  unpaidAmount: number;
};

// Seller Types
export type SellerDTO = {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string | null;
  storeLogo: string | null;
  commissionRate: number;
  isApproved: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type SellerWithUserDTO = SellerDTO & {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type CreateSellerRequestDTO = {
  storeName: string;
  storeDescription: string;
  businessRegistration?: string;
};

export type UpdateSellerDTO = {
  storeName?: string;
  storeDescription?: string | null;
  storeLogo?: string | null;
};

export type SellerRequestDTO = {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string;
  businessRegistration: string | null;
  status: SellerRequestStatus;
  rejectionReason: string | null;
  reviewedBy: number | null;
  reviewedAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type SellerRequestWithUserDTO = SellerRequestDTO & {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type ApproveSellerRequestDTO = {
  commissionRate?: number;
};

export type RejectSellerRequestDTO = {
  rejectionReason: string;
};

export type SellerStatsDTO = {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  pendingOrders: number;
};

export type UpdateCommissionRateDTO = {
  commissionRate: number;
};

// Favorite Types
export type FavoriteDTO = {
  id: number;
  userId: number;
  productId: number;
  createdAt: string | Date;
};

export type FavoriteWithProductDTO = FavoriteDTO & {
  product: ProductDTO;
};

export type AddFavoriteDTO = {
  productId: number;
};

// SavedCart Types
export type CartItem = {
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;
  productImage?: string;
};

export type SavedCartDTO = {
  id: number;
  userId: number;
  name: string;
  items: CartItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type CreateSavedCartDTO = {
  name: string;
  items: CartItem[];
};

export type UpdateSavedCartDTO = {
  name?: string;
  items?: CartItem[];
};
