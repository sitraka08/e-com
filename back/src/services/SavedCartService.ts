import { ISavedCartRepository } from '../repositories';
import { SavedCartDTO, CreateSavedCartDTO, UpdateSavedCartDTO, CartItem } from '../types';

export class SavedCartService {
  constructor(private savedCartRepository: ISavedCartRepository) {}

  async createSavedCart(userId: number, data: CreateSavedCartDTO): Promise<SavedCartDTO> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Cart name is required');
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('Cart must contain at least one item');
    }

    const itemsJson = JSON.stringify(data.items);
    const savedCart = await this.savedCartRepository.create(userId, data.name, itemsJson);
    return this.mapToDTO(savedCart);
  }

  async getUserSavedCarts(userId: number): Promise<SavedCartDTO[]> {
    const savedCarts = await this.savedCartRepository.findByUserId(userId);
    return savedCarts.map((cart) => this.mapToDTO(cart));
  }

  async getSavedCartById(id: number, userId: number): Promise<SavedCartDTO> {
    const savedCart = await this.savedCartRepository.findById(id);
    if (!savedCart) {
      throw new Error('Saved cart not found');
    }

    if (savedCart.userId !== userId) {
      throw new Error('Unauthorized access to this saved cart');
    }

    return this.mapToDTO(savedCart);
  }

  async updateSavedCart(id: number, userId: number, data: UpdateSavedCartDTO): Promise<SavedCartDTO> {
    const savedCart = await this.savedCartRepository.findById(id);
    if (!savedCart) {
      throw new Error('Saved cart not found');
    }

    if (savedCart.userId !== userId) {
      throw new Error('Unauthorized access to this saved cart');
    }

    const updateData: { name?: string; items?: string } = {};

    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new Error('Cart name cannot be empty');
      }
      updateData.name = data.name;
    }

    if (data.items !== undefined) {
      if (data.items.length === 0) {
        throw new Error('Cart must contain at least one item');
      }
      updateData.items = JSON.stringify(data.items);
    }

    const updated = await this.savedCartRepository.update(id, updateData);
    return this.mapToDTO(updated);
  }

  async deleteSavedCart(id: number, userId: number): Promise<void> {
    const savedCart = await this.savedCartRepository.findById(id);
    if (!savedCart) {
      throw new Error('Saved cart not found');
    }

    if (savedCart.userId !== userId) {
      throw new Error('Unauthorized access to this saved cart');
    }

    await this.savedCartRepository.delete(id);
  }

  private mapToDTO(savedCart: any): SavedCartDTO {
    const items: CartItem[] = JSON.parse(savedCart.items);

    return {
      id: savedCart.id,
      userId: savedCart.userId,
      name: savedCart.name,
      items,
      createdAt: savedCart.createdAt,
      updatedAt: savedCart.updatedAt,
    };
  }
}
