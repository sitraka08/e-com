import { Decimal } from '@prisma/client/runtime/library';

import { PaymentMethodType, PaymentStatus } from './enums';
export { PaymentMethodType, PaymentStatus };

export interface PaymentMethod {
  id: number;
  userId: number;
  type: PaymentMethodType;
  label: string;
  details: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodDTO {
  id: number;
  userId: number;
  type: PaymentMethodType;
  label: string;
  details: Record<string, any>;
  isDefault: boolean;
}

export interface CreatePaymentMethodDTO {
  userId: number;
  type: PaymentMethodType;
  label: string;
  details: Record<string, any>;
  isDefault?: boolean;
}

export interface UpdatePaymentMethodDTO {
  label?: string;
  details?: Record<string, any>;
  isDefault?: boolean;
}

export interface Payment {
  id: number;
  orderId: number;
  paymentMethodId: number;
  amount: Decimal;
  status: PaymentStatus;
  transactionId: string | null;
  metadata: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDTO {
  id: number;
  orderId: number;
  paymentMethod: PaymentMethodDTO;
  amount: number;
  status: PaymentStatus;
  transactionId: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentDTO {
  orderId: number;
  paymentMethodId: number;
  amount: number;
  transactionId?: string;
  metadata?: Record<string, any>;
}

export interface ProcessPaymentDTO {
  orderId: number;
  payments: {
    paymentMethodId: number;
    amount: number;
    transactionId?: string;
  }[];
}
