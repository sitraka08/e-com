import { useQueryClient } from "@tanstack/react-query";
import { savedCartServices } from "@/services/savedCart.services";
import { SavedCartDTO, CartItem, UpdateSavedCartDTO } from "@/types/api.types";
import { makeMutation, useSimpleQuery } from "@/utils/tanstaq";

export const useSavedCarts = () => {
  return useSimpleQuery<SavedCartDTO[]>({
    queryKey: ["savedCarts"],
    queryFn: savedCartServices.getUserSavedCarts,
  });
};

export const useSavedCart = (id: number, enabled = true) => {
  return useSimpleQuery<SavedCartDTO>({
    queryKey: ["savedCart", id],
    queryFn: () => savedCartServices.getSavedCartById(id),
    enabled,
  });
};

export const useSavedCartMutations = () => {
  const queryClient = useQueryClient();

  const createSavedCart = makeMutation<
    { name: string; items: CartItem[] },
    SavedCartDTO
  >({
    queryKey: ["create-savedCart"],
    mutationFn: ({ name, items }) => savedCartServices.createSavedCart(name, items),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCarts"] });
    },
  });

  const updateSavedCart = makeMutation<
    { id: number; data: UpdateSavedCartDTO },
    SavedCartDTO
  >({
    queryKey: ["update-savedCart"],
    mutationFn: ({ id, data }) => savedCartServices.updateSavedCart(id, data),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCarts"] });
    },
  });

  const deleteSavedCart = makeMutation<number, void>({
    queryKey: ["delete-savedCart"],
    mutationFn: savedCartServices.deleteSavedCart,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCarts"] });
    },
  });

  const restoreSavedCart = makeMutation<number, { items: CartItem[] }>({
    queryKey: ["restore-savedCart"],
    mutationFn: savedCartServices.restoreSavedCart,
  });

  return {
    createSavedCart,
    updateSavedCart,
    deleteSavedCart,
    restoreSavedCart,
  };
};
