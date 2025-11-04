import { View, Text, Image } from "react-native";
import React from "react";
import useCartStore from "@/stores/useCartStore";
import MinusButton from "./button/MinusButton";
import PlusButton from "./button/PlusButton";

type CartItem = {
  id: number;
  name: string;
  price: number;
  images: string[];
  quantity: number;
};

const CartCard = ({ images, price, quantity = 1, id, name }: CartItem) => {
  const { incrementQuantity, decrementQuantity } = useCartStore();
  return (
    <View className="my-2 flex flex-row items-center justify-between gap-3">
      <View className="flex-row items-center w-[70%] gap-2">
        <View className="items-center justify-center bg-[#bdc9d1] rounded-xl p-2">
          <Image
            source={{ uri: images[0] }}
            resizeMode="cover"
            className="h-16 w-16 rounded"
          />
        </View>

        <View className="flex-1 ">
          <Text className="font-fmedium text-sm">{name}</Text>
          <Text className="font-fsemibold  text-primary text-base">
            {price}
          </Text>
        </View>
      </View>
      <View>
        <View className="flex flex-row items-center gap-3 rounded-xl border border-[#11111134] p-[2px] px-[3px]">
          <MinusButton onPress={() => decrementQuantity(id)} />
          <Text className="font-fmedium">{quantity}</Text>
          <PlusButton onPress={() => incrementQuantity(id)} />
        </View>
      </View>
    </View>
  );
};

export default CartCard;
