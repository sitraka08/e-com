import { IFavoriteRepository, IProductRepository } from '../repositories';
import { FavoriteDTO, FavoriteWithProductDTO } from '../types';

export class FavoriteService {
  constructor(
    private favoriteRepository: IFavoriteRepository,
    private productRepository: IProductRepository
  ) {}

  async addFavorite(userId: number, productId: number): Promise<FavoriteDTO> {
    // Check if product exists
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if already in favorites
    const existing = await this.favoriteRepository.findByUserAndProduct(userId, productId);
    if (existing) {
      throw new Error('Product already in favorites');
    }

    const favorite = await this.favoriteRepository.create(userId, productId);
    return this.mapToDTO(favorite);
  }

  async getUserFavorites(userId: number): Promise<FavoriteWithProductDTO[]> {
    const favorites = await this.favoriteRepository.findByUserId(userId);
    return favorites.map((fav: any) => this.mapToDetailedDTO(fav));
  }

  async removeFavorite(userId: number, productId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findByUserAndProduct(userId, productId);
    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await this.favoriteRepository.delete(userId, productId);
  }

  async checkIsFavorite(userId: number, productId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findByUserAndProduct(userId, productId);
    return !!favorite;
  }

  private mapToDTO(favorite: any): FavoriteDTO {
    return {
      id: favorite.id,
      userId: favorite.userId,
      productId: favorite.productId,
      createdAt: favorite.createdAt,
    };
  }

  private mapToDetailedDTO(favorite: any): FavoriteWithProductDTO {
    const images = typeof favorite.product.images === 'string'
      ? JSON.parse(favorite.product.images)
      : favorite.product.images;

    return {
      id: favorite.id,
      userId: favorite.userId,
      productId: favorite.productId,
      createdAt: favorite.createdAt,
      product: {
        id: favorite.product.id,
        name: favorite.product.name,
        description: favorite.product.description,
        price: parseFloat(favorite.product.price.toString()),
        stock: favorite.product.stock,
        images,
        categoryId: favorite.product.categoryId,
        categoryName: favorite.product.category?.name,
        isActive: favorite.product.isActive,
      },
    };
  }
}
