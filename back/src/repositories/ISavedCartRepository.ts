import { SavedCart } from '../types';

export interface ISavedCartRepository {
  create(userId: number, name: string, items: string): Promise<SavedCart>;
  findById(id: number): Promise<SavedCart | null>;
  findByUserId(userId: number): Promise<SavedCart[]>;
  update(id: number, data: { name?: string; items?: string }): Promise<SavedCart>;
  delete(id: number): Promise<void>;
}
