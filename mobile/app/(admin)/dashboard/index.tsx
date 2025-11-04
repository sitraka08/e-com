import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import StatCard from "@/components/admin/stat-card";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react-native";
import { useOrderStats, useOrders } from "@/hooks/use-orders";
import { useLowStockProducts, useProducts } from "@/hooks/use-products";
import TopNavigation from "@/components/top-navigation";
import { STATIC_CATEGORIES } from "@/constants/categories";

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
  const { data: productsResponse } = useProducts();

  const stats = statsResponse?.data;
  const lowStockProducts = lowStockResponse?.data || [];
  const recentOrders = (ordersResponse?.data?.items || [])?.slice(0, 5) || [];
  const allOrders = ordersResponse?.data?.items || [];
  const allProducts = productsResponse?.data?.items || [];

  const isLoading = statsLoading || lowStockLoading;

  const revenueData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const revenueByDay = last7Days.map((date) => {
      const dayOrders = allOrders.filter(
        (order) =>
          new Date(order.createdAt).toISOString().split("T")[0] === date &&
          order.status !== "CANCELLED"
      );
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        value: revenue / 1000, // En milliers
        label: new Date(date).toLocaleDateString("fr-FR", {
          weekday: "short",
        }),
        dataPointText: `${(revenue / 1000).toFixed(1)}k`,
      };
    });

    return revenueByDay;
  }, [allOrders]);

  const orderStatusData = useMemo(() => {
    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    allOrders.forEach((order) => {
      statusCounts[order.status as keyof typeof statusCounts]++;
    });

    return [
      {
        value: statusCounts.PENDING,
        label: "En attente",
        frontColor: "#F59E0B",
      },
      {
        value: statusCounts.CONFIRMED,
        label: "Confirmée",
        frontColor: "#3B82F6",
      },
      { value: statusCounts.SHIPPED, label: "Expédiée", frontColor: "#8B5CF6" },
      { value: statusCounts.DELIVERED, label: "Livrée", frontColor: "#10B981" },
      {
        value: statusCounts.CANCELLED,
        label: "Annulée",
        frontColor: "#EF4444",
      },
    ];
  }, [allOrders]);

  const salesByCategoryData = useMemo(() => {
    const categoryRevenue: Record<number, number> = {};

    allOrders.forEach((order) => {
      if (order.status !== "CANCELLED") {
        order.items.forEach((item) => {
          const categoryId = item.product.categoryId;
          if (!categoryRevenue[categoryId]) {
            categoryRevenue[categoryId] = 0;
          }
          categoryRevenue[categoryId] += item.quantity * item.price;
        });
      }
    });

    const colors = [
      "#0174D8",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#84CC16",
    ];

    return Object.entries(categoryRevenue)
      .map(([categoryId, revenue], index) => {
        const category = STATIC_CATEGORIES.find(
          (cat) => cat.id === parseInt(categoryId)
        );
        return {
          value: revenue,
          color: colors[index % colors.length],
          text: `${((revenue / (stats?.totalRevenue || 1)) * 100).toFixed(0)}%`,
          label: category?.name || "Autre",
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [allOrders, stats?.totalRevenue]);

  const isLoading2 = statsLoading || lowStockLoading;

  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchLowStock(), refetchOrders()]);
  };

  if (isLoading2) {
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
        title="Tableau de bord"
        description="Vue d'ensemble de votre boutique"
        noButton={true}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading2} onRefresh={handleRefresh} />
        }
        className="h-[110%]"
        contentContainerStyle={{
          paddingBottom: 80,
        }}
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

          {/* Graphique des revenus */}
          {revenueData.length > 0 && (
            <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <Text className="text-lg font-fbold text-gray-900 mb-4">
                Revenus (7 derniers jours)
              </Text>
              <LineChart
                data={revenueData}
                height={200}
                width={300}
                spacing={44}
                initialSpacing={10}
                color="#0174D8"
                thickness={3}
                startFillColor="rgba(1, 116, 216, 0.3)"
                endFillColor="rgba(1, 116, 216, 0.01)"
                startOpacity={0.9}
                endOpacity={0.2}
                areaChart
                yAxisColor="#E5E7EB"
                xAxisColor="#E5E7EB"
                yAxisTextStyle={{ color: "#6B7280", fontSize: 10 }}
                xAxisLabelTextStyle={{ color: "#6B7280", fontSize: 10 }}
                noOfSections={4}
                hideRules
                curved
                showVerticalLines
                verticalLinesColor="#E5E7EB"
                textShiftY={-8}
                textShiftX={-5}
                textFontSize={10}
                textColor="#6B7280"
              />
            </View>
          )}

          {orderStatusData.length > 0 && (
            <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <Text className="text-lg font-fbold text-gray-900 mb-4">
                Commandes par statut
              </Text>
              <BarChart
                data={orderStatusData}
                height={200}
                width={280}
                barWidth={40}
                spacing={18}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor="#E5E7EB"
                yAxisTextStyle={{ color: "#6B7280", fontSize: 10 }}
                xAxisLabelTextStyle={{
                  color: "#6B7280",
                  fontSize: 9,
                  textAlign: "center",
                }}
                isAnimated
                hideRules
                showGradient
                gradientColor="rgba(200, 200, 200, 0.2)"
              />
            </View>
          )}

          {salesByCategoryData.length > 0 && (
            <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <Text className="text-lg font-fbold text-gray-900 mb-4">
                Ventes par catégorie
              </Text>
              <View className="items-center">
                <PieChart
                  data={salesByCategoryData}
                  donut
                  radius={90}
                  innerRadius={60}
                  centerLabelComponent={() => (
                    <View className="items-center justify-center">
                      <Text className="text-xl font-fbold text-gray-900">
                        {stats?.totalRevenue
                          ? `${(stats.totalRevenue / 1000).toFixed(0)}k`
                          : "0"}
                      </Text>
                      <Text className="text-xs font-fregular text-gray-600">
                        Total
                      </Text>
                    </View>
                  )}
                />
                <View className="mt-4 w-full">
                  {salesByCategoryData.map((item, index) => (
                    <View
                      key={index}
                      className="flex-row items-center justify-between mb-2"
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <Text className="text-sm font-fmedium text-gray-700">
                          {item.label}
                        </Text>
                      </View>
                      <Text className="text-sm font-fbold text-gray-900">
                        {item.value.toLocaleString()} Ar
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
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
                    {order.total.toLocaleString()} Ar
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
