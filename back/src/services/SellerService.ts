import { PrismaClient } from '@prisma/client';
import { ISellerRepository, ISellerRequestRepository, IOrderRepository } from '../repositories';
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
  OrderFilters,
  PaginationParams,
  PaginatedResponse,
  Order,
  UpdateOrderStatusDTO,
  OrderStatus,
} from '../types';
import { EmailService } from './EmailService';

export class SellerService {
  constructor(
    private sellerRepository: ISellerRepository,
    private sellerRequestRepository: ISellerRequestRepository,
    private orderRepository: IOrderRepository,
    private prisma: PrismaClient,
    private emailService?: EmailService
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

  async approveSeller(sellerId: number, data?: UpdateCommissionRateDTO): Promise<SellerDTO> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    if (seller.isApproved) {
      throw new Error('Seller is already approved');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updateData: any = { isApproved: true };

      if (data?.commissionRate) {
        updateData.commissionRate = data.commissionRate;
      }

      const updatedSeller = await tx.seller.update({
        where: { id: sellerId },
        data: updateData,
      });

      await tx.user.update({
        where: { id: seller.userId },
        data: { status: 'ACTIVE' }
      });

      return this.mapToDTO(updatedSeller) as SellerDTO;
    });
  }

  async approveSellerRequest(requestId: number, adminId: number, data?: ApproveSellerRequestDTO): Promise<SellerDTO> {
    const request = await this.sellerRequestRepository.findById(requestId);
    if (!request) {
      throw new Error('Seller request not found');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Request has already been processed');
    }

    const existingSeller = await this.sellerRepository.findByUserId(request.userId);
    if (existingSeller) {
      throw new Error('User already has a seller account');
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.sellerRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });

      const seller = await tx.seller.create({
        data: {
          userId: request.userId,
          storeName: request.storeName,
          storeDescription: request.storeDescription,
          commissionRate: data?.commissionRate || 0.10,
          isApproved: false,
        },
      });

      await tx.user.update({
        where: { id: request.userId },
        data: {
          role: UserRole.SELLER,
          status: 'ACTIVE'
        },
      });

      return this.mapToDTO(seller) as SellerDTO;
    });
  }

  async rejectSeller(sellerId: number, _reason?: string): Promise<void> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    if (seller.isApproved) {
      throw new Error('Cannot reject an approved seller');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: seller.userId },
        data: {
          role: UserRole.CLIENT,
          status: 'ACTIVE'
        },
      });

      await tx.seller.delete({
        where: { id: sellerId },
      });
    });
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
        where: { sellerId: seller.id, isActive: true },
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
        where: { sellerId: seller.id, isActive: true },
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

  async getMyOrders(userId: number, filters?: OrderFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Order>> {
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new Error('Seller account not found');
    }

    return this.orderRepository.findBySellerId(seller.id, filters, pagination);
  }

  async getOrderById(userId: number, orderId: number): Promise<Order> {
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new Error('Seller account not found');
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Verify seller has items in this order
    const hasSellerItems = (order as any).items?.some((item: any) => item.sellerId === seller.id);
    if (!hasSellerItems) {
      throw new Error('You do not have permission to view this order');
    }

    return order;
  }

  async updateOrderStatus(userId: number, orderId: number, data: UpdateOrderStatusDTO): Promise<Order> {
    // 1. Get seller from userId
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new Error('Seller account not found');
    }

    // 2. Get order and verify seller has items in it
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const hasSellerItems = (order as any).items?.some((item: any) => item.sellerId === seller.id);
    if (!hasSellerItems) {
      throw new Error('You do not have permission to update this order');
    }

    // 3. Validate that sellers can only set certain statuses
    const allowedStatuses: OrderStatus[] = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    if (!allowedStatuses.includes(data.status as OrderStatus)) {
      throw new Error(`Sellers cannot set order status to ${data.status}`);
    }

    // 4. Validate status flow - cannot update delivered or cancelled orders
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new Error('Cannot update status of delivered or cancelled orders');
    }

    // 5. Update order status
    const updatedOrder = await this.orderRepository.update(orderId, data);

    // 6. Send email notification if order is shipped
    if (data.status === 'SHIPPED' && this.emailService) {
      try {
        const orderWithUser: any = await this.orderRepository.findById(orderId);
        if (orderWithUser && orderWithUser.user) {
          await this.emailService.sendOrderShippedEmailToClient(
            orderWithUser.user.email,
            {
              orderNumber: orderWithUser.orderNumber,
              clientName: `${orderWithUser.user.firstName} ${orderWithUser.user.lastName}`,
              total: Number(orderWithUser.total),
              estimatedDelivery: orderWithUser.estimatedDelivery,
              shippedAt: new Date(),
            }
          );
        }
      } catch (emailError) {
        console.error('Failed to send shipped email to client:', emailError);
        // Don't fail the status update if email fails
      }
    }

    return updatedOrder;
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
