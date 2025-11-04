import { useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.services";
import { OrderDTO, UpdateOrderStatusDTO, PaginatedResponse } from "@/types";
import { makeMutation, useSimpleQuery } from "@/utils/tanstaq";
import useDebounced from "./useDebounced";

interface UseOrdersParams {
  page?: string;
  search?: string;
  limit?: string;
}

export const useOrders = ({
  page = "1",
  search = "",
  limit = "10",
}: UseOrdersParams = {}) => {
  const debouncedSearch = useDebounced(search, 300);

  return useSimpleQuery<PaginatedResponse<OrderDTO>>({
    queryKey: ["orders", debouncedSearch, page, limit],
    queryFn: () =>
      orderService.getAll({
        page,
        search: debouncedSearch,
        limit,
      }),
  });
};

export const useOrder = (id: number, enabled = true) => {
  return useSimpleQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id),
    enabled,
  });
};

export const useOrderStats = () => {
  return useSimpleQuery({
    queryKey: ["order-stats"],
    queryFn: orderService.getStats,
  });
};

export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  const updateOrderStatus = makeMutation<
    { id: number; data: UpdateOrderStatusDTO },
    OrderDTO
  >({
    queryKey: ["update-order-status"],
    mutationFn: ({ id, data }) => orderService.updateStatus(id, data),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });

  return {
    updateOrderStatus,
  };
};
