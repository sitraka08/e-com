import { Favorite } from '../types';

export interface IFavoriteRepository {
  create(userId: number, productId: number): Promise<Favorite>;
  findByUserId(userId: number): Promise<Favorite[]>;
  findByUserAndProduct(userId: number, productId: number): Promise<Favorite | null>;
  delete(userId: number, productId: number): Promise<void>;
  deleteById(id: number): Promise<void>;
}
