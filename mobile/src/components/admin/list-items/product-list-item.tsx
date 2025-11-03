import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ProductDTO } from '@/types';
import { Pencil, Trash2, Package } from 'lucide-react-native';

interface ProductListItemProps {
  product: ProductDTO;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStock: () => void;
}

export default function ProductListItem({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
}: ProductListItemProps) {
  const isLowStock = product.stock < 10;

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row">
        <Image
          source={{
            uri: product.images?.[0] || 'https://via.placeholder.com/80',
          }}
          className="w-20 h-20 rounded-lg bg-gray-100"
        />

        <View className="flex-1 ml-3">
          <Text className="text-lg font-fbold text-gray-900" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="text-sm font-fregular text-gray-600 mt-1" numberOfLines={1}>
            {product.categoryName || 'Sans catégorie'}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-base font-fbold text-primary">
              {product.price.toLocaleString()} Ar
            </Text>
            <View
              className={`ml-3 px-2 py-1 rounded ${isLowStock ? 'bg-red-100' : 'bg-green-100'}`}
            >
              <Text
                className={`text-xs font-fmedium ${isLowStock ? 'text-red-700' : 'text-green-700'}`}
              >
                Stock: {product.stock}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row mt-3 gap-2">
        <TouchableOpacity
          onPress={onUpdateStock}
          className="flex-1 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
        >
          <Package size={16} color="#3B82F6" />
          <Text className="text-blue-600 font-fmedium text-xs ml-1">Stock</Text>
        </TouchableOpacity>
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
