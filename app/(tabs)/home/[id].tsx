import { Image, SafeAreaView, Text, View } from "react-native";
import React from "react";
import TopNavigation from "@/components/top-navigation";
import { PRODUCTS } from "../search";
import DividerDashed from "@/components/divider-dashed";
import MinusButton from "@/components/button/MinusButton";
import PlusButton from "@/components/button/PlusButton";
import Button from "@/components/button/button";
// import { useLocalSearchParams } from "expo-router";

export default function ProductDetails() {
  //   const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1">
      <TopNavigation title="Details" />
      <View className="h-full p-5">
        <View className="h-[40%] mt-24 p-5  bg-[#0000001a] rounded-2xl">
          <Image
            source={{ uri: PRODUCTS[0].image }}
            className="rounded-xl h-full"
            resizeMode="contain"
          />
        </View>
        <DividerDashed className="!mt-5 border-[#000]" />
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="font-fmedium text-base mt-2">
              Smartphone Galaxy Pro
            </Text>
            <Text className="font-fbold text-xl text-primary">50000 Ar</Text>
          </View>
          <View>
            <Text className="font-fbold text-xs p-2 bg-[#FECACA] text-[#EF4444] rounded-full px-5 border border-[#EF4444]">
              Promotion
            </Text>
          </View>
        </View>
        <DividerDashed className="!mt-5 border-[#000]" />
        <Text className="mt-2 text-base font-fmedium">Description</Text>
        <Text className="text-sm font-fregular">
          Smartphone haut de gamme avec écran AMOLED 6.5", processeur octa-core,
          appareil photo 64MP et batterie longue durée.
        </Text>
        <DividerDashed className="!mt-5 border-[#000]" />
        <View className="flex flex-row items-center justify-between mt-6">
          <View className="flex flex-row items-center gap-3 rounded-xl border border-[#11111134] p-[2px] px-[3px]">
            <MinusButton onPress={() => {}} />
            <Text className="font-fmedium">10</Text>
            <PlusButton onPress={() => {}} />
          </View>
          <Button label="Ajouter au panier" className="w-auto min-w-[70%]" />
        </View>
      </View>
    </SafeAreaView>
  );
}
