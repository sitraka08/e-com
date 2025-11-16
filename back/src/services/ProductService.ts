import { IProductRepository, ICategoryRepository, ISellerRepository } from '../repositories';
import { ProductDTO, CreateProductDTO, UpdateProductDTO, ProductFilters, PaginationParams, PaginatedResponse, UpdateStockDTO, UserRole } from '../types';

export class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
    private sellerRepository?: ISellerRepository
  ) {}

  async createProduct(data: CreateProductDTO, userId?: number, userRole?: UserRole): Promise<ProductDTO> {
    // Only SELLER can create products
    if (userRole !== UserRole.SELLER) {
      throw new Error('Only sellers can create products');
    }

    if (data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Auto-assign sellerId for SELLER
    let productData = { ...data };
    if (userId && this.sellerRepository) {
      const seller = await this.sellerRepository.findByUserId(userId);
      if (!seller) {
        throw new Error('Seller profile not found');
      }
      productData = { ...data, sellerId: seller.id };
    }

    const product = await this.productRepository.create(productData as any);
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

  async updateProduct(id: number, data: UpdateProductDTO, userId?: number, userRole?: UserRole): Promise<ProductDTO> {
    // Only SELLER can update products
    if (userRole !== UserRole.SELLER) {
      throw new Error('Only sellers can update products');
    }

    if (data.price !== undefined && data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    // Check permissions: SELLER can only update their own products
    if (userId && this.sellerRepository) {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      const seller = await this.sellerRepository.findByUserId(userId);
      if (!seller || product.sellerId !== seller.id) {
        throw new Error('You can only update your own products');
      }
    }

    const product: any = await this.productRepository.update(id, data);
    const category = await this.categoryRepository.findById(product.categoryId);
    return this.mapToDTO(product, category?.name);
  }

  async deleteProduct(id: number, userId?: number, userRole?: UserRole): Promise<void> {
    // Only SELLER can delete products
    if (userRole !== UserRole.SELLER) {
      throw new Error('Only sellers can delete products');
    }

    // Check permissions: SELLER can only delete their own products
    if (userId && this.sellerRepository) {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      const seller = await this.sellerRepository.findByUserId(userId);
      if (!seller || product.sellerId !== seller.id) {
        throw new Error('You can only delete your own products');
      }
    }

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
      sellerId: product.sellerId || null,
      sellerName: product.seller?.user?.firstName && product.seller?.user?.lastName
        ? `${product.seller.user.firstName} ${product.seller.user.lastName}`
        : undefined,
      sellerStoreName: product.seller?.storeName,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

