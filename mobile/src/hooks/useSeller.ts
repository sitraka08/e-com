import { useQueryClient } from "@tanstack/react-query";
import { sellerServices } from "@/services/seller.services";
import {
  SellerWithUserDTO,
  CreateSellerRequestDTO,
  UpdateSellerDTO,
  SellerRequestDTO,
  SellerStatsDTO,
  ProductDTO,
  PaginatedResponse,
  SellerDTO,
} from "@/types/api.types";
import { makeMutation, useSimpleQuery } from "@/utils/tanstaq";

export const useSellerProfile = () => {
  return useSimpleQuery<SellerWithUserDTO>({
    queryKey: ["seller", "profile"],
    queryFn: sellerServices.getSellerProfile,
  });
};

export const useSellerStats = () => {
  return useSimpleQuery<SellerStatsDTO>({
    queryKey: ["seller", "stats"],
    queryFn: sellerServices.getSellerStats,
  });
};

export const useSellerProducts = () => {
  return useSimpleQuery<PaginatedResponse<ProductDTO>>({
    queryKey: ["seller", "products"],
    queryFn: sellerServices.getSellerProducts,
  });
};

export const useSellerRequest = () => {
  return useSimpleQuery<SellerRequestDTO | null>({
    queryKey: ["seller", "request"],
    queryFn: sellerServices.getSellerRequestStatus,
  });
};

export const useSellerMutations = () => {
  const queryClient = useQueryClient();

  const submitRequest = makeMutation<CreateSellerRequestDTO, SellerRequestDTO>({
    queryKey: ["submit-seller-request"],
    mutationFn: sellerServices.submitSellerRequest,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "request"] });
    },
  });

  const updateProfile = makeMutation<UpdateSellerDTO, SellerDTO>({
    queryKey: ["update-seller-profile"],
    mutationFn: sellerServices.updateSellerProfile,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "profile"] });
    },
  });

  return {
    submitRequest,
    updateProfile,
  };
};
