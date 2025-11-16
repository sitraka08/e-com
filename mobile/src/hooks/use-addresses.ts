import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.services";
import { AddressDTO, CreateAddressDTO, ApiResponse } from "@/types";
import { useSimpleQuery } from "@/utils/tanstaq";

export const useAddresses = () => {
  return useSimpleQuery({
    queryKey: ["addresses"],
    queryFn: addressService.getAll,
  });
};

export const useDefaultAddress = () => {
  return useSimpleQuery({
    queryKey: ["addresses", "default"],
    queryFn: addressService.getDefault,
  });
};

export const useAddressMutations = () => {
  const queryClient = useQueryClient();

  const createAddress = useMutation({
    mutationFn: (data: CreateAddressDTO) =>
      addressService.create(data),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["addresses"],
        (oldData?: ApiResponse<AddressDTO[]>) => ({
          ...oldData,
          success: true,
          data: [...(oldData?.data || []), response.data],
        })
      );

      if (response.data?.isDefault) {
        queryClient.setQueryData(["addresses", "default"], response);
      }
    },
  });

  const updateAddress = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddressDTO> }) =>
      addressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses", "default"] });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: (id: number) => addressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses", "default"] });
    },
  });

  const setDefaultAddress = useMutation({
    mutationFn: (id: number) => addressService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses", "default"] });
    },
  });

  return {
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
