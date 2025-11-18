import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { OrderDTO } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X } from "lucide-react-native";
import { useOrderMutations } from "@/hooks/use-orders";

interface OrderCardProps {
  order: OrderDTO;
  onPress?: () => void;
}

const statusConfig = {
  PENDING: {
    label: "En attente",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-300",
  },
  CONFIRMED: {
    label: "Confirmée",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
  },
  SHIPPED: {
    label: "Expédiée",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-300",
  },
  PROCESSING: {
    label: "En cours",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-300",
  },
  DELIVERED: {
    label: "Livrée",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-300",
  },
  CANCELLED: {
    label: "Annulée",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-300",
  },
};

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const status = statusConfig[order.status];
  const orderDate = new Date(order.createdAt);
  const firstImage = order.items?.[0]?.product?.images?.[0];
  const itemCount = order.items?.length || 0;
  const { cancelOrder } = useOrderMutations();

  // Can cancel if status is PENDING, CONFIRMED, or PROCESSING
  const canCancel = ["PENDING", "CONFIRMED", "PROCESSING"].includes(
    order.status
  );

  const handleCancelOrder = () => {
    Alert.alert(
      "Confirmer l'annulation",
      "Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.",
      [
        {
          text: "Non",
          style: "cancel",
        },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: async () => {
            await cancelOrder.mutateAsync(order.id);
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-3"
      activeOpacity={0.7}
    >
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="font-fbold text-base mb-1">
            Commande #{order.orderNumber}
          </Text>
          <Text className="font-fregular text-sm text-gray-600">
            {format(orderDate, "d MMMM yyyy à HH:mm", { locale: fr })}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full border ${status.borderColor} ${status.bgColor}`}
        >
          <Text className={`font-fmedium text-xs`}>{status.label}</Text>
        </View>
      </View>

      {/* Aperçu des produits */}
      <View className="flex flex-row items-center mb-3">
        {firstImage && (
          <Image
            source={{ uri: firstImage }}
            className="w-16 h-16 rounded-lg mr-3"
            resizeMode="cover"
          />
        )}
        <View className="flex-1">
          <Text className="font-fmedium text-sm text-gray-700">
            {itemCount} {itemCount > 1 ? "articles" : "article"}
          </Text>
          {order.items?.[0] && (
            <Text
              className="font-fregular text-xs text-gray-500 mt-1"
              numberOfLines={1}
            >
              {order.items[0].product?.name}
              {itemCount > 1 && ` et ${itemCount - 1} autre(s)`}
            </Text>
          )}
        </View>
      </View>

      {/* Totaux */}
      <View className="border-t border-gray-200 pt-3 flex flex-row justify-between items-center">
        <View>
          <Text className="font-fregular text-xs text-gray-600">Total</Text>
          <Text className="font-fbold text-lg text-primary">
            {order.total.toLocaleString()} Ar
          </Text>
        </View>
        {order.balance > 0 && (
          <View className="bg-red-50 px-3 py-1 rounded-full border border-red-200">
            <Text className="font-fmedium text-xs text-red-700">
              Reste: {order.balance.toLocaleString()} Ar
            </Text>
          </View>
        )}
        {order.balance === 0 && order.totalPaid > 0 && (
          <View className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <Text className="font-fmedium text-xs text-green-700">Payé</Text>
          </View>
        )}
      </View>

      {/* Cancel Button */}
      {canCancel && (
        <View className="border-t border-gray-200 mt-3 pt-3">
          <TouchableOpacity
            onPress={handleCancelOrder}
            className="flex-row items-center justify-center bg-red-50 border border-red-200 rounded-lg py-3 px-4"
            activeOpacity={0.7}
            disabled={cancelOrder.isPending}
          >
            <X size={18} color="#dc2626" />
            <Text className="font-fmedium text-sm text-red-600 ml-2">
              {cancelOrder.isPending ? "Annulation..." : "Annuler la commande"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
