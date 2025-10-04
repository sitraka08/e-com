import CategoryCard from "@/components/category-card";
import SearchBar from "@/components/search-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1">
      <SearchBar />
      <View className="mt-36 p-5">
        <Text className="text-base font-fsemibold">Catégories</Text>
        <View className="flex flex-row flex-wrap -m-1">
          {CATEGORIES.map((item) => (
            <View key={item.id} className="w-1/4 p-1">
              <CategoryCard name={item.name} icon={item.icon} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export const CATEGORIES = [
  {
    id: 1,
    name: "Mode",
    icon: "👗",
  },
  {
    id: 2,
    name: "High-Tech",
    icon: "📱",
  },
  {
    id: 3,
    name: "Maison",
    icon: "🏠",
  },
  {
    id: 4,
    name: "Beauté",
    icon: "💄",
  },
];
