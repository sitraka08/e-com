import { useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.services";
import { UserDTO, UpdateUserDTO } from "@/types";
import { makeMutation, useSimpleQuery } from "@/utils/tanstaq";
import useDebounced from "./useDebounced";

interface UseUsersParams {
  page?: string;
  search?: string;
  limit?: string;
}

export const useUsers = ({
  page = "1",
  search = "",
  limit = "10",
}: UseUsersParams = {}) => {
  const debouncedSearch = useDebounced(search, 300);

  return useSimpleQuery<UserDTO[]>({
    queryKey: ["users", debouncedSearch, page, limit],
    queryFn: () =>
      userService.getAll({
        page,
        search: debouncedSearch,
        limit,
      }),
  });
};

export const useUser = (id: number, enabled = true) => {
  return useSimpleQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getById(id),
    enabled,
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const updateUser = makeMutation<{ id: number; data: UpdateUserDTO }, UserDTO>(
    {
      queryKey: ["update-user"],
      mutationFn: ({ id, data }) => userService.update(id, data),
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    }
  );

  const deleteUser = makeMutation<number, void>({
    queryKey: ["delete-user"],
    mutationFn: userService.delete,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const validateUser = makeMutation<number, UserDTO>({
    queryKey: ["validate-user"],
    mutationFn: userService.validate,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const suspendUser = makeMutation<number, UserDTO>({
    queryKey: ["suspend-user"],
    mutationFn: userService.suspend,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const activateUser = makeMutation<number, UserDTO>({
    queryKey: ["activate-user"],
    mutationFn: userService.activate,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    updateUser,
    deleteUser,
    validateUser,
    suspendUser,
    activateUser,
  };
};
