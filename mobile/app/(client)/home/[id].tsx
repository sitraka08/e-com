import {
  Image,
  SafeAreaView,
  Text,
  ToastAndroid,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import TopNavigation from "@/components/top-navigation";
import DividerDashed from "@/components/divider-dashed";
import MinusButton from "@/components/button/MinusButton";
import PlusButton from "@/components/button/PlusButton";
import Button from "@/components/button/button";
import { useLocalSearchParams } from "expo-router";
import { useProducts } from "@/hooks/use-products";
import useCartStore from "@/stores/useCartStore";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { data: productsResponse, isLoading } = useProducts();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = productsResponse?.data?.items?.find(
    (p) => p.id.toString() === id
  );

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      ToastAndroid.showWithGravity(
        `${quantity} ${product.name} ajouté(s) au panier`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      setQuantity(1);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <TopNavigation title="Details" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0174D8" />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1">
        <TopNavigation title="Details" />
        <View className="flex-1 items-center justify-center p-5">
          <Text className="text-lg font-fmedium text-gray-600">
            Produit non trouvé
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <TopNavigation title="Details" />
      <View className="h-full p-5">
        <View className="h-[40%] mt-24 p-5  bg-[#0000001a] rounded-2xl">
          <Image
            source={{ uri: product.images[0] }}
            className="rounded-xl h-full"
            resizeMode="contain"
          />
        </View>
        <DividerDashed className="!mt-5 border-[#000]" />
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="font-fmedium text-base mt-2">{product.name}</Text>
            <Text className="font-fbold text-xl text-primary">
              {product.price.toLocaleString()} Ar
            </Text>
          </View>
          <View>
            <Text className="font-fbold text-xs p-2 bg-[#D1FAE5] text-[#10B981] rounded-full px-5 border border-[#10B981]">
              Stock: {product.stock}
            </Text>
          </View>
        </View>
        <DividerDashed className="!mt-5 border-[#000]" />
        <Text className="mt-2 text-base font-fmedium">Description</Text>
        <Text className="text-sm font-fregular">{product.description}</Text>
        <DividerDashed className="!mt-5 border-[#000]" />
        <View className="flex flex-row items-center justify-between mt-6">
          <View className="flex flex-row items-center gap-3 rounded-xl border border-[#11111134] p-[2px] px-[3px]">
            <MinusButton
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <Text className="font-fmedium">{quantity}</Text>
            <PlusButton
              onPress={() =>
                setQuantity((q) => Math.min(product.stock, q + 1))
              }
            />
          </View>
          <Button
            label="Ajouter au panier"
            className="w-auto min-w-[70%]"
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
