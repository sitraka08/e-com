import { Address, CreateAddressDTO, UpdateAddressDTO } from '../types';

export interface IAddressRepository {
  create(data: CreateAddressDTO): Promise<Address>;
  findById(id: number): Promise<Address | null>;
  findByUserId(userId: number): Promise<Address[]>;
  update(id: number, data: UpdateAddressDTO): Promise<Address>;
  delete(id: number): Promise<void>;
  setAsDefault(userId: number, addressId: number): Promise<Address>;
  findDefault(userId: number): Promise<Address | null>;
}
