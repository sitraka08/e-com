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
  OrderDTO,
} from "@/types/api.types";
import { UpdateOrderStatusDTO } from "@/types/order.types";
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

export const useSellerOrders = (params?: { page?: number; limit?: number; status?: string }) => {
  return useSimpleQuery<PaginatedResponse<OrderDTO>>({
    queryKey: ["seller", "orders", JSON.stringify(params || {})],
    queryFn: () => sellerServices.getSellerOrders(params),
  });
};

export const useSellerOrder = (orderId: number) => {
  return useSimpleQuery<OrderDTO>({
    queryKey: ["seller", "order", orderId],
    queryFn: () => sellerServices.getSellerOrder(orderId),
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

  const updateOrderStatus = makeMutation<
    { orderId: number; data: UpdateOrderStatusDTO },
    OrderDTO
  >({
    queryKey: ["update-seller-order-status"],
    mutationFn: ({ orderId, data }) => sellerServices.updateOrderStatus(orderId, data),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller", "stats"] });
    },
  });

  return {
    submitRequest,
    updateProfile,
    updateOrderStatus,
  };
};
