import { ICategoryRepository } from '../repositories';
import { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async createCategory(data: CreateCategoryDTO): Promise<CategoryDTO> {
    const existingCategory = await this.categoryRepository.findBySlug(data.slug);
    if (existingCategory) {
      throw new Error('Category with this slug already exists');
    }

    const category = await this.categoryRepository.create(data);
    return this.mapToDTO(category);
  }

  async getAllCategories(isActive?: boolean): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.findAll(isActive);
    return categories.map(this.mapToDTO);
  }

  async getCategoryById(id: number): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return this.mapToDTO(category);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return this.mapToDTO(category);
  }

  async updateCategory(id: number, data: UpdateCategoryDTO): Promise<CategoryDTO> {
    if (data.slug) {
      const existingCategory = await this.categoryRepository.findBySlug(data.slug);
      if (existingCategory && existingCategory.id !== id) {
        throw new Error('Category with this slug already exists');
      }
    }

    const category = await this.categoryRepository.update(id, data);
    return this.mapToDTO(category);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  private mapToDTO(category: any): CategoryDTO {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      isActive: category.isActive,
    };
  }
}
