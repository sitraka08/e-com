import { PrismaClient } from '@prisma/client';
import { IOtpRepository } from './IOtpRepository';
import { OtpReset } from '../types';

export class OtpRepository implements IOtpRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number, email: string, otp: string, expiresAt: Date): Promise<OtpReset> {
    return this.prisma.otpReset.create({
      data: {
        userId,
        email,
        otp,
        expiresAt,
      },
    });
  }

  async findByEmailAndOtp(email: string, otp: string): Promise<OtpReset | null> {
    return this.prisma.otpReset.findFirst({
      where: {
        email,
        otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markAsUsed(id: number): Promise<OtpReset> {
    return this.prisma.otpReset.update({
      where: { id },
      data: { used: true },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.otpReset.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}
