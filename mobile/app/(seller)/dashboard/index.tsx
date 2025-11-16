import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, BarChart } from "react-native-gifted-charts";
import StatCard from "@/components/admin/stat-card";
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react-native";
import { useSellerStats } from "@/hooks/useSeller";
import TopNavigation from "@/components/top-navigation";

export default function SellerDashboard() {
  const { data, isLoading, error, refetch } = useSellerStats();
  const stats = data?.data;

  // Données pour le graphique de revenu (simulé sur 7 jours)
  const revenueData = useMemo(() => {
    if (!stats?.totalRevenue) return [];

    const avgDaily = stats.totalRevenue / 30; // Moyenne sur 30 jours
    return Array.from({ length: 7 }, (_, i) => {
      const variance = (Math.random() - 0.5) * 0.4; // Variance de ±20%
      const value = avgDaily * 7 * (1 + variance);
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));

      return {
        value: value / 1000, // En milliers
        label: date.toLocaleDateString("fr-FR", { weekday: "short" }),
        dataPointText: `${(value / 1000).toFixed(1)}k`,
      };
    });
  }, [stats?.totalRevenue]);

  // Données pour le graphique de produits
  const productData = useMemo(() => {
    if (!stats) return [];

    return [
      {
        value: stats.activeProducts,
        label: "Actifs",
        frontColor: "#10B981",
      },
      {
        value: stats.totalProducts - stats.activeProducts,
        label: "Inactifs",
        frontColor: "#EF4444",
      },
    ];
  }, [stats]);

  const handleRefresh = async () => {
    await refetch();
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

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-base font-fmedium text-gray-600 text-center mb-4">
            Impossible de charger les statistiques
          </Text>
          <Text
            className="text-primary font-fsemibold"
            onPress={() => refetch()}
          >
            Réessayer
          </Text>
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
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        className="h-[110%]"
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View className="px-5 pb-4 pt-24">
          {/* Stat Cards en grille 2x2 */}
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <StatCard
                title="Revenu Total"
                value={`${(stats?.totalRevenue || 0).toLocaleString()} Ar`}
                icon={DollarSign}
                iconColor="#10B981"
                iconBgColor="#D1FAE5"
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Commission"
                value={`${(stats?.totalCommission || 0).toLocaleString()} Ar`}
                icon={TrendingUp}
                iconColor="#F59E0B"
                iconBgColor="#FEF3C7"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard
                title="Produits Actifs"
                value={stats?.activeProducts || 0}
                icon={Package}
                iconColor="#0174D8"
                iconBgColor="#E0F2FE"
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Commandes"
                value={stats?.totalOrders || 0}
                icon={ShoppingCart}
                iconColor="#8B5CF6"
                iconBgColor="#EDE9FE"
              />
            </View>
          </View>

          {/* Graphique des revenus */}
          {revenueData.length > 0 && (
            <View className="mt-5 bg-white rounded-xl p-4 border border-gray-200">
              <Text className="text-lg font-fbold text-gray-800 mb-4">
                Revenus (7 derniers jours)
              </Text>
              <LineChart
                data={revenueData}
                width={300}
                height={200}
                color="#0174D8"
                thickness={3}
                dataPointsColor="#0174D8"
                startFillColor="#0174D8"
                endFillColor="#0174D820"
                startOpacity={0.9}
                endOpacity={0.2}
                initialSpacing={10}
                noOfSections={4}
                yAxisColor="#E5E7EB"
                xAxisColor="#E5E7EB"
                yAxisTextStyle={{ color: "#6B7280", fontSize: 10 }}
                xAxisLabelTextStyle={{ color: "#6B7280", fontSize: 10 }}
                curved
                areaChart
              />
            </View>
          )}

          {/* Graphique des produits */}
          {productData.length > 0 && (
            <View className="mt-5 bg-white rounded-xl p-4 border border-gray-200">
              <Text className="text-lg font-fbold text-gray-800 mb-4">
                Répartition des produits
              </Text>
              <View className="items-center">
                <BarChart
                  data={productData}
                  width={250}
                  height={200}
                  barWidth={60}
                  spacing={40}
                  roundedTop
                  roundedBottom
                  noOfSections={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisTextStyle={{ color: "#6B7280", fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: "#6B7280", fontSize: 10 }}
                />
              </View>
              <View className="flex-row justify-center gap-6 mt-4">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <Text className="text-sm font-fmedium text-gray-600">
                    Actifs ({stats?.activeProducts})
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <Text className="text-sm font-fmedium text-gray-600">
                    Inactifs ({(stats?.totalProducts || 0) - (stats?.activeProducts || 0)})
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Informations supplémentaires */}
          <View className="mt-5 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <Text className="text-sm font-fmedium text-blue-800 mb-2">
              📊 Résumé de votre activité
            </Text>
            <Text className="text-xs font-fregular text-blue-700">
              Vous avez {stats?.totalProducts || 0} produit(s) au total dont{" "}
              {stats?.activeProducts || 0} actif(s).{" "}
              {stats?.pendingOrders || 0} commande(s) en attente de traitement.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
