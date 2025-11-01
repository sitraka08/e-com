import { PrismaClient } from '@prisma/client';
import { IAddressRepository } from './IAddressRepository';
import { Address, CreateAddressDTO, UpdateAddressDTO } from '../types';

export class AddressRepository implements IAddressRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateAddressDTO): Promise<Address> {
    const addressCount = await this.prisma.address.count({ where: { userId: data.userId } });
    if (addressCount >= 5) {
      throw new Error('Maximum 5 addresses per user');
    }

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId: data.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({ data });
  }

  async findById(id: number): Promise<Address | null> {
    return this.prisma.address.findUnique({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async update(id: number, data: UpdateAddressDTO): Promise<Address> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new Error('Address not found');

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId: address.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.address.delete({ where: { id } });
  }

  async setAsDefault(userId: number, addressId: number): Promise<Address> {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  async findDefault(userId: number): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }
}
