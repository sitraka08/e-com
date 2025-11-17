import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PaymentMethodDTO } from "@/types";
import { CreditCard, Smartphone, Banknote, Pencil, Trash2, Star } from "lucide-react-native";

interface PaymentMethodListItemProps {
  paymentMethod: PaymentMethodDTO;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const getPaymentIcon = (type: string) => {
  switch (type) {
    case "MOBILE_MONEY":
      return <Smartphone size={20} color="#3B82F6" />;
    case "CREDIT_CARD":
      return <CreditCard size={20} color="#10B981" />;
    case "BANK_TRANSFER":
      return <Banknote size={20} color="#F59E0B" />;
    case "CASH_ON_DELIVERY":
      return <Banknote size={20} color="#6B7280" />;
    default:
      return <CreditCard size={20} color="#6B7280" />;
  }
};

const getPaymentTypeLabel = (type: string) => {
  switch (type) {
    case "MOBILE_MONEY":
      return "Mobile Money";
    case "CREDIT_CARD":
      return "Carte bancaire";
    case "BANK_TRANSFER":
      return "Virement bancaire";
    case "CASH_ON_DELIVERY":
      return "Paiement à la livraison";
    default:
      return type;
  }
};

export default function PaymentMethodListItem({
  paymentMethod,
  onEdit,
  onDelete,
  onSetDefault,
}: PaymentMethodListItemProps) {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 flex-row items-start gap-3">
          <View className="bg-gray-50 p-2 rounded-lg">
            {getPaymentIcon(paymentMethod.type)}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-fbold text-gray-900">{paymentMethod.label}</Text>
              {paymentMethod.isDefault && (
                <View className="bg-primary/10 px-2 py-1 rounded">
                  <Text className="text-primary text-xs font-fmedium">Par défaut</Text>
                </View>
              )}
            </View>
            <Text className="text-sm font-fregular text-gray-600 mt-1">
              {getPaymentTypeLabel(paymentMethod.type)}
            </Text>
            {paymentMethod.details && Object.keys(paymentMethod.details).length > 0 && (
              <Text className="text-xs font-fregular text-gray-500 mt-1">
                {paymentMethod.type === "MOBILE_MONEY" && paymentMethod.details.phoneNumber &&
                  `${paymentMethod.details.phoneNumber}`}
                {paymentMethod.type === "CREDIT_CARD" && paymentMethod.details.last4 &&
                  `•••• ${paymentMethod.details.last4}`}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row gap-2">
        {!paymentMethod.isDefault && (
          <TouchableOpacity
            onPress={onSetDefault}
            className="flex-1 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
          >
            <Star size={16} color="#3B82F6" />
            <Text className="text-blue-600 font-fmedium text-xs ml-1">Défaut</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onEdit}
          className="flex-1 bg-gray-50 rounded-lg p-2 flex-row items-center justify-center"
        >
          <Pencil size={16} color="#6B7280" />
          <Text className="text-gray-700 font-fmedium text-xs ml-1">Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          className="flex-1 bg-red-50 rounded-lg p-2 flex-row items-center justify-center"
        >
          <Trash2 size={16} color="#EF4444" />
          <Text className="text-red-600 font-fmedium text-xs ml-1">Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
