import CategoryCard from "@/components/category-card";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import { Computer, Pizza, Shirt } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "@/hooks/use-products";

export default function Home() {
  const [category, setCategory] = useState<string>();
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useProducts({
    categoryId: category,
  });

  const categoryHandle = (id: number) => {
    setCategory(id.toString());
  };

  const renderProductsContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-10">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-10 px-5">
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
      <View className="h-full">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={products?.data?.items || []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 5, paddingBottom: 300 }}
          renderItem={({ item }) => (
            <View className="flex-1 m-1">
              <ProductCard {...item} />
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <SearchBar />
      <View className="mt-28 p-5 flex gap-4">
        <View>
          <Text className="text-base font-fsemibold">Catégories</Text>
          <View className="flex flex-row flex-wrap -m-1">
            {CATEGORIES.map((item) => (
              <View key={item.id} className="w-1/4 p-1">
                <CategoryCard
                  {...item}
                  onPress={categoryHandle}
                  active={category === item.id.toString()}
                />
              </View>
            ))}
          </View>
        </View>

        <Text className="text-base font-fsemibold">Produits populaires</Text>
        {renderProductsContent()}
      </View>
    </SafeAreaView>
  );
}

export const CATEGORIES = [
  {
    id: 1,
    name: "Électronique",
    title: "Tech",
    icon: Computer,
  },
  {
    id: 2,
    name: "Mode",
    title: "Mode",
    icon: Shirt,
  },
  {
    id: 3,
    name: "Maison",
    title: "Maison",
    icon: Pizza,
  },
  {
    id: 4,
    name: "Beauté",
    title: "Beauté",
    icon: Shirt,
  },
];
