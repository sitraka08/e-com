import React from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { OrderDTO } from "@/types";
import OrderListItem from "@/components/admin/list-items/order-list-item";
import EmptyState from "@/components/admin/empty-state";
import { useSellerOrders } from "@/hooks/useSeller";
import TopNavigation from "@/components/top-navigation";

export default function SellerOrders() {
  const { data: ordersResponse, isLoading, refetch } = useSellerOrders();

  const sellerOrders = ordersResponse?.data?.items || [];

  const handleViewDetails = (order: OrderDTO) => {
    router.push(`/(seller)/orders/${order.id}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <TopNavigation
        title="Mes Commandes"
        description={
          <Text>
            {sellerOrders.length} commande{sellerOrders.length !== 1 ? "s" : ""}
          </Text>
        }
        noButton={true}
      />

      {sellerOrders.length === 0 ? (
        <EmptyState
          title="Aucune commande"
          message="Les commandes contenant vos produits apparaîtront ici"
        />
      ) : (
        <FlatList
          className="h-[110%] mt-12"
          data={sellerOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderListItem
              order={item}
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          contentContainerStyle={{ padding: 20, paddingBottom: 200 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}
    </SafeAreaView>
  );
}
