import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CategoryDTO } from "@/types";
import { Pencil, Trash2 } from "lucide-react-native";

interface CategoryListItemProps {
  category: CategoryDTO;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryListItem({
  category,
  onEdit,
  onDelete,
}: CategoryListItemProps) {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-fbold text-gray-900" numberOfLines={1}>
            {category.name}
          </Text>
          <Text className="text-sm font-fregular text-gray-600 mt-1" numberOfLines={1}>
            {category.slug}
          </Text>
          {category.description && (
            <Text className="text-xs font-fregular text-gray-500 mt-1" numberOfLines={2}>
              {category.description}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row mt-3 gap-2">
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
