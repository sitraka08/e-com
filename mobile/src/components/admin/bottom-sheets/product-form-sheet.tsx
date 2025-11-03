import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/button/button";
import Input from "@/components/input";
import InputSelect from "@/components/input-select";
import ImagePickerComponent from "@/components/admin/image-picker";
import {
  ProductDTO,
  CategoryDTO,
  CreateProductDTO,
  UpdateProductDTO,
  CreateProductSchema,
  UpdateProductSchema,
} from "@/types";
import { useProductMutations } from "@/hooks/use-products";
import { COLORS } from "@/constants/colors";

interface ProductFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductDTO;
  categories: CategoryDTO[];
}

export default function ProductFormSheet({
  isOpen,
  onClose,
  product,
  categories,
}: ProductFormSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { createProductWithImages, updateProductWithImages } =
    useProductMutations();
  const isEditMode = !!product;
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string>("");

  const form = useForm<Omit<CreateProductDTO | UpdateProductDTO, "images">>({
    resolver: zodResolver(
      isEditMode ? UpdateProductSchema : CreateProductSchema
    ),
    defaultValues: isEditMode
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          categoryId: undefined,
        },
  });

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (product) {
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
        });
        setImages(product.images || []);
      } else {
        setImages([]);
      }
      setImageError("");
    } else {
      bottomSheetRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product]);

  const onSubmit = async (
    data: Omit<CreateProductDTO | UpdateProductDTO, "images">
  ) => {
    if (images.length === 0) {
      setImageError("Au moins une image est requise");
      return;
    }

    if (images.length > 5) {
      setImageError("Maximum 5 images par produit");
      return;
    }

    try {
      if (isEditMode && product) {
        await updateProductWithImages.mutateAsync({
          id: product.id,
          data: data as Omit<UpdateProductDTO, "images">,
          imageUris: images,
        });
      } else {
        await createProductWithImages.mutateAsync({
          data: data as Omit<CreateProductDTO, "images">,
          imageUris: images,
        });
      }
      form.reset();
      setImages([]);
      setImageError("");
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["60%"]}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{
        backgroundColor: "#edf4fc",
        borderWidth: 1,
        borderColor: COLORS.primary,
      }}
    >
      <BottomSheetScrollView className="flex-1 px-5 gap-2">
        <Text className="text-xl font-fbold text-primary mb-5">
          {isEditMode ? "Modifier le produit" : "Nouveau produit"}
        </Text>
        <View className="flex gap-4">
          <Input
            form={form}
            name="name"
            label="Nom du produit"
            placeholder="Ex: iPhone 15 Pro"
            isAdmin
          />

          <Input
            form={form}
            name="description"
            label="Description"
            placeholder="Décrivez le produit..."
            isAdmin
          />

          <Input
            form={form}
            name="price"
            label="Prix (Ar)"
            placeholder="0"
            isAdmin
          />

          <Input
            form={form}
            name="stock"
            label="Stock"
            placeholder="0"
            isAdmin
          />

          <InputSelect
            form={form}
            name="categoryId"
            label="Catégorie"
            options={categoryOptions}
            placeholder="Sélectionner une catégorie"
            isAdmin
          />

          <View>
            <ImagePickerComponent
              value={images}
              onChange={(newImages) => {
                setImages(newImages);
                setImageError("");
              }}
              maxImages={5}
              error={imageError}
            />
          </View>
        </View>

        <View className="mb-4">
          <Button
            label={isEditMode ? "Mettre à jour" : "Créer le produit"}
            onPress={form.handleSubmit(onSubmit)}
            loading={
              createProductWithImages.isPending ||
              updateProductWithImages.isPending
            }
            className="!bg-primary w-full h-14"
            textClassName="!text-white"
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
