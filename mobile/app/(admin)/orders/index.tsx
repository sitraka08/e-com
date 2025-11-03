import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderDTO } from '@/types';
import OrderListItem from '@/components/admin/list-items/order-list-item';
import OrderDetailSheet from '@/components/admin/bottom-sheets/order-detail-sheet';
import OrderStatusSheet from '@/components/admin/bottom-sheets/order-status-sheet';
import EmptyState from '@/components/admin/empty-state';
import { ClipboardList } from 'lucide-react-native';
import { useOrders } from '@/hooks/use-orders';

export default function OrdersScreen() {
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const { data: ordersResponse, isLoading, refetch } = useOrders();
  const orders = ordersResponse?.data || [];

  const handleViewDetails = (order: OrderDTO) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 py-4 border-b border-gray-200">
        <Text className="text-2xl font-fbold text-gray-900">Commandes</Text>
        <Text className="text-sm font-fregular text-gray-600 mt-1">
          {orders.length} commande{orders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Aucune commande"
          message="Aucune commande n'a été passée"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderListItem
              order={item}
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          contentContainerStyle={{ padding: 20 }}
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
