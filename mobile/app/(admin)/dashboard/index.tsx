import React from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "@/components/admin/stat-card";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react-native";
import { useOrderStats, useOrders } from "@/hooks/use-orders";
import { useLowStockProducts } from "@/hooks/use-products";
import TopNavigation from "@/components/top-navigation";

export default function Dashboard() {
  const {
    data: statsResponse,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useOrderStats();
  const {
    data: lowStockResponse,
    isLoading: lowStockLoading,
    refetch: refetchLowStock,
  } = useLowStockProducts();
  const { data: ordersResponse, refetch: refetchOrders } = useOrders();

  const stats = statsResponse?.data;
  const lowStockProducts = lowStockResponse?.data || [];
  const recentOrders = (ordersResponse?.data || []).slice(0, 5);

  const isLoading = statsLoading || lowStockLoading;

  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchLowStock(), refetchOrders()]);
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
    <SafeAreaView className="flex-1">
      <TopNavigation
        title="Tableau de bord"
        description="   Vue d'ensemble de votre boutique"
        noButton={true}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View className="px-5 pb-4 pt-24">
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <StatCard
                title="Commandes"
                value={stats?.totalOrders || 0}
                icon={ShoppingCart}
                iconColor="#0174D8"
                iconBgColor="#E0F2FE"
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Revenu"
                value={`${(stats?.totalRevenue || 0).toLocaleString()} Ar`}
                icon={DollarSign}
                iconColor="#10B981"
                iconBgColor="#D1FAE5"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard
                title="En attente"
                value={stats?.pendingOrders || 0}
                icon={Clock}
                iconColor="#F59E0B"
                iconBgColor="#FEF3C7"
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Stock faible"
                value={lowStockProducts.length}
                icon={AlertTriangle}
                iconColor="#EF4444"
                iconBgColor="#FEE2E2"
              />
            </View>
          </View>
        </View>

        {recentOrders.length > 0 && (
          <View className="px-5 pb-4">
            <Text className="text-lg font-fbold text-gray-900 mb-3">
              Commandes récentes
            </Text>
            {recentOrders.map((order) => (
              <View
                key={order.id}
                className="bg-white rounded-xl p-4 mb-2 border border-gray-200"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-fmedium text-gray-900">
                      #{order.orderNumber}
                    </Text>
                    <Text className="text-sm font-fregular text-gray-600 mt-1">
                      {order.user?.firstName} {order.user?.lastName}
                    </Text>
                  </View>
                  <Text className="text-base font-fbold text-primary">
                    {order.totalAmount.toLocaleString()} Ar
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {lowStockProducts.length > 0 && (
          <View className="px-5 pb-4">
            <Text className="text-lg font-fbold text-gray-900 mb-3">
              Produits en rupture
            </Text>
            {lowStockProducts.map((product) => (
              <View
                key={product.id}
                className="bg-red-50 rounded-xl p-4 mb-2 border border-red-200"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-fmedium text-gray-900">
                      {product.name}
                    </Text>
                    <Text className="text-sm font-fregular text-red-600 mt-1">
                      Stock: {product.stock}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
