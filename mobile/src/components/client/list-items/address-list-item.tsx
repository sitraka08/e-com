import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AddressDTO } from "@/types";
import { MapPin, Pencil, Trash2, Star } from "lucide-react-native";

interface AddressListItemProps {
  address: AddressDTO;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export default function AddressListItem({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListItemProps) {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-fbold text-gray-900">{address.label}</Text>
            {address.isDefault && (
              <View className="bg-primary/10 px-2 py-1 rounded">
                <Text className="text-primary text-xs font-fmedium">Par défaut</Text>
              </View>
            )}
          </View>
          <Text className="text-sm font-fmedium text-gray-700 mt-1">{address.fullName}</Text>
          <Text className="text-sm font-fregular text-gray-600 mt-1">{address.phone}</Text>
        </View>
      </View>

      <View className="flex-row items-start gap-2 mb-3">
        <MapPin size={16} color="#9CA3AF" className="mt-1" />
        <Text className="flex-1 text-sm font-fregular text-gray-600">
          {address.street}, {address.city}, {address.region}
          {address.postalCode && ` ${address.postalCode}`}
        </Text>
      </View>

      <View className="flex-row gap-2">
        {!address.isDefault && (
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
