import { UserRole, UserStatus, SellerRequestStatus } from './enums';

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSeller?: boolean;
  storeName?: string;
  storeDescription?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface SellerRequestInfo {
  id: number;
  storeName: string;
  storeDescription: string;
  status: SellerRequestStatus;
  createdAt: Date;
}

export interface AuthResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  };
  tokens: AuthTokens;
  sellerRequest?: SellerRequestInfo;
}

export interface TokenPayload {
  id: number;
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface OtpReset {
  id: number;
  userId: number;
  email: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}
