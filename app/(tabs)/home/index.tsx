import CategoryCard from "@/components/category-card";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import { ProductType } from "@/types/product";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [category, setCategory] = useState<string>();
  const categoryHandle = (name: string) => {
    setCategory(name);
  };
  return (
    <SafeAreaView className="flex-1">
      <SearchBar />
      <View className="mt-36 p-5 flex gap-4">
        <View>
          <Text className="text-base font-fsemibold">Catégories</Text>
          <View className="flex flex-row flex-wrap -m-1">
            {CATEGORIES.map((item) => (
              <View key={item.id} className="w-1/4 p-1">
                <CategoryCard
                  {...item}
                  onPress={categoryHandle}
                  active={category === item.name}
                />
              </View>
            ))}
          </View>
        </View>

        <Text className="text-base font-fsemibold">Produits populaires</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={PRODUCTS}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 5, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View className="flex-1 m-1">
              <ProductCard {...item} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export const CATEGORIES = [
  {
    id: 1,
    name: "MODE",
    title: "Mode",
    icon: "👗",
  },
  {
    id: 2,
    name: "INFORMATIQUE",
    title: "Tech",
    icon: "📱",
  },
  {
    id: 3,
    name: "MAISON",
    title: "Maison",
    icon: "🏠",
  },
  {
    id: 4,
    name: "BEAUTE",
    title: "Beauté",
    icon: "💄",
  },
];

const PRODUCTS: ProductType[] = [
  {
    id: 1,
    name: "T-shirt Homme",
    image: "https://picsum.photos/200/300",
    price: 19.99,
  },
  {
    id: 2,
    name: "Smartphone X",
    image: "https://via.placeholder.com/150",
    price: 499.99,
  },
  {
    id: 3,
    name: "Chaussures Sport",
    image: "https://via.placeholder.com/150",
    price: 79.99,
  },
  {
    id: 4,
    name: "Sac à main",
    image: "https://via.placeholder.com/150",
    price: 129.99,
  },
  {
    id: 5,
    name: "Tableau Décoratif",
    image: "https://via.placeholder.com/150",
    price: 59.99,
  },
  {
    id: 6,
    name: "Casque Audio",
    image: "https://via.placeholder.com/150",
    price: 89.99,
  },
  {
    id: 7,
    name: "Lunettes de Soleil",
    image: "https://via.placeholder.com/150",
    price: 49.99,
  },
  {
    id: 8,
    name: "Montre Classique",
    image: "https://via.placeholder.com/150",
    price: 199.99,
  },
  {
    id: 9,
    name: "Crème Visage",
    image: "https://via.placeholder.com/150",
    price: 29.99,
  },
  {
    id: 10,
    name: "Chaise Design",
    image: "https://via.placeholder.com/150",
    price: 149.99,
  },
];
