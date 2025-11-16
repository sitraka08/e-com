import React from "react";
import { View, Text, Image } from "react-native";
import { IMAGES } from "@/constants/image";
import { cn } from "@/utils/utils";

interface EmptyStateProps {
  title: string;
  message: string;
  className?: string;
}

export default function EmptyState({
  title,
  message,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn("flex-1 items-center justify-center px-8", className)}>
      <Image source={IMAGES.empty} resizeMode="contain" className="w-32 h-32" />
      <Text className="text-xl font-fbold text-primary">{title}</Text>
      <Text className="text-sm font-fregular text-gray-500 mt-2 text-center">
        {message}
      </Text>
    </View>
  );
}
