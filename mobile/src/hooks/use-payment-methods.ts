import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/payment-method.services";
import { PaymentMethodDTO, PaymentMethodType } from "@/types";

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: paymentMethodService.getAll,
  });
};

export const usePaymentMethodMutations = () => {
  const queryClient = useQueryClient();

  const createPaymentMethod = useMutation({
    mutationFn: (data: {
      type: PaymentMethodType;
      label: string;
      details: Record<string, unknown>;
    }) => paymentMethodService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const updatePaymentMethod = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentMethodDTO> }) =>
      paymentMethodService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const deletePaymentMethod = useMutation({
    mutationFn: (id: number) => paymentMethodService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const setDefaultPaymentMethod = useMutation({
    mutationFn: (id: number) => paymentMethodService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  return {
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };
};
