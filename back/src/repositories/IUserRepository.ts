import { User, CreateUserDTO, UpdateUserDTO, UserListFilters } from '../types';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters?: UserListFilters): Promise<User[]>;
  update(id: number, data: UpdateUserDTO): Promise<User>;
  delete(id: number): Promise<void>;
  updateStatus(id: number, status: string): Promise<User>;
  updateLastLogin(id: number): Promise<void>;
}
