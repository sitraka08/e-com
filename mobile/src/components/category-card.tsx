import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LucideIcon } from "lucide-react-native";
import { COLORS } from "@/constants/colors";

interface CategoryCardProps {
  id: number;
  name: string;
  icon: LucideIcon;
  title: string;
  active: boolean;
  onPress: (id: number) => void;
}

export default function CategoryCard({
  id,
  icon,
  name,
  onPress,
  title,
  active,
}: CategoryCardProps) {
  const Icon = icon;
  return (
    <TouchableOpacity
      className={`bg-secondary p-3 rounded-xl flex items-center justify-center border border-[#b6def1bd] ${active && "!bg-primary"}`}
      onPress={() => onPress(id)}
    >
      <View
        className={`h-10 flex items-center justify-center w-10 bg-primary rounded-full ${active && "bg-white"}`}
      >
        <Text className="text-lg">
          {<Icon color={active ? COLORS.primary : "#fff"} />}
        </Text>
      </View>
      <Text className={`text-xs font-fmedium ${active && "text-white"}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
