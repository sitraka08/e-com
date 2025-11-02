export interface Address {
  id: number;
  userId: number;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressDTO {
  id: number;
  userId: number;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  postalCode: string | null;
  isDefault: boolean;
}

export interface CreateAddressDTO {
  userId: number;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDTO {
  label?: string;
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  isDefault?: boolean;
}
