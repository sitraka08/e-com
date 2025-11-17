import React, { useState } from "react";
import { Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductDTO } from "@/types";
import ProductListItem from "@/components/admin/list-items/product-list-item";
import ProductStockSheet from "@/components/admin/bottom-sheets/product-stock-sheet";
import { useProducts } from "@/hooks/use-products";
import TopNavigation from "@/components/top-navigation";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );
  const [isStockOpen, setIsStockOpen] = useState(false);

  const { data: productsResponse, isLoading, refetch } = useProducts();

  const products = productsResponse?.data?.items || [];

  const handleUpdateStock = (product: ProductDTO) => {
    setSelectedProduct(product);
    setIsStockOpen(true);
  };

  return (
    <SafeAreaView className="relative">
      <TopNavigation
        title="Produits"
        description={
          <Text>
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </Text>
        }
        noButton={true}
      />

      <FlatList
        className="mt-12 h-[110%]"
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductListItem
            product={item}
            onUpdateStock={() => handleUpdateStock(item)}
            readOnly
          />
        )}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />

      <ProductStockSheet
        isOpen={isStockOpen}
        onClose={() => {
          setIsStockOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct || undefined}
      />
    </SafeAreaView>
  );
}
