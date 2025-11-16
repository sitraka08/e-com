import SavedCartCard from "@/components/saved-cart-card";
import { useSavedCarts, useSavedCartMutations } from "@/hooks/useSavedCarts";
import useCartStore from "@/stores/useCartStore";
import { ShoppingCart, ArrowLeft } from "lucide-react-native";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SavedCarts() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useSavedCarts();
  const { restoreSavedCart, deleteSavedCart } = useSavedCartMutations();
  const { clearCart, addItem } = useCartStore();
  const savedCarts = data?.data || [];

  const handleRestore = async (id: number) => {
    restoreSavedCart.mutate(id, {
      onSuccess: (response) => {
        const items = response.data?.items || [];
        clearCart();
        items.forEach((item) => {
          addItem({
            id: item.productId,
            name: item.productName || "",
            price: item.productPrice || 0,
            images: item.productImage ? [item.productImage] : [],
            quantity: item.quantity,
          } as any);
        });
        router.back();
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteSavedCart.mutate(id);
  };

  const renderContent = () => {
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
            Impossible de charger les paniers
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

    if (savedCarts.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-10 px-5">
          <View className="bg-gray-100 rounded-full p-6 mb-4">
            <ShoppingCart size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-fbold text-gray-700 text-center mb-2">
            Aucun panier sauvegardé
          </Text>
          <Text className="text-sm font-fregular text-gray-500 text-center">
            Sauvegardez vos paniers pour y revenir plus tard
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={savedCarts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <SavedCartCard
            cart={item}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        )}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="p-5 border-b border-gray-200 flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-2xl font-fbold text-gray-800">
            Paniers Sauvegardés
          </Text>
          <Text className="text-sm font-fregular text-gray-500 mt-1">
            {savedCarts.length} panier{savedCarts.length > 1 ? "s" : ""}
          </Text>
        </View>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}
