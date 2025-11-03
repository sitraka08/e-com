import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères'),
  price: z
    .number()
    .positive('Le prix doit être supérieur à 0')
    .max(1000000000, 'Le prix est trop élevé'),
  stock: z.number().int('Le stock doit être un nombre entier').nonnegative('Le stock ne peut pas être négatif'),
  categoryId: z.number().int().positive('Catégorie invalide'),
  images: z
    .array(
      z.string().refine(
        (val) => /^(https?:\/\/.+|file:\/\/.+|content:\/\/.+)$/.test(val),
        'URL d\'image invalide'
      )
    )
    .min(1, 'Au moins une image est requise')
    .max(5, 'Maximum 5 images par produit')
    .optional(),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .optional(),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .optional(),
  price: z
    .number()
    .positive('Le prix doit être supérieur à 0')
    .max(1000000000, 'Le prix est trop élevé')
    .optional(),
  stock: z
    .number()
    .int('Le stock doit être un nombre entier')
    .nonnegative('Le stock ne peut pas être négatif')
    .optional(),
  categoryId: z.number().int().positive('Catégorie invalide').optional(),
  images: z
    .array(
      z.string().refine(
        (val) => /^(https?:\/\/.+|file:\/\/.+|content:\/\/.+)$/.test(val),
        'URL d\'image invalide'
      )
    )
    .max(5, 'Maximum 5 images par produit')
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;

export const UpdateStockSchema = z.object({
  quantity: z.number().int().positive('La quantité doit être supérieure à 0'),
  operation: z.enum(['add', 'subtract', 'set'], {
    errorMap: () => ({ message: 'Opération invalide (add, subtract, set)' }),
  }),
});

export type UpdateStockDTO = z.infer<typeof UpdateStockSchema>;
