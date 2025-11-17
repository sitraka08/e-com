import { useQueryClient } from "@tanstack/react-query";
import { favoriteServices } from "@/services/favorite.services";
import { FavoriteWithProductDTO } from "@/types/api.types";
import { makeMutation, useSimpleQuery } from "@/utils/tanstaq";

export const useFavorites = () => {
  return useSimpleQuery<FavoriteWithProductDTO[]>({
    queryKey: ["favorites"],
    queryFn: favoriteServices.getUserFavorites,
  });
};

export const useCheckFavorite = (productId: number) => {
  return useSimpleQuery<boolean>({
    queryKey: ["favorite", "check", productId],
    queryFn: () => favoriteServices.checkFavorite(productId),
    enabled: !!productId,
  });
};

export const useFavoriteMutations = () => {
  const queryClient = useQueryClient();

  const addFavorite = makeMutation<number, FavoriteWithProductDTO>({
    queryKey: ["add-favorite"],
    mutationFn: favoriteServices.addFavorite,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavorite = makeMutation<number, void>({
    queryKey: ["remove-favorite"],
    mutationFn: favoriteServices.removeFavorite,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    addFavorite,
    removeFavorite,
  };
};
