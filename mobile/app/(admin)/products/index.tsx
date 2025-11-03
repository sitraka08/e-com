import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
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
import { Package } from "lucide-react-native";
import { useProducts, useProductMutations } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import TopNavigation from "@/components/top-navigation";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: productsResponse, isLoading, refetch } = useProducts();
  const { data: categoriesResponse } = useCategories();
  const { deleteProduct } = useProductMutations();

  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

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

  // if (isLoading) {
  //   return (
  //     <SafeAreaView className="flex-1">
  //       <View className="flex-1 items-center justify-center">
  //         <ActivityIndicator size="large" color="#0174D8" />
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView className="flex-1">
      <TopNavigation
        title="Produits"
        description={
          <Text>
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </Text>
        }
        noButton={true}
      />

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucun produit"
          message="Commencez par créer votre premier produit"
        />
      ) : (
        <FlatList
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
          contentContainerStyle={{ padding: 20 }}
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
        categories={categories}
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
        confirmVariant="danger"
        isLoading={deleteProduct.isPending}
      />
    </SafeAreaView>
  );
}
