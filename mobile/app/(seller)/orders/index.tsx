import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderDTO } from "@/types";
import OrderListItem from "@/components/admin/list-items/order-list-item";
import OrderDetailSheet from "@/components/admin/bottom-sheets/order-detail-sheet";
import OrderStatusSheet from "@/components/admin/bottom-sheets/order-status-sheet";
import EmptyState from "@/components/admin/empty-state";
import { useOrders } from "@/hooks/use-orders";
import { useAuthStore } from "@/stores/useAuthStore";
import TopNavigation from "@/components/top-navigation";

export default function SellerOrders() {
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const { user } = useAuthStore();
  const { data: ordersResponse, isLoading, refetch } = useOrders();

  const sellerOrders = useMemo(() => {
    if (!ordersResponse?.data?.items || !user) return [];

    return ordersResponse.data.items.filter((order) => {
      return order.items.some((item) => {
        return item.product.sellerId !== null;
      });
    });
  }, [ordersResponse?.data?.items, user]);

  const handleViewDetails = (order: OrderDTO) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
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
          contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}

      <OrderDetailSheet
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder || undefined}
      />

      <OrderStatusSheet
        isOpen={isStatusOpen}
        onClose={() => {
          setIsStatusOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder || undefined}
      />
    </SafeAreaView>
  );
}
