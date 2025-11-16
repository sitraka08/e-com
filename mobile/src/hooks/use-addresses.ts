import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.services";
import { AddressDTO } from "@/types";

export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.getAll,
  });
};

export const useAddressMutations = () => {
  const queryClient = useQueryClient();

  const createAddress = useMutation({
    mutationFn: (data: Omit<AddressDTO, "id" | "userId" | "createdAt" | "updatedAt" | "isDefault">) =>
      addressService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const updateAddress = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddressDTO> }) =>
      addressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: (id: number) => addressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const setDefaultAddress = useMutation({
    mutationFn: (id: number) => addressService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  return {
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
