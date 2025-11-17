import { SellerRequest, CreateSellerRequestDTO, SellerRequestStatus } from '../types';

export interface ISellerRequestRepository {
  create(userId: number, data: CreateSellerRequestDTO): Promise<SellerRequest>;
  findById(id: number): Promise<SellerRequest | null>;
  findByUserId(userId: number): Promise<SellerRequest[]>;
  findAll(filters?: { status?: SellerRequestStatus }): Promise<SellerRequest[]>;
  updateStatus(id: number, status: SellerRequestStatus, reviewedBy: number, rejectionReason?: string): Promise<SellerRequest>;
  delete(id: number): Promise<void>;
}
