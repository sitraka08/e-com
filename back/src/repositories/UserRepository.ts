import { PrismaClient } from '@prisma/client';
import { IUserRepository } from './IUserRepository';
import { User, CreateUserDTO, UpdateUserDTO, UserListFilters } from '../types';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(filters?: UserListFilters): Promise<User[]> {
    const where: any = {};

    if (filters?.role) where.role = filters.role;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    return this.prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateStatus(id: number, status: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { status: status as any } });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
  }
}
