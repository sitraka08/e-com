import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ProductType } from "@/types/product";
import { ShoppingCart } from "lucide-react-native";
import useCartStore from "@/stores/useCartStore";

export default function ProductCard(product: ProductType) {
  const { image, name, price } = product;
  const { addItem, getTotal } = useCartStore();

  console.log(getTotal(), "haha");
  return (
    <View className="bg-white flex items-center justify-center rounded-3xl p-4 relative">
      <View className="flex w-full h-[140px] items-center justify-center bg-secondary rounded-2xl p-5">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />
      </View>
      <View className="w-full">
        <Text className="text font-fmedium text-sm mt-2">{name}</Text>
        <Text className="text font-fbold text-base text-primary">{price}</Text>
      </View>
      <TouchableOpacity
        className="absolute bottom-5 right-5 rounded-full border p-2 bg-secondary border-[#8d8d8d48]"
        onPress={() => addItem(product)}
      >
        <ShoppingCart size={16} />
      </TouchableOpacity>
    </View>
  );
}
