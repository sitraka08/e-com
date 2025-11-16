import React, { useState } from "react";
import {
  Text,
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductDTO } from "@/types";
import ProductListItem from "@/components/admin/list-items/product-list-item";
import ProductFormSheet from "@/components/admin/bottom-sheets/product-form-sheet";
import ProductStockSheet from "@/components/admin/bottom-sheets/product-stock-sheet";
import ConfirmSheet from "@/components/admin/confirm-sheet";
import FAB from "@/components/admin/fab";
import EmptyState from "@/components/admin/empty-state";
import { useSellerProducts } from "@/hooks/useSeller";
import { useProductMutations } from "@/hooks/use-products";
import TopNavigation from "@/components/top-navigation";
import { STATIC_CATEGORIES } from "@/constants/categories";

export default function SellerProducts() {
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, error, refetch } = useSellerProducts();
  const { deleteProduct } = useProductMutations();

  const products = data?.data?.items || [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <TopNavigation
          title="Mes Produits"
          description="Erreur"
          noButton={true}
        />
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-red-500 text-center font-fmedium">
            Erreur lors du chargement des produits
          </Text>
          <Text className="text-gray-600 text-center mt-2 font-fregular">
            {error?.message || "Une erreur est survenue"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: ProductDTO) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleUpdateStock = (product: ProductDTO) => {
    setSelectedProduct(product);
    setIsStockOpen(true);
  };

  const handleDeletePrompt = (product: ProductDTO) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct.mutateAsync(selectedProduct.id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <SafeAreaView className="relative">
      <TopNavigation
        title="Mes Produits"
        description={
          <Text>
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </Text>
        }
        noButton={true}
      />

      {products.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          message="Commencez par ajouter vos premiers produits"
        />
      ) : (
        <FlatList
          className="mt-12 h-[110%]"
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductListItem
              product={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDeletePrompt(item)}
              onUpdateStock={() => handleUpdateStock(item)}
            />
          )}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}

      <FAB onPress={handleCreate} />

      <ProductFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct || undefined}
        categories={STATIC_CATEGORIES}
      />

      <ProductStockSheet
        isOpen={isStockOpen}
        onClose={() => {
          setIsStockOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct || undefined}
      />

      <ConfirmSheet
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={confirmDelete}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedProduct?.name}" ?`}
        confirmText="Supprimer"
      />
    </SafeAreaView>
  );
}
