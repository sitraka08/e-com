import { z } from 'zod';

export const CreatePaymentMethodSchema = z.object({
  type: z.enum(['MOBILE_MONEY', 'CREDIT_CARD', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'], {
    message: 'Type de paiement invalide',
  }),
  label: z
    .string()
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(100, 'Le libellé ne peut pas dépasser 100 caractères'),
  details: z.record(z.string(), z.any()).default({}),
  isDefault: z.boolean().default(false),
});

export type CreatePaymentMethodDTO = z.infer<typeof CreatePaymentMethodSchema>;

export const UpdatePaymentMethodSchema = z.object({
  label: z
    .string()
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(100, 'Le libellé ne peut pas dépasser 100 caractères')
    .optional(),
  details: z.record(z.string(), z.any()).optional(),
  isDefault: z.boolean().optional(),
});

export type UpdatePaymentMethodDTO = z.infer<typeof UpdatePaymentMethodSchema>;

export const ProcessPaymentSchema = z.object({
  orderId: z.number().int().positive('ID de commande invalide'),
  paymentMethodId: z.number().int().positive('ID de méthode de paiement invalide'),
  amount: z.number().positive('Le montant doit être supérieur à 0'),
  transactionId: z
    .string()
    .min(1, 'L\'ID de transaction est requis')
    .max(200, 'L\'ID de transaction ne peut pas dépasser 200 caractères'),
});

export type ProcessPaymentDTO = z.infer<typeof ProcessPaymentSchema>;

export const ProcessMultiPaymentSchema = z.object({
  orderId: z.number().int().positive('ID de commande invalide'),
  payments: z
    .array(
      z.object({
        paymentMethodId: z.number().int().positive('ID de méthode de paiement invalide'),
        amount: z.number().positive('Le montant doit être supérieur à 0'),
        transactionId: z
          .string()
          .min(1, 'L\'ID de transaction est requis')
          .max(200, 'L\'ID de transaction ne peut pas dépasser 200 caractères'),
      })
    )
    .min(1, 'Au moins un paiement est requis'),
});

export type ProcessMultiPaymentDTO = z.infer<typeof ProcessMultiPaymentSchema>;
