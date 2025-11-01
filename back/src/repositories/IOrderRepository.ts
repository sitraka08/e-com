import { Order, CreateOrderDTO, UpdateOrderStatusDTO, OrderFilters, PaginationParams, PaginatedResponse, OrderStatsDTO } from '../types';

export interface IOrderRepository {
  create(data: CreateOrderDTO): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findAll(filters?: OrderFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Order>>;
  update(id: number, data: UpdateOrderStatusDTO): Promise<Order>;
  cancel(id: number): Promise<Order>;
  updateTotalPaid(id: number, amount: number): Promise<Order>;
  getStats(): Promise<OrderStatsDTO>;
  getUnpaidOrders(): Promise<Order[]>;
}
