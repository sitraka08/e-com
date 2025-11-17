import EmptyState from "@/components/admin/empty-state";
import Button from "@/components/button/button";
import ProductCard from "@/components/product-card";
import TopNavigation from "@/components/top-navigation";
import useFavorisStore from "@/stores/useFavorisStore";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorisStore();

  const renderContent = () => {
    if (favorites.length === 0) {
      return (
        <EmptyState
          title="Aucun favori"
          message="Les produits que vous aimez apparaîtront ici"
        />
      );
    }

    return (
      <View className="h-full px-8">
        <FlatList
          className="mt-12 h-[110%]"
          showsVerticalScrollIndicator={false}
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View className="flex-1 m-1">
              <ProductCard {...item} />
            </View>
          )}
        />
        <Button
          label="Vider le favoris"
          variant="destructive"
          onPress={clearFavorites}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <TopNavigation
        title="Mes Favoris"
        description={
          <Text className="">
            {favorites.length} produit{favorites.length > 1 ? "s" : ""}
          </Text>
        }
      />

      {renderContent()}
    </SafeAreaView>
  );
}
