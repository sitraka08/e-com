import { Seller, UpdateSellerDTO, UpdateCommissionRateDTO } from '../types';

export interface ISellerRepository {
  create(userId: number, storeName: string, storeDescription: string): Promise<Seller>;
  findById(id: number): Promise<Seller | null>;
  findByUserId(userId: number): Promise<Seller | null>;
  findAll(filters?: { isApproved?: boolean }): Promise<Seller[]>;
  update(id: number, data: UpdateSellerDTO): Promise<Seller>;
  updateCommissionRate(id: number, data: UpdateCommissionRateDTO): Promise<Seller>;
  delete(id: number): Promise<void>;
}
