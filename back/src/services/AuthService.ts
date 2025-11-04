import { IUserRepository, IOtpRepository } from '../repositories';
import { RegisterDTO, LoginDTO, ForgotPasswordDTO, ResetPasswordDTO, AuthResponse, UserDTO } from '../types';
import { hashPassword, comparePassword, generateToken, generateOTP, getOTPExpiryDate, isOTPExpired, ConflictError, AuthenticationError, NotFoundError, ValidationError } from '../utils';
import { EmailService } from './EmailService';

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private emailService: EmailService
  ) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Cet email est déjà utilisé');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: 'CLIENT',
    });

    const token = generateToken({
      id: user.id,
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
      throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    if (user.status === 'SUSPENDED') {
      throw new AuthenticationError('Votre compte a été suspendu');
    }

    await this.userRepository.updateLastLogin(user.id);

    const token = generateToken({
      id: user.id,
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

  async forgotPassword(data: ForgotPasswordDTO): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new NotFoundError('Aucun compte n\'existe avec cet email');
    }

    const otp = generateOTP(5);
    const expiresAt = getOTPExpiryDate(15);

    await this.otpRepository.create(user.id, data.email, otp, expiresAt);

    try {
      const userName = `${user.firstName} ${user.lastName}`;
      await this.emailService.sendOTPEmail(data.email, otp, userName);

      return { message: 'Code de vérification envoyé par email' };
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Impossible d\'envoyer l\'email. Veuillez réessayer plus tard.');
    }
  }

  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const otpRecord = await this.otpRepository.findByEmailAndOtp(data.email, data.otp);
    if (!otpRecord) {
      throw new ValidationError('Code OTP invalide ou expiré');
    }

    if (isOTPExpired(otpRecord.expiresAt)) {
      throw new ValidationError('Le code OTP a expiré');
    }

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await this.userRepository.update(user.id, { password: hashedPassword });
    await this.otpRepository.markAsUsed(otpRecord.id);
  }

  async getProfile(userId: number): Promise<UserDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }
}
