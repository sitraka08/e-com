export interface SavedCart {
  id: number;
  userId: number;
  name: string;
  items: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;
  productImage?: string;
}

export interface SavedCartDTO {
  id: number;
  userId: number;
  name: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSavedCartDTO {
  name: string;
  items: CartItem[];
}

export interface UpdateSavedCartDTO {
  name?: string;
  items?: CartItem[];
}
