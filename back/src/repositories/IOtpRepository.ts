import { OtpReset } from '../types';

export interface IOtpRepository {
  create(userId: number, email: string, otp: string, expiresAt: Date): Promise<OtpReset>;
  findByEmailAndOtp(email: string, otp: string): Promise<OtpReset | null>;
  markAsUsed(id: number): Promise<OtpReset>;
  deleteExpired(): Promise<void>;
}
