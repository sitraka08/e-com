import { z } from 'zod';

export const OrderItemInputSchema = z.object({
  productId: z.number().int().positive('ID de produit invalide'),
  quantity: z.number().int().positive('La quantité doit être supérieure à 0'),
});

export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;

export const PaymentDetailsSchema = z.object({
  paymentMethodId: z.number().int().positive('ID de méthode de paiement invalide'),
  amount: z.number().positive('Le montant doit être supérieur à 0'),
  transactionId: z
    .string()
    .min(1, 'L\'ID de transaction est requis')
    .max(200, 'L\'ID de transaction ne peut pas dépasser 200 caractères'),
});

export type PaymentDetails = z.infer<typeof PaymentDetailsSchema>;

export const CreateOrderSchema = z.object({
  addressId: z.number().int().positive('ID d\'adresse invalide'),
  items: z
    .array(OrderItemInputSchema)
    .min(1, 'Au moins un produit est requis')
    .max(50, 'Maximum 50 produits par commande'),
  deliveryFee: z.number().nonnegative('Les frais de livraison ne peuvent pas être négatifs'),
  paymentDetails: z
    .array(PaymentDetailsSchema)
    .min(1, 'Au moins un paiement est requis')
    .optional(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    message: 'Statut de commande invalide',
  }),
});

export type UpdateOrderStatusDTO = z.infer<typeof UpdateOrderStatusSchema>;
