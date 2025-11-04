import { IProductRepository, ICategoryRepository } from '../repositories';
import { ProductDTO, CreateProductDTO, UpdateProductDTO, ProductFilters, PaginationParams, PaginatedResponse, UpdateStockDTO } from '../types';

export class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async createProduct(data: CreateProductDTO): Promise<ProductDTO> {
    if (data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const product = await this.productRepository.create(data);
    return this.mapToDTO(product, category.name);
  }

  async getAllProducts(filters?: ProductFilters, pagination?: PaginationParams): Promise<PaginatedResponse<ProductDTO>> {
    const result = await this.productRepository.findAll(filters, pagination);

    const productsDTO = await Promise.all(
      result.items.map(async (product: any) => {
        const category = await this.categoryRepository.findById(product.categoryId);
        return this.mapToDTO(product, category?.name);
      })
    );

    return {
      items: productsDTO,
      pagination: result.pagination,
    };
  }

  async getProductById(id: number): Promise<ProductDTO> {
    const product: any = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return this.mapToDTO(product, product.category?.name);
  }

  async searchProducts(query: string, pagination?: PaginationParams): Promise<PaginatedResponse<ProductDTO>> {
    const result = await this.productRepository.search(query, pagination);

    const productsDTO = await Promise.all(
      result.items.map(async (product: any) => {
        const category = await this.categoryRepository.findById(product.categoryId);
        return this.mapToDTO(product, category?.name);
      })
    );

    return {
      items: productsDTO,
      pagination: result.pagination,
    };
  }

  async updateProduct(id: number, data: UpdateProductDTO): Promise<ProductDTO> {
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const product: any = await this.productRepository.update(id, data);
    const category = await this.categoryRepository.findById(product.categoryId);
    return this.mapToDTO(product, category?.name);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async updateStock(id: number, data: UpdateStockDTO): Promise<ProductDTO> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    let newStock = product.stock;
    if (data.operation === 'add') {
      newStock += data.quantity;
    } else if (data.operation === 'subtract') {
      newStock -= data.quantity;
      if (newStock < 0) throw new Error('Insufficient stock');
    } else if (data.operation === 'set') {
      newStock = data.quantity;
    }

    const updatedProduct: any = await this.productRepository.updateStock(id, newStock);
    const category = await this.categoryRepository.findById(updatedProduct.categoryId);
    return this.mapToDTO(updatedProduct, category?.name);
  }

  async getLowStockProducts(threshold: number = 10): Promise<ProductDTO[]> {
    const products: any[] = await this.productRepository.getLowStock(threshold);

    return Promise.all(
      products.map(async (product) => {
        const category = await this.categoryRepository.findById(product.categoryId);
        return this.mapToDTO(product, category?.name);
      })
    );
  }

  private mapToDTO(product: any, categoryName?: string): ProductDTO {
    const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      images,
      categoryId: product.categoryId,
      categoryName,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

