import { IUserRepository } from '../repositories';
import { UserDTO, UpdateUserDTO, UserListFilters, UserStatus } from '../types';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(filters?: UserListFilters): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll(filters);
    return users.map(({ password, ...user }) => user as UserDTO);
  }

  async getUserById(id: number): Promise<UserDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO> {
    const user = await this.userRepository.update(id, data);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async validateUser(id: number): Promise<UserDTO> {
    const user = await this.userRepository.updateStatus(id, UserStatus.ACTIVE);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }

  async suspendUser(id: number): Promise<UserDTO> {
    const user = await this.userRepository.updateStatus(id, UserStatus.SUSPENDED);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }

  async activateUser(id: number): Promise<UserDTO> {
    const user = await this.userRepository.updateStatus(id, UserStatus.ACTIVE);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }
}
