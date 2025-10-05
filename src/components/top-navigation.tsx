import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowLeft } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";

interface TopNavigationProps {
  onPress?: () => void;
  title: string;
  description?: string;
}

export default function TopNavigation({
  title,
  onPress,
  description,
}: TopNavigationProps) {
  const router = useRouter();
  return (
    <View className="bg-primary absolute w-full top-0 rounded-b-[30px] p-6 px-10 z-50">
      <View className="flex flex-row items-center gap-4">
        <TouchableOpacity
          className="bg-white rounded-full p-1"
          onPress={onPress || router.back}
        >
          <ArrowLeft size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <View>
          <Text className="text-white font-fmedium text-xl">{title}</Text>
          <Text className="text-xs text-white">{description}</Text>
        </View>
      </View>
    </View>
  );
}
