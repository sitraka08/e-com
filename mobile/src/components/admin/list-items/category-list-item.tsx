import React from "react";
import { View, Text } from "react-native";
import { CategoryDTO } from "@/types";
import { Pencil, Trash2 } from "lucide-react-native";
import { Button } from "../../button";

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
        <Button
          label="Modifier"
          variant="action"
          actionColor="gray"
          size="sm"
          iconLeft={<Pencil size={16} color="#6B7280" />}
          onPress={onEdit}
          className="flex-1 p-2"
        />
        <Button
          label="Supprimer"
          variant="action"
          actionColor="red"
          size="sm"
          iconLeft={<Trash2 size={16} color="#EF4444" />}
          onPress={onDelete}
          className="flex-1 p-2"
        />
      </View>
    </View>
  );
}
