import { useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.services";
import { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from "@/types";
import { makeMutation, useSimpleQuery } from "@/utils/tanstaq";

export const useCategories = () => {
  return useSimpleQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });
};

export const useCategory = (id: number, enabled = true) => {
  return useSimpleQuery({
    queryKey: ["category", id],
    queryFn: () => categoryService.getById(id),
    enabled,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategory = makeMutation<CreateCategoryDTO, CategoryDTO>({
    queryKey: ["create-category"],
    mutationFn: categoryService.create,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = makeMutation<
    { id: number; data: UpdateCategoryDTO },
    CategoryDTO
  >({
    queryKey: ["update-category"],
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = makeMutation<number, void>({
    queryKey: ["delete-category"],
    mutationFn: categoryService.delete,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
