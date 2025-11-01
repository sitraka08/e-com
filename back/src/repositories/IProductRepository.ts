import { Product, CreateProductDTO, UpdateProductDTO, ProductFilters, PaginationParams, PaginatedResponse } from '../types';

export interface IProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(filters?: ProductFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Product>>;
  search(query: string, pagination?: PaginationParams): Promise<PaginatedResponse<Product>>;
  update(id: number, data: UpdateProductDTO): Promise<Product>;
  delete(id: number): Promise<void>;
  updateStock(id: number, quantity: number): Promise<Product>;
  getLowStock(threshold: number): Promise<Product[]>;
}
