import { useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.services";
import {
  ProductDTO,
  CreateProductDTO,
  UpdateProductDTO,
  UpdateStockDTO,
} from "@/types";
import { makeMutation, useSimpleQuery } from "@/utils/tanstaq";

export const useProducts = () => {
  return useSimpleQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });
};

export const useProduct = (id: number, enabled = true) => {
  return useSimpleQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled,
  });
};

export const useLowStockProducts = () => {
  return useSimpleQuery({
    queryKey: ["low-stock"],
    queryFn: productService.getLowStock,
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createProduct = makeMutation<CreateProductDTO, ProductDTO>({
    queryKey: ["create-product"],
    mutationFn: productService.create,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const createProductWithImages = makeMutation<
    { data: Omit<CreateProductDTO, "images">; imageUris: string[] },
    ProductDTO
  >({
    queryKey: ["create-product-with-images"],
    mutationFn: ({ data, imageUris }) =>
      productService.createWithImages(data, imageUris),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = makeMutation<
    { id: number; data: UpdateProductDTO },
    ProductDTO
  >({
    queryKey: ["update-product"],
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductWithImages = makeMutation<
    { id: number; data: Omit<UpdateProductDTO, "images">; imageUris: string[] },
    ProductDTO
  >({
    queryKey: ["update-product-with-images"],
    mutationFn: ({ id, data, imageUris }) =>
      productService.updateWithImages(id, data, imageUris),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = makeMutation<number, void>({
    queryKey: ["delete-product"],
    mutationFn: productService.delete,
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateStock = makeMutation<
    { id: number; data: UpdateStockDTO },
    ProductDTO
  >({
    queryKey: ["update-stock"],
    mutationFn: ({ id, data }) => productService.updateStock(id, data),
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    createProduct,
    createProductWithImages,
    updateProduct,
    updateProductWithImages,
    deleteProduct,
    updateStock,
  };
};
