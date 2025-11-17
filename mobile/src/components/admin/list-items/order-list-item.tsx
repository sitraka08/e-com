import React from "react";
import { View, Text } from "react-native";
import { OrderDTO } from "@/types";
import { Eye, Edit } from "lucide-react-native";
import { Button } from "../../button";

interface OrderListItemProps {
  order: OrderDTO;
  onViewDetails: () => void;
  onUpdateStatus?: () => void;
}

export default function OrderListItem({
  order,
  onViewDetails,
  onUpdateStatus,
}: OrderListItemProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100";
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

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-orange-700";
      case "CONFIRMED":
        return "text-blue-700";
      case "PROCESSING":
        return "text-indigo-700";
      case "SHIPPED":
        return "text-purple-700";
      case "DELIVERED":
        return "text-green-700";
      case "CANCELLED":
        return "text-red-700";
      default:
        return "text-gray-700";
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

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-fbold text-gray-900">
              #{order.orderNumber}
            </Text>
            <View
              className={`px-2 py-1 rounded ${getStatusBadgeColor(order.status)}`}
            >
              <Text
                className={`text-xs font-fmedium ${getStatusTextColor(order.status)}`}
              >
                {getStatusLabel(order.status)}
              </Text>
            </View>
          </View>

          <Text className="text-sm font-fregular text-gray-600 mt-1">
            Client: {order.user?.firstName} {order.user?.lastName}
          </Text>

          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-sm font-fmedium text-gray-500">
              {formatDate(order.createdAt)}
            </Text>
            <Text className="text-lg font-fbold text-primary">
              {order.total.toLocaleString()} Ar
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2 mt-3">
        <Button
          label="Voir les détails"
          variant="action"
          actionColor="blue"
          size="sm"
          iconLeft={<Eye size={16} color="#3B82F6" />}
          onPress={onViewDetails}
          className="flex-1 p-3"
        />
        {/* {onUpdateStatus && (
          <Button
            label="Statut"
            variant="action"
            actionColor="gray"
            size="sm"
            iconLeft={<Edit size={16} color="#6B7280" />}
            onPress={onUpdateStatus}
            className="flex-1 p-3"
          />
        )} */}
      </View>
    </View>
  );
}
