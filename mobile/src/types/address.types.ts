import { z } from 'zod';

export const CreateAddressSchema = z.object({
  label: z
    .string()
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(50, 'Le libellé ne peut pas dépasser 50 caractères'),
  fullName: z
    .string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères'),
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères'),
  street: z
    .string()
    .min(5, 'La rue doit contenir au moins 5 caractères')
    .max(200, 'La rue ne peut pas dépasser 200 caractères'),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères'),
  region: z
    .string()
    .min(2, 'La région doit contenir au moins 2 caractères')
    .max(100, 'La région ne peut pas dépasser 100 caractères'),
  postalCode: z
    .string()
    .max(20, 'Le code postal ne peut pas dépasser 20 caractères')
    .optional()
    .transform(val => val || null),
  isDefault: z.boolean().default(false),
});

export type CreateAddressDTO = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = z.object({
  label: z
    .string()
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(50, 'Le libellé ne peut pas dépasser 50 caractères')
    .optional(),
  fullName: z
    .string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères')
    .optional(),
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères')
    .optional(),
  street: z
    .string()
    .min(5, 'La rue doit contenir au moins 5 caractères')
    .max(200, 'La rue ne peut pas dépasser 200 caractères')
    .optional(),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères')
    .optional(),
  region: z
    .string()
    .min(2, 'La région doit contenir au moins 2 caractères')
    .max(100, 'La région ne peut pas dépasser 100 caractères')
    .optional(),
  postalCode: z
    .string()
    .max(20, 'Le code postal ne peut pas dépasser 20 caractères')
    .optional()
    .transform(val => val || null),
  isDefault: z.boolean().optional(),
});

export type UpdateAddressDTO = z.infer<typeof UpdateAddressSchema>;
