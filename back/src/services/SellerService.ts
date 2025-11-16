import { PrismaClient } from '@prisma/client';
import { ISellerRepository, ISellerRequestRepository, IUserRepository } from '../repositories';
import {
  SellerDTO,
  SellerWithUserDTO,
  CreateSellerRequestDTO,
  UpdateSellerDTO,
  SellerRequestDTO,
  SellerRequestWithUserDTO,
  ApproveSellerRequestDTO,
  RejectSellerRequestDTO,
  SellerStats,
  UpdateCommissionRateDTO,
  UserRole,
  SellerRequestStatus,
} from '../types';

export class SellerService {
  constructor(
    private sellerRepository: ISellerRepository,
    private sellerRequestRepository: ISellerRequestRepository,
    private userRepository: IUserRepository,
    private prisma: PrismaClient
  ) {}

  // Seller Request Methods
  async submitSellerRequest(userId: number, data: CreateSellerRequestDTO): Promise<SellerRequestDTO> {
    // Check if user already has a seller account
    const existingSeller = await this.sellerRepository.findByUserId(userId);
    if (existingSeller) {
      throw new Error('User already has a seller account');
    }

    // Check if user has pending request
    const existingRequests = await this.sellerRequestRepository.findByUserId(userId);
    const hasPendingRequest = existingRequests.some((req) => req.status === 'PENDING');
    if (hasPendingRequest) {
      throw new Error('You already have a pending seller request');
    }

    const request = await this.sellerRequestRepository.create(userId, data);
    return this.mapRequestToDTO(request);
  }

  async getSellerRequestById(id: number): Promise<SellerRequestWithUserDTO> {
    const request = await this.sellerRequestRepository.findById(id);
    if (!request) {
      throw new Error('Seller request not found');
    }

    return this.mapRequestToDTO(request) as SellerRequestWithUserDTO;
  }

  async getAllSellerRequests(filters?: { status?: SellerRequestStatus }): Promise<SellerRequestWithUserDTO[]> {
    const requests = await this.sellerRequestRepository.findAll(filters);
    return requests.map((req) => this.mapRequestToDTO(req) as SellerRequestWithUserDTO);
  }

  async getMySellerRequest(userId: number): Promise<SellerRequestDTO | null> {
    const requests = await this.sellerRequestRepository.findByUserId(userId);
    // Get the most recent seller request
    const latestRequest = requests[requests.length - 1];

    if (!latestRequest) {
      return null;
    }

    return this.mapRequestToDTO(latestRequest);
  }

  async approveSellerRequest(requestId: number, adminId: number, data?: ApproveSellerRequestDTO): Promise<SellerDTO> {
    const request = await this.sellerRequestRepository.findById(requestId);
    if (!request) {
      throw new Error('Seller request not found');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Request has already been processed');
    }

    // Check if user already has seller account
    const existingSeller = await this.sellerRepository.findByUserId(request.userId);
    if (existingSeller) {
      throw new Error('User already has a seller account');
    }

    // Update request status
    await this.sellerRequestRepository.updateStatus(requestId, 'APPROVED', adminId);

    // Create seller account
    const seller = await this.sellerRepository.create(
      request.userId,
      request.storeName,
      request.storeDescription
    );

    // Update commission rate if provided
    if (data?.commissionRate) {
      await this.sellerRepository.updateCommissionRate(seller.id, { commissionRate: data.commissionRate });
    }

    // Update user role to SELLER
    await this.userRepository.update(request.userId, { role: UserRole.SELLER });

    return this.mapToDTO(seller) as SellerDTO;
  }

  async rejectSellerRequest(requestId: number, adminId: number, data: RejectSellerRequestDTO): Promise<SellerRequestDTO> {
    const request = await this.sellerRequestRepository.findById(requestId);
    if (!request) {
      throw new Error('Seller request not found');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Request has already been processed');
    }

    const updatedRequest = await this.sellerRequestRepository.updateStatus(
      requestId,
      'REJECTED',
      adminId,
      data.rejectionReason
    );

    return this.mapRequestToDTO(updatedRequest);
  }

