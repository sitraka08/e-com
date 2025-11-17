import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { MapPin, User, Package, CreditCard } from "lucide-react-native";
import { OrderDTO, UpdateOrderStatusDTO } from "@/types";
import OrderStatusSheet from "@/components/admin/bottom-sheets/order-status-sheet";
import { useSellerOrder, useSellerMutations } from "@/hooks/useSeller";
import { Button } from "@/components/button";
import TopNavigation from "@/components/top-navigation";

export default function SellerOrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const { updateOrderStatus } = useSellerMutations();

  const orderId = parseInt(id as string);
  const {
    data: orderResponse,
    isLoading,
    error,
    refetch,
  } = useSellerOrder(orderId);

  const order: OrderDTO | undefined = orderResponse?.data;

  const handleStatusUpdate = async (
    orderId: number,
    data: UpdateOrderStatusDTO
  ) => {
    await updateOrderStatus.mutateAsync({ orderId, data });
    refetch();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100";
      case "CONFIRMED":
        return "bg-blue-100";
      case "PROCESSING":
        return "bg-indigo-100";
      case "SHIPPED":
        return "bg-purple-100";
      case "DELIVERED":
        return "bg-green-100";
      case "CANCELLED":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "CONFIRMED":
        return "Confirmée";
      case "PROCESSING":
        return "En traitement";
      case "SHIPPED":
        return "Expédiée";
      case "DELIVERED":
        return "Livrée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-fmedium text-gray-900 mb-2">
            Commande introuvable
          </Text>
          <Text className="text-sm font-fregular text-gray-600 text-center mb-6">
            Cette commande n'existe pas ou vous n'y avez pas accès.
          </Text>
          <Button
            label="Retour aux commandes"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 ">
      <TopNavigation
        title=" Détails de la commande"
        onPress={() => router.push("/(seller)/orders")}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingTop: 50,
          paddingHorizontal: 10,
        }}
      >
        {/* Order Header */}
        <View className="bg-white p-4 mb-2 rounded-xl">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-sm font-fregular text-gray-500">
                Numéro de commande
              </Text>
              <Text className="text-base font-fsemibold text-gray-900">
                {order.orderNumber}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}
            >
              <Text className="text-sm font-fmedium text-gray-900">
                {getStatusLabel(order.status)}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-fregular text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text className="text-lg font-fbold text-[#0174D8]">
              {order.total?.toLocaleString() || 0} Ar
            </Text>
          </View>
        </View>

        {/* Client Information */}
        <View className="bg-white p-4 mb-2 rounded-xl">
          <View className="flex-row items-center mb-3">
            <User size={20} color="#0174D8" />
            <Text className="text-base font-fsemibold text-gray-900 ml-2">
              Informations client
            </Text>
          </View>
          {order.user && (
            <View>
              <Text className="text-sm font-fmedium text-gray-900">
                {order.user.firstName} {order.user.lastName}
              </Text>
              <Text className="text-sm font-fregular text-gray-600">
                {order.user.email}
              </Text>
            </View>
          )}
        </View>

        {/* Delivery Address */}
        <View className="bg-white p-4 mb-2 rounded-xl">
          <View className="flex-row items-center mb-3">
            <MapPin size={20} color="#0174D8" />
            <Text className="text-base font-fsemibold text-gray-900 ml-2">
              Adresse de livraison
            </Text>
          </View>
          {order.address && (
            <View>
              <Text className="text-sm font-fmedium text-gray-900">
                {order.address.fullName}
              </Text>
              <Text className="text-sm font-fregular text-gray-600 mt-1">
                {order.address.phone}
              </Text>
              <Text className="text-sm font-fregular text-gray-600 mt-2">
                {order.address.street}
              </Text>
              <Text className="text-sm font-fregular text-gray-600">
                {order.address.city}, {order.address.postalCode}
              </Text>
            </View>
          )}
        </View>

        {/* Products List */}
        <View className="bg-white p-4 mb-2 rounded-xl">
          <View className="flex-row items-center mb-3">
            <Package size={20} color="#0174D8" />
            <Text className="text-base font-fsemibold text-gray-900 ml-2">
              Produits ({order.items?.length || 0})
            </Text>
          </View>
          {order.items?.map((item: any, index: number) => (
            <View
              key={index}
              className={`flex-row py-3 ${
                index !== order.items.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <Image
                source={{ uri: item.productImage }}
                className="w-16 h-16 rounded-lg bg-gray-100"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-fmedium text-gray-900">
                  {item.productName}
                </Text>
                <Text className="text-xs font-fregular text-gray-500 mt-1">
                  {(
                    (item as any).priceAtPurchase ||
                    (item as any).priceAtOrder ||
                    (item as any).unitPrice ||
                    0
                  ).toLocaleString()}{" "}
                  Ar/unité
                </Text>
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-xs font-fregular text-gray-600">
                    Quantité: {item.quantity}
                  </Text>
                  <Text className="text-sm font-fsemibold text-gray-900">
                    {(
                      (item as any).subtotal ||
                      (item as any).totalPrice ||
                      0
                    ).toLocaleString()}{" "}
                    Ar
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Financial Summary */}
        <View className="bg-white p-4 mb-2 rounded-xl">
          <Text className="text-base font-fsemibold text-gray-900 mb-3">
            Résumé financier
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between py-1">
              <Text className="text-sm font-fregular text-gray-600">
                Sous-total
              </Text>
              <Text className="text-sm font-fmedium text-gray-900">
                {order.subtotal?.toLocaleString() || 0} Ar
              </Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-sm font-fregular text-gray-600">
                Frais de livraison
              </Text>
              <Text className="text-sm font-fmedium text-gray-900">
                {order.deliveryFee?.toLocaleString() || 0} Ar
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-t border-gray-200">
              <Text className="text-base font-fsemibold text-gray-900">
                Total
              </Text>
              <Text className="text-base font-fbold text-[#0174D8]">
                {order.total?.toLocaleString() || 0} Ar
              </Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-sm font-fregular text-gray-600">Payé</Text>
              <Text className="text-sm font-fsemibold text-green-600">
                {order.totalPaid?.toLocaleString() || 0} Ar
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        {order.payments && order.payments?.length > 0 && (
          <View className="bg-white p-4 mb-2 rounded-xl">
            <View className="flex-row items-center mb-3">
              <CreditCard size={20} color="#0174D8" />
              <Text className="text-base font-fsemibold text-gray-900 ml-2">
                Paiements
              </Text>
            </View>
            {order.payments?.map((payment, index: number) => (
              <View
                key={index}
                className={`py-2 ${
                  index !== (order.payments?.length || 0) - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm font-fmedium text-gray-900">
                      {payment.paymentMethod?.label || "Méthode de paiement"}
                    </Text>
                    <Text className="text-xs font-fregular text-gray-500 mt-1">
                      {payment.transactionId}
                    </Text>
                  </View>
                  <Text className="text-sm font-fsemibold text-gray-900">
                    {payment.amount?.toLocaleString() || 0} Ar
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Button */}
        <View className="p-4 pb-8">
          <Button
            label="Modifier le statut"
            onPress={() => setIsStatusOpen(true)}
            variant="primary"
            disabled={
              order.status === "DELIVERED" || order.status === "CANCELLED"
            }
          />
          {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
            <Text className="text-xs font-fregular text-gray-500 text-center mt-2">
              Les commandes livrées ou annulées ne peuvent pas être modifiées
            </Text>
          )}
        </View>
      </ScrollView>

      <OrderStatusSheet
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        order={order}
        role="SELLER"
        onUpdate={handleStatusUpdate}
        isPending={updateOrderStatus.isPending}
      />
    </SafeAreaView>
  );
}
