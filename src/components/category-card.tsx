import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface CategoryCardProps {
  name: string;
  icon: string;
  title: string;
  active: boolean;
  onPress: (name: string) => void;
}

export default function CategoryCard({
  icon,
  name,
  onPress,
  title,
  active,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      className={`bg-[#e4f2fc] p-3 rounded-xl flex items-center justify-center border border-[#b6d1f1] ${active && "bg-primary"}`}
      onPress={() => onPress(name)}
    >
      <View
        className={`h-10 flex items-center justify-center w-10 bg-primary rounded-full ${active && "bg-white"}`}
      >
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className={`text-xs font-fmedium ${active && "text-white"}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
