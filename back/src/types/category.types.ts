export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}
