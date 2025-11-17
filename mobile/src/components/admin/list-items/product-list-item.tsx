import React from "react";
import { View, Text, Image } from "react-native";
import { ProductDTO } from "@/types";
import { Pencil, Trash2, Package } from "lucide-react-native";
import { Button } from "../../button";
import { cn } from "@/utils/utils";

interface ProductListItemProps {
  product: ProductDTO;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdateStock: () => void;
  readOnly?: boolean;
}

export default function ProductListItem({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
  readOnly = false,
}: ProductListItemProps) {
  const isLowStock = product.stock < 10;

  return (
    <View
      className={cn(
        " rounded-xl bg-white p-4 mb-3 border border-gray-200 relative",
        product.isActive ? "" : "opacity-70"
      )}
    >
      {!product.isActive && (
        <View className="absolute opacity-100 right-2 top-2">
          <Text className=" bg-red-700 px-5 rounded-full text-xs font-fmedium text-white">
            Supprimé
          </Text>
        </View>
      )}
      <View className="flex-row">
        <Image
          source={{
            uri: product.images?.[0] || "https://via.placeholder.com/80",
          }}
          className="w-20 h-20 rounded-lg bg-gray-100"
        />

        <View className="flex-1 ml-3">
          <Text className="text-lg font-fbold text-gray-900" numberOfLines={1}>
            {product.name}
          </Text>
          <Text
            className="text-sm font-fregular text-gray-600 mt-1"
            numberOfLines={1}
          >
            {product.categoryName || "Sans catégorie"}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-base font-fbold text-primary">
              {product.price.toLocaleString()} Ar
            </Text>
            <View
              className={`ml-3 px-2 py-1 rounded ${isLowStock ? "bg-red-100" : "bg-green-100"}`}
            >
              <Text
                className={`text-xs font-fmedium ${isLowStock ? "text-red-700" : "text-green-700"}`}
              >
                Stock: {product.stock}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {product.isActive && (
        <View className="flex-row mt-3 gap-2">
          <Button
            label="Stock"
            variant="action"
            actionColor="blue"
            size="sm"
            iconLeft={<Package size={16} color="#3B82F6" />}
            onPress={onUpdateStock}
            className="flex-1 p-2"
          />
          {!readOnly && onEdit && (
            <Button
              label="Modifier"
              variant="action"
              actionColor="gray"
              size="sm"
              iconLeft={<Pencil size={16} color="#6B7280" />}
              onPress={onEdit}
              className="flex-1 p-2"
            />
          )}
          {!readOnly && onDelete && (
            <Button
              label="Supprimer"
              variant="action"
              actionColor="red"
              size="sm"
              iconLeft={<Trash2 size={16} color="#EF4444" />}
              onPress={onDelete}
              className="flex-1 p-2"
            />
          )}
        </View>
      )}
    </View>
  );
}
