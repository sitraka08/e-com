import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export interface ICategoryRepository {
  create(data: CreateCategoryDTO): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(isActive?: boolean): Promise<Category[]>;
  update(id: number, data: UpdateCategoryDTO): Promise<Category>;
  delete(id: number): Promise<void>;
}
