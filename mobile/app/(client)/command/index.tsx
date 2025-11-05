import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavigation from "@/components/top-navigation";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import OrderCard from "@/components/order-card";
import { useOrders } from "@/hooks/use-orders";
import { ShoppingBag } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Command() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isLoadingAuthStore } = useAuthStore();
  const page = "1";
  const { data, isLoading, isError, error, refetch } = useOrders({
    page,
    limit: "20",
  });

  const orders = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  useEffect(() => {
    if (!isLoadingAuthStore && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoadingAuthStore, router]);

  const handleRefresh = async () => {
    await refetch();
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading && orders.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0174D8" />
        <Text className="font-fmedium text-gray-600 mt-4">Chargement...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <TopNavigation
          title="Mes Commandes"
          description="Retrouve la liste de tes commandes"
        />
        <View className="flex-1 items-center justify-center px-5">
          <Text className="font-fbold text-xl text-red-600 mb-2">Erreur</Text>
          <Text className="font-fregular text-gray-600 text-center">
            {error?.message ||
              "Une erreur est survenue lors du chargement de vos commandes."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopNavigation
        title="Mes Commandes"
        description="Retrouve la liste de tes commandes"
      />
      <View className="flex-1 px-5">
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 70,
          }}
          renderItem={({ item }) => <OrderCard order={item} />}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <ShoppingBag size={64} color="#D1D5DB" strokeWidth={1.5} />
              <Text className="font-fbold text-xl text-gray-800 mt-6 mb-2">
                Aucune commande
              </Text>
              <Text className="font-fregular text-gray-600 text-center px-8">
                Vous n'avez pas encore passé de commande. Commencez vos achats
                dès maintenant !
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={["#0174D8"]}
              tintColor="#0174D8"
            />
          }
        />
        {pagination && pagination.totalPages > 1 && (
          <View className="py-4 flex flex-row justify-center items-center">
            <Text className="font-fmedium text-gray-600">
              Page {pagination.page} sur {pagination.totalPages}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
