import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { filterImage } from "utils/utils";

interface CategoryCardProps {
  name: string;
  icon: string;
}

export default function CategoryCard({ icon, name }: CategoryCardProps) {
  return (
    <TouchableOpacity className="bg-[#e4f2fc] p-3 rounded-xl flex items-center justify-center border border-[#b6d1f1]">
      <View className="h-10 flex items-center justify-center w-10 bg-primary rounded-full">
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className="text-xs  font-fmedium">{name}</Text>
    </TouchableOpacity>
  );
}
