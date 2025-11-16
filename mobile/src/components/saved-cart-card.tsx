import { View, Text, TouchableOpacity } from "react-native";
import { SavedCartDTO } from "@/types/api.types";
import { ShoppingCart, Trash2, RotateCcw } from "lucide-react-native";

interface SavedCartCardProps {
  cart: SavedCartDTO;
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function SavedCartCard({
  cart,
  onRestore,
  onDelete,
}: SavedCartCardProps) {
  const itemCount = cart.items.length;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-fbold text-gray-800">{cart.name}</Text>
          <Text className="text-sm font-fregular text-gray-500 mt-1">
            {itemCount} produit{itemCount > 1 ? "s" : ""} • {totalItems} article
            {totalItems > 1 ? "s" : ""}
          </Text>
        </View>
        <View className="bg-primary/10 rounded-full p-2">
          <ShoppingCart size={20} color="#0174D8" />
        </View>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onRestore(cart.id)}
          className="flex-1 bg-primary rounded-lg py-3 flex-row items-center justify-center gap-2"
        >
          <RotateCcw size={16} color="white" />
          <Text className="text-white font-fsemibold">Restaurer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(cart.id)}
          className="bg-red-50 rounded-lg py-3 px-4 flex-row items-center justify-center"
        >
          <Trash2 size={16} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
