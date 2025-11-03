import React from "react";
import { View, Text, Image } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { IMAGES } from "@/constants/image";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Image source={IMAGES.empty} resizeMode="contain" className="w-32 h-32" />
      <Text className="text-xl font-fbold text-primary">{title}</Text>
      <Text className="text-sm font-fregular text-gray-500 mt-2 text-center">
        {message}
      </Text>
    </View>
  );
}
