import { Decimal } from '@prisma/client/runtime/library';
import { AddressDTO } from './address.types';
import { PaymentDTO } from './payment.types';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: Decimal;
  subtotal: Decimal;
}

export interface OrderItemDTO {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  addressId: number;
  status: OrderStatus;
  subtotal: Decimal;
  deliveryFee: Decimal;
  total: Decimal;
  totalPaid: Decimal;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDTO {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  address: AddressDTO;
  items: OrderItemDTO[];
  payments: PaymentDTO[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalPaid: number;
  balance: number;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderItemDTO {
  productId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  userId: number;
  addressId: number;
  items: CreateOrderItemDTO[];
  deliveryFee: number;
  paymentDetails?: {
    paymentMethodId: number;
    amount: number;
    transactionId?: string;
  }[];
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  estimatedDelivery?: Date;
}

export interface OrderFilters {
  userId?: number;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface OrderStatsDTO {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  unpaidOrders: number;
  unpaidAmount: number;
}
