import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React from "react";
import { ProductDTO } from "@/types";
import { Heart, ShoppingCart } from "lucide-react-native";
import useCartStore from "@/stores/useCartStore";
import { useRouter } from "expo-router";
import useFavorisStore from "@/stores/useFavorisStore";
import { cn } from "@/utils/utils";

export default function ProductCard(product: ProductDTO) {
  const { images, name, price } = product;
  const { addItem } = useCartStore();
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorisStore();

  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className="bg-white flex items-center justify-center rounded-3xl p-4 relative"
      onPress={() => router.push(`/(client)/home/${product.id}`)}
    >
      <View className="flex w-full h-[140px] items-center justify-center bg-[#0000001a] rounded-2xl p-5">
        <Image
          source={{ uri: images[0] }}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />
      </View>
      <View className="w-full">
        <Text className="text font-fmedium text-xs mt-2">{name}</Text>
        <Text className="text font-fbold text-base text-primary">{price}</Text>
      </View>
      <TouchableOpacity
        className={cn(
          "absolute top-5 right-5 rounded-full border p-2 bg-[#f7d7d7] border-[#ce0f0f48]",
          isFavorite(product.id) ? "bg-[#c05050]" : ""
        )}
        onPress={() => {
          toggleFavorite();
        }}
      >
        <Heart size={12} />
      </TouchableOpacity>
      <TouchableOpacity
        className="absolute bottom-5 right-5 rounded-full border p-2 bg-secondary border-[#8d8d8d48]"
        onPress={() => {
          addItem(product);
          ToastAndroid.showWithGravity(
            `Produit ajouté au panier`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }}
      >
        <ShoppingCart size={12} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
