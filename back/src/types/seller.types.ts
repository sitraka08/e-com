import { Decimal } from '@prisma/client/runtime/library';
import { SellerRequestStatus } from './enums';

export interface Seller {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string | null;
  storeLogo: string | null;
  commissionRate: Decimal;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerDTO {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string | null;
  storeLogo: string | null;
  commissionRate: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerWithUserDTO extends SellerDTO {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateSellerRequestDTO {
  storeName: string;
  storeDescription: string;
  businessRegistration?: string;
}

export interface UpdateSellerDTO {
  storeName?: string;
  storeDescription?: string | null;
  storeLogo?: string | null;
}

export interface SellerRequest {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string;
  businessRegistration: string | null;
  status: SellerRequestStatus;
  rejectionReason: string | null;
  reviewedBy: number | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerRequestDTO {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string;
  businessRegistration: string | null;
  status: SellerRequestStatus;
  rejectionReason: string | null;
  reviewedBy: number | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerRequestWithUserDTO extends SellerRequestDTO {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ApproveSellerRequestDTO {
  commissionRate?: number; // Optional, default 0.10
}

export interface RejectSellerRequestDTO {
  rejectionReason: string;
}

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  pendingOrders: number;
}

export interface UpdateCommissionRateDTO {
  commissionRate: number;
}
