import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/button/button';
import Input from '@/components/input';
import { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO, CreateCategorySchema, UpdateCategorySchema } from '@/types';
import { useCategoryMutations } from '@/hooks/use-categories';

interface CategoryFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryDTO;
}

export default function CategoryFormSheet({
  isOpen,
  onClose,
  category,
}: CategoryFormSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { createCategory, updateCategory } = useCategoryMutations();
  const isEditMode = !!category;

  const form = useForm<CreateCategoryDTO | UpdateCategoryDTO>({
    resolver: zodResolver(isEditMode ? UpdateCategorySchema : CreateCategorySchema),
    defaultValues: isEditMode
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description,
        }
      : {
          name: '',
          slug: '',
          description: '',
        },
  });

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      if (category) {
        form.reset({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
        });
      }
    } else {
      bottomSheetRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, category]);

  const onSubmit = async (data: CreateCategoryDTO | UpdateCategoryDTO) => {
    try {
      if (isEditMode && category) {
        await updateCategory.mutateAsync({ id: category.id, data });
      } else {
        await createCategory.mutateAsync(data as CreateCategoryDTO);
      }
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['70%']}
      enablePanDownToClose
      onClose={onClose}
      index={-1}
      backgroundStyle={{ backgroundColor: '#fff' }}
    >
      <BottomSheetScrollView className="flex-1 px-5">
        <Text className="text-2xl font-fbold text-gray-900 mb-5">
          {isEditMode ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </Text>

        <Input
          form={form}
          name="name"
          label="Nom de la catégorie"
          placeholder="Ex: Électronique"
        />

        <Input
          form={form}
          name="slug"
          label="Slug (URL)"
          placeholder="Ex: electronique"
          className="mt-3"
        />

        <Input
          form={form}
          name="description"
          label="Description (optionnel)"
          placeholder="Décrivez la catégorie..."
          className="mt-3"
        />

        <View className="mt-6 mb-4">
          <Button
            label={isEditMode ? 'Mettre à jour' : 'Créer la catégorie'}
            onPress={form.handleSubmit(onSubmit)}
            loading={createCategory.isPending || updateCategory.isPending}
            className="!bg-primary w-full h-14"
            textClassName="!text-white"
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
