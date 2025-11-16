export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
}

export interface FavoriteDTO {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
}

export interface FavoriteWithProductDTO extends FavoriteDTO {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    categoryId: number;
    categoryName?: string;
    isActive: boolean;
  };
}

export interface AddFavoriteDTO {
  productId: number;
}
