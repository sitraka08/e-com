import { apiClient } from './client';
import {
  ApiResponse,
  ProductDTO,
  CreateProductDTO,
  UpdateProductDTO,
  UpdateStockDTO,
} from '@/types';

export const productService = {
  async getAll(): Promise<ApiResponse<ProductDTO[]>> {
    const response = await apiClient.get('/products');
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<ProductDTO>> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  async search(query: string): Promise<ApiResponse<ProductDTO[]>> {
    const response = await apiClient.get(`/products/search?q=${query}`);
    return response.data;
  },

  async create(data: CreateProductDTO): Promise<ApiResponse<ProductDTO>> {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  async update(id: number, data: UpdateProductDTO): Promise<ApiResponse<ProductDTO>> {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  async updateStock(id: number, data: UpdateStockDTO): Promise<ApiResponse<ProductDTO>> {
    const response = await apiClient.patch(`/products/${id}/stock`, data);
    return response.data;
  },

  async getLowStock(): Promise<ApiResponse<ProductDTO[]>> {
    const response = await apiClient.get('/products/low-stock');
    return response.data;
  },

  async createWithImages(
    data: Omit<CreateProductDTO, 'images'>,
    imageUris: string[]
  ): Promise<ApiResponse<ProductDTO>> {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('categoryId', data.categoryId.toString());

    for (const uri of imageUris) {
      if (uri.startsWith('http')) {
        continue;
      }

      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('images', {
        uri,
        name: filename,
        type,
      } as unknown as Blob);
    }

    const response = await apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateWithImages(
    id: number,
    data: Omit<UpdateProductDTO, 'images'>,
    imageUris: string[]
  ): Promise<ApiResponse<ProductDTO>> {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.categoryId !== undefined) formData.append('categoryId', data.categoryId.toString());

    const existingImages: string[] = [];
    const newImageUris: string[] = [];

    for (const uri of imageUris) {
      if (uri.startsWith('http')) {
        existingImages.push(uri);
      } else {
        newImageUris.push(uri);
      }
    }

    if (existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    for (const uri of newImageUris) {
      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('images', {
        uri,
        name: filename,
        type,
      } as unknown as Blob);
    }

    const response = await apiClient.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
