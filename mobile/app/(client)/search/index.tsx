import ProductCard from "@/components/product-card";
import TopNavigation from "@/components/top-navigation";
import { ProductType } from "@/types/product";
import { Computer, Pizza, Shirt } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  return (
    <SafeAreaView className="flex-1">
      <TopNavigation title="Recherche" withIput />
      <View className="mt-24 p-5 h-full flex gap-4">
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
    title: "Food",
    icon: Pizza,
  },
  {
    id: 2,
    name: "INFORMATIQUE",
    title: "Tech",
    icon: Computer,
  },
  {
    id: 3,
    name: "MAISON",
    title: "Maison",
    icon: Shirt,
  },
  {
    id: 4,
    name: "BEAUTE",
    title: "Beauté",
    icon: Shirt,
  },
];

export const PRODUCTS: ProductType[] = [
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
