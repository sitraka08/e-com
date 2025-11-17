import { z } from 'zod';

export const RegisterSchema = z.object({
  firstName: z
    .string({ message: 'Le prénom est requis' })
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string({ message: 'Le nom est requis' })
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z
    .string({ message: 'L\'email est requis' })
    .min(1, 'L\'email est requis')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Adresse email invalide'),
  password: z
    .string({ message: 'Le mot de passe est requis' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .refine(
      (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  isSeller: z.boolean().optional(),
  storeName: z.string().optional(),
  storeDescription: z.string().optional(),
}).refine((data) => {
  if (data.isSeller) {
    return data.storeName && data.storeName.trim().length >= 3;
  }
  return true;
}, {
  message: 'Le nom du magasin doit contenir au moins 3 caractères',
  path: ['storeName'],
}).refine((data) => {
  if (data.isSeller) {
    return data.storeDescription && data.storeDescription.trim().length >= 10;
  }
  return true;
}, {
  message: 'La description doit contenir au moins 10 caractères',
  path: ['storeDescription'],
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z
    .string({ message: 'L\'email est requis' })
    .min(1, 'L\'email est requis')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Adresse email invalide'),
  password: z
    .string({ message: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe est requis'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ message: 'L\'email est requis' })
    .min(1, 'L\'email est requis')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Adresse email invalide'),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: z
    .string({ message: 'L\'email est requis' })
    .min(1, 'L\'email est requis')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Adresse email invalide'),
  otp: z
    .string({ message: 'Le code OTP est requis' })
    .length(5, 'Le code OTP doit contenir 5 chiffres'),
  newPassword: z
    .string({ message: 'Le nouveau mot de passe est requis' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .refine(
      (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;