  // Seller Methods
  async getSellerProfile(userId: number): Promise<SellerWithUserDTO> {
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new Error('Seller account not found');
    }

    return this.mapToDTO(seller) as SellerWithUserDTO;
  }

  async getSellerById(id: number): Promise<SellerWithUserDTO> {
    const seller = await this.sellerRepository.findById(id);
    if (!seller) {
      throw new Error('Seller not found');
    }

    return this.mapToDTO(seller) as SellerWithUserDTO;
  }

  async getAllSellers(filters?: { isApproved?: boolean }): Promise<SellerWithUserDTO[]> {
    const sellers = await this.sellerRepository.findAll(filters);
    return sellers.map((seller) => this.mapToDTO(seller) as SellerWithUserDTO);
  }

  async updateSellerProfile(userId: number, data: UpdateSellerDTO): Promise<SellerDTO> {
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new Error('Seller account not found');
    }

    const updated = await this.sellerRepository.update(seller.id, data);
    return this.mapToDTO(updated);
  }

  async updateCommissionRate(sellerId: number, data: UpdateCommissionRateDTO): Promise<SellerDTO> {
    if (data.commissionRate < 0 || data.commissionRate > 1) {
      throw new Error('Commission rate must be between 0 and 1');
    }

    const updated = await this.sellerRepository.updateCommissionRate(sellerId, data);
    return this.mapToDTO(updated);
  }

  async getSellerStats(userId: number): Promise<SellerStats> {
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new Error('Seller account not found');
    }

    // Get seller's products
    const products = await this.prisma.product.findMany({
      where: { sellerId: seller.id },
    });

    // Get orders containing seller's products
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        productId: { in: products.map((p) => p.id) },
      },
      include: {
        order: true,
      },
    });

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const totalOrders = new Set(orderItems.map((item) => item.orderId)).size;

    const totalRevenue = orderItems.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal.toString());
    }, 0);

    const commissionRate = parseFloat(seller.commissionRate.toString());
    const totalCommission = totalRevenue * commissionRate;

    const pendingOrders = orderItems.filter((item) => item.order.status === 'PENDING').length;

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      totalCommission,
      pendingOrders,
    };
  }

  async getSellerProducts(userId: number, page: number = 1, limit: number = 20) {
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new Error('Seller account not found');
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { sellerId: seller.id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: { sellerId: seller.id },
      }),
    ]);

    const items = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.toString()),
      stock: product.stock,
      images: JSON.parse(product.images),
      categoryId: product.categoryId,
      categoryName: product.category.name,
      sellerId: product.sellerId,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Helper methods
  private mapToDTO(seller: any): SellerDTO | SellerWithUserDTO {
    const baseDTO: SellerDTO = {
      id: seller.id,
      userId: seller.userId,
      storeName: seller.storeName,
      storeDescription: seller.storeDescription,
      storeLogo: seller.storeLogo,
      commissionRate: parseFloat(seller.commissionRate.toString()),
      isApproved: seller.isApproved,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    };

    if (seller.user) {
      return {
        ...baseDTO,
        user: {
          id: seller.user.id,
          firstName: seller.user.firstName,
          lastName: seller.user.lastName,
          email: seller.user.email,
        },
      };
    }

    return baseDTO;
  }

  private mapRequestToDTO(request: any): SellerRequestDTO | SellerRequestWithUserDTO {
    const baseDTO: SellerRequestDTO = {
      id: request.id,
      userId: request.userId,
      storeName: request.storeName,
      storeDescription: request.storeDescription,
      businessRegistration: request.businessRegistration,
      status: request.status,
      rejectionReason: request.rejectionReason,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };

    if (request.user) {
      return {
        ...baseDTO,
        user: {
          id: request.user.id,
          firstName: request.user.firstName,
          lastName: request.user.lastName,
          email: request.user.email,
        },
      };
    }

    return baseDTO;
  }
}
