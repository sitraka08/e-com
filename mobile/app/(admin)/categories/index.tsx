import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryDTO } from '@/types';
import CategoryListItem from '@/components/admin/list-items/category-list-item';
import CategoryFormSheet from '@/components/admin/bottom-sheets/category-form-sheet';
import ConfirmSheet from '@/components/admin/confirm-sheet';
import FAB from '@/components/admin/fab';
import EmptyState from '@/components/admin/empty-state';
import { FolderOpen } from 'lucide-react-native';
import { useCategories, useCategoryMutations } from '@/hooks/use-categories';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: categoriesResponse, isLoading, refetch } = useCategories();
  const { deleteCategory } = useCategoryMutations();

  const categories = categoriesResponse?.data || [];

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: CategoryDTO) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (category: CategoryDTO) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 py-4 border-b border-gray-200">
        <Text className="text-2xl font-fbold text-gray-900">Catégories</Text>
        <Text className="text-sm font-fregular text-gray-600 mt-1">
          {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Aucune catégorie"
          message="Commencez par créer votre première catégorie"
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryListItem
              category={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDeletePrompt(item)}
            />
          )}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}

      <FAB onPress={handleCreate} />

      <CategoryFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory || undefined}
      />

      <ConfirmSheet
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={confirmDelete}
        title="Supprimer la catégorie"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedCategory?.name}" ?`}
        confirmText="Supprimer"
        confirmVariant="danger"
        isLoading={deleteCategory.isPending}
      />
    </SafeAreaView>
  );
}
