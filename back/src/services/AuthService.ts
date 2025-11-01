import { IUserRepository, IOtpRepository } from '../repositories';
import { RegisterDTO, LoginDTO, ForgotPasswordDTO, ResetPasswordDTO, AuthResponse, UserDTO } from '../types';
import { hashPassword, comparePassword, generateToken, generateOTP, getOTPExpiryDate, isOTPExpired } from '../utils';

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository
  ) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: 'CLIENT',
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      tokens: {
        accessToken: token,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Account suspended');
    }

    await this.userRepository.updateLastLogin(user.id);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      tokens: {
        accessToken: token,
      },
    };
  }

  async forgotPassword(data: ForgotPasswordDTO): Promise<{ otp: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = generateOTP(5);
    const expiresAt = getOTPExpiryDate(15);

    await this.otpRepository.create(user.id, data.email, otp, expiresAt);

    return { otp };
  }

  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const otpRecord = await this.otpRepository.findByEmailAndOtp(data.email, data.otp);
    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    if (isOTPExpired(otpRecord.expiresAt)) {
      throw new Error('OTP has expired');
    }

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await this.userRepository.update(user.id, { password: hashedPassword });
    await this.otpRepository.markAsUsed(otpRecord.id);
  }

  async getProfile(userId: number): Promise<UserDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }
}
