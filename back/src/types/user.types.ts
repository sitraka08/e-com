import { UserRole, UserStatus } from './enums';
export { UserRole, UserStatus };

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UserListFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}
