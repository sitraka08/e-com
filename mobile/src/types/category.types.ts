import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  slug: z
    .string()
    .min(2, 'Le slug doit contenir au moins 2 caractères')
    .max(100, 'Le slug ne peut pas dépasser 100 caractères')
    .refine(
      (val) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      'Le slug doit être en minuscules avec des tirets uniquement'
    ),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .nullable()
    .optional(),
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .optional(),
  slug: z
    .string()
    .min(2, 'Le slug doit contenir au moins 2 caractères')
    .max(100, 'Le slug ne peut pas dépasser 100 caractères')
    .refine(
      (val) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      'Le slug doit être en minuscules avec des tirets uniquement'
    )
    .optional(),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .nullable()
    .optional(),
});

export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
