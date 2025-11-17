import { IAddressRepository } from '../repositories';
import { AddressDTO, CreateAddressDTO, UpdateAddressDTO } from '../types';

export class AddressService {
  constructor(private addressRepository: IAddressRepository) {}

  async createAddress(data: CreateAddressDTO): Promise<AddressDTO> {
    const address = await this.addressRepository.create(data);
    return this.mapToDTO(address);
  }

  async getUserAddresses(userId: number): Promise<AddressDTO[]> {
    const addresses = await this.addressRepository.findByUserId(userId);
    return addresses.map(this.mapToDTO);
  }

  async getAddressById(id: number): Promise<AddressDTO> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new Error('Address not found');
    }
    return this.mapToDTO(address);
  }

  async updateAddress(id: number, data: UpdateAddressDTO): Promise<AddressDTO> {
    const address = await this.addressRepository.update(id, data);
    return this.mapToDTO(address);
  }

  async deleteAddress(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<AddressDTO> {
    const address = await this.addressRepository.setAsDefault(userId, addressId);
    return this.mapToDTO(address);
  }

  async getDefaultAddress(userId: number): Promise<AddressDTO | null> {
    const address = await this.addressRepository.findDefault(userId);
    return address ? this.mapToDTO(address) : null;
  }

  private mapToDTO(address: any): AddressDTO {
    return {
      id: address.id,
      userId: address.userId,
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      region: address.region,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    };
  }
}
