import ProductCard from "@/components/product-card";
import TopNavigation from "@/components/top-navigation";
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "@/hooks/use-products";
import { useState } from "react";
import EmptyState from "@/components/admin/empty-state";

export default function Search() {
  const [search, setSearch] = useState("");
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useProducts({
    search,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-base font-fmedium text-gray-600 text-center mb-4">
            Impossible de charger les produits
          </Text>
          <Text className="text-sm font-fregular text-gray-500 text-center mb-6">
            Vérifiez votre connexion ou réessayez plus tard
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-xl"
            onPress={() => refetch()}
          >
            <Text className="text-white font-fsemibold">Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products?.data?.items || []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 5, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View className="flex-1 m-1">
            <ProductCard {...item} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            className="mt-10"
            title="Produit"
            message="Essayez avec un autre terme de recherche"
          />
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <TopNavigation
        title="Recherche"
        withIput
        onChange={(v) => setSearch(v)}
      />
      <View className="mt-24 p-5 h-full flex gap-4">{renderContent()}</View>
    </SafeAreaView>
  );
}
